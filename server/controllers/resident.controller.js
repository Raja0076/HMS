import { Resident, Room, User } from '../models/index.js';


/**
 * GET /api/residents
 * Admin, Staff — list all residents with filters
 * Query params: ?building_id=  ?room_id=  ?resident_type=  ?page=  ?limit=
 */
const getAllResidents = async (req, res) => {
  try {
    const { building_id, room_id, resident_type, page = 1, limit = 20 } = req.query;
 
    const filter = {};
    if (building_id)    filter.building_id = building_id;
    if (room_id)        filter.room_id = room_id;
    if (resident_type)  filter.resident_type = resident_type;
 
    // Only show currently checked-in residents by default
    filter.check_out_date = null;
 
    const skip = (Number(page) - 1) * Number(limit);
 
    const [residents, total] = await Promise.all([
      Resident.find(filter)
        .populate("user_id", "fullname email mobile status")
        .populate("room_id", "room_number room_type")
        .populate("building_id", "building_name city")
        .skip(skip)
        .limit(Number(limit))
        .sort({ check_in_date: -1 }),
      Resident.countDocuments(filter),
    ]);
 
    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      residents,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch residents.", error: err.message });
  }
};
 
/**
 * GET /api/residents/:id
 * Protected — resident can only fetch their own; admin/staff can fetch any
 */
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id)
      .populate("user_id", "fullname email mobile username")
      .populate("room_id", "room_number room_type floor_no monthly_rent")
      .populate("building_id", "building_name address city");
 
    if (!resident) {
      return res.status(404).json({ message: "Resident not found." });
    }
 
    // Residents can only view their own profile
    if (
      req.user.role === "resident" &&
      resident.user_id._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied." });
    }
 
    res.status(200).json({ resident });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resident.", error: err.message });
  }
};
 
/**
 * PUT /api/residents/:id
 * Protected — residents can update their own profile fields
 * Admin/staff can update any
 */
const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
 
    if (!resident) {
      return res.status(404).json({ message: "Resident not found." });
    }
 
    // Residents can only update their own profile
    if (
      req.user.role === "resident" &&
      resident.user_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied." });
    }
 
    // Residents cannot change their own room, building, or check-in date
    if (req.user.role === "resident") {
      delete req.body.room_id;
      delete req.body.building_id;
      delete req.body.check_in_date;
      delete req.body.check_out_date;
    }
 
    const updated = await Resident.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("user_id", "fullname email");
 
    res.status(200).json({ message: "Resident updated successfully.", resident: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update resident.", error: err.message });
  }
};
 
/**
 * POST /api/residents/:id/assign-room
 * Admin, Staff — assign a room to a resident
 * Body: { room_id, check_in_date }
 */
const assignRoom = async (req, res) => {
  try {
    const { room_id, check_in_date } = req.body;
 
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found." });
    }
 
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
 
    if (room.status === "full" || room.current_occupancy >= room.capacity) {
      return res.status(400).json({ message: "Room is at full capacity." });
    }
 
    if (room.status === "under_maintenance") {
      return res.status(400).json({ message: "Room is under maintenance." });
    }
 
    // Free the previous room if the resident was already in one
    if (resident.room_id) {
      await Room.findByIdAndUpdate(resident.room_id, {
        $inc: { current_occupancy: -1 },
      });
      // Recalculate previous room status
      const prevRoom = await Room.findById(resident.room_id);
      if (prevRoom && prevRoom.current_occupancy < prevRoom.capacity) {
        await Room.findByIdAndUpdate(resident.room_id, { status: "available" });
      }
    }
 
    // Assign new room
    resident.room_id     = room._id;
    resident.building_id = room.building_id;
    resident.check_in_date = check_in_date || new Date();
    resident.check_out_date = null;
    await resident.save();
 
    // Update room occupancy
    const newOccupancy = room.current_occupancy + 1;
    await Room.findByIdAndUpdate(room_id, {
      current_occupancy: newOccupancy,
      status: newOccupancy >= room.capacity ? "full" : "occupied",
    });
 
    res.status(200).json({
      message: "Room assigned successfully.",
      resident,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign room.", error: err.message });
  }
};
 
/**
 * POST /api/residents/:id/checkout
 * Admin, Staff — check out a resident and free up the room
 */
const checkoutResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found." });
    }
 
    if (!resident.room_id) {
      return res.status(400).json({ message: "Resident is not assigned to any room." });
    }
 
    // Free the room
    const room = await Room.findById(resident.room_id);
    if (room) {
      const newOccupancy = Math.max(0, room.current_occupancy - 1);
      await Room.findByIdAndUpdate(room._id, {
        current_occupancy: newOccupancy,
        status: newOccupancy === 0 ? "available" : "occupied",
      });
    }
 
    // Clear resident's room assignment
    resident.check_out_date = req.body.check_out_date || new Date();
    resident.room_id        = null;
    resident.building_id    = null;
    await resident.save();
 
    res.status(200).json({
      message: "Resident checked out successfully.",
      resident,
    });
  } catch (err) {
    res.status(500).json({ message: "Checkout failed.", error: err.message });
  }
};
 
export {
  getAllResidents,
  getResidentById,
  updateResident,
  assignRoom,
  checkoutResident,
};
 