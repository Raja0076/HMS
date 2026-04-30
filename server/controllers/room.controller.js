import { Room, Resident, Floor, Building } from '../models/index.js';

/**
 * GET /api/rooms
 * All authenticated users — list/filter rooms
 * Query params: ?building_id=  ?floor_id=  ?room_type=  ?status=  ?page=  ?limit=
 */
const getAllRooms = async (req, res) => {
  try {
    const {
      building_id, floor_id, room_type,
      status, page = 1, limit = 20,
    } = req.query;
 
    const filter = {};
    if (building_id) filter.building_id = building_id;
    if (floor_id)    filter.floor_id    = floor_id;
    if (room_type)   filter.room_type   = room_type;
    if (status)      filter.status      = status;
 
    // Residents only see available rooms
    if (req.user.role === "resident") {
      filter.status = "available";
    }
 
    const skip = (Number(page) - 1) * Number(limit);
 
    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .populate("building_id", "building_name city")
        .populate("floor_id", "floor_no floor_name")
        .skip(skip)
        .limit(Number(limit))
        .sort({ building_id: 1, floor_no: 1, room_number: 1 }),
      Room.countDocuments(filter),
    ]);
 
    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      rooms,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms.", error: err.message });
  }
};
 
/**
 * POST /api/rooms
 * Admin, Staff — create a new room
 */
const createRoom = async (req, res) => {
  try {
    const { room_number, building_id, floor_id } = req.body;
 
    // Validate building and floor exist
    const [building, floor] = await Promise.all([
      Building.findById(building_id),
      Floor.findById(floor_id),
    ]);
 
    if (!building) return res.status(404).json({ message: "Building not found." });
    if (!floor)    return res.status(404).json({ message: "Floor not found." });
 
    // Floor must belong to the same building
    if (floor.building_id.toString() !== building_id) {
      return res.status(400).json({ message: "Floor does not belong to the specified building." });
    }
 
    // Room number must be unique within the building
    const exists = await Room.findOne({ building_id, room_number });
    if (exists) {
      return res.status(400).json({ message: `Room ${room_number} already exists in this building.` });
    }
 
    const room = await Room.create({
      ...req.body,
      floor_no: floor.floor_no, // Denormalize for faster queries
      current_occupancy: 0,
      status: "available",
    });
 
    // Update counts
    await Promise.all([
      Building.findByIdAndUpdate(building_id, { $inc: { total_rooms: 1 } }),
      Floor.findByIdAndUpdate(floor_id,       { $inc: { total_rooms: 1 } }),
    ]);
 
    res.status(201).json({ message: "Room created successfully.", room });
  } catch (err) {
    res.status(500).json({ message: "Failed to create room.", error: err.message });
  }
};
 
/**
 * GET /api/rooms/:id
 * All authenticated users — get room details
 */
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("building_id", "building_name address city")
      .populate("floor_id", "floor_no floor_name");
 
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
 
    res.status(200).json({ room });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch room.", error: err.message });
  }
};
 
/**
 * PUT /api/rooms/:id
 * Admin, Staff — update room details
 */
const updateRoom = async (req, res) => {
  try {
    // Prevent changing the building or floor after creation
    delete req.body.building_id;
    delete req.body.floor_id;
    delete req.body.current_occupancy; // Use assign-room / checkout for this
 
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
 
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
 
    res.status(200).json({ message: "Room updated successfully.", room });
  } catch (err) {
    res.status(500).json({ message: "Failed to update room.", error: err.message });
  }
};
 
/**
 * DELETE /api/rooms/:id
 * Admin — delete a room only if no residents are currently assigned
 */
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
 
    if (room.current_occupancy > 0) {
      return res.status(400).json({
        message: "Cannot delete. Room has active residents. Check them out first.",
      });
    }
 
    await Room.findByIdAndDelete(req.params.id);
 
    // Update counts
    await Promise.all([
      Building.findByIdAndUpdate(room.building_id, { $inc: { total_rooms: -1 } }),
      Floor.findByIdAndUpdate(room.floor_id,       { $inc: { total_rooms: -1 } }),
    ]);
 
    res.status(200).json({ message: "Room deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete room.", error: err.message });
  }
};
 
/**
 * GET /api/rooms/:id/residents
 * Admin, Staff — get current occupants of a room
 */
const getRoomResidents = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
 
    const residents = await Resident.find({
      room_id: req.params.id,
      check_out_date: null, // Only currently checked-in
    }).populate("user_id", "fullname email mobile");
 
    res.status(200).json({
      room_number: room.room_number,
      capacity: room.capacity,
      current_occupancy: room.current_occupancy,
      residents,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch room residents.", error: err.message });
  }
};
 
/**
 * PUT /api/rooms/:id/status
 * Admin, Staff — quickly change room status
 * Body: { status: "available" | "under_maintenance" | "reserved" }
 */
const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
 
    const allowed = ["available", "occupied", "full", "under_maintenance", "reserved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}.` });
    }
 
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
 
    // Prevent manually setting "occupied" or "full" — those are auto-managed
    if (["occupied", "full"].includes(status)) {
      return res.status(400).json({
        message: `"${status}" is managed automatically. Use assign-room to update occupancy.`,
      });
    }
 
    room.status = status;
    await room.save();
 
    res.status(200).json({ message: `Room status updated to '${status}'.`, room });
  } catch (err) {
    res.status(500).json({ message: "Failed to update room status.", error: err.message });
  }
};
 
export {
  getAllRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomResidents,
  updateRoomStatus,
};