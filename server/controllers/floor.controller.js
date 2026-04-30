import { Floor, Room, Building } from '../models/index.js';

/**
 * POST /api/buildings/:id/floors
 * Admin — add a new floor to a building
 * (Route is defined under building.routes.js but handled here)
 */
const createFloor = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }
 
    const { floor_no, floor_name } = req.body;
 
    // Check for duplicate floor number in the same building
    const exists = await Floor.findOne({ building_id: req.params.id, floor_no });
    if (exists) {
      return res.status(400).json({
        message: `Floor ${floor_no} already exists in this building.`,
      });
    }
 
    const floor = await Floor.create({
      floor_no,
      floor_name,
      building_id: req.params.id,
    });
 
    // Update building's total floor count
    await Building.findByIdAndUpdate(req.params.id, {
      $inc: { total_floors: 1 },
    });
 
    res.status(201).json({ message: "Floor created successfully.", floor });
  } catch (err) {
    res.status(500).json({ message: "Failed to create floor.", error: err.message });
  }
};
 
/**
 * GET /api/floors/:id
 * Admin, Staff — get a single floor
 */
const getFloorById = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id)
      .populate("building_id", "building_name city");
 
    if (!floor) {
      return res.status(404).json({ message: "Floor not found." });
    }
 
    res.status(200).json({ floor });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch floor.", error: err.message });
  }
};
 
/**
 * PUT /api/floors/:id
 * Admin — update floor name or active status
 */
const updateFloor = async (req, res) => {
  try {
    // Prevent changing the building or floor number after creation
    delete req.body.building_id;
    delete req.body.floor_no;
 
    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
 
    if (!floor) {
      return res.status(404).json({ message: "Floor not found." });
    }
 
    res.status(200).json({ message: "Floor updated successfully.", floor });
  } catch (err) {
    res.status(500).json({ message: "Failed to update floor.", error: err.message });
  }
};
 
/**
 * DELETE /api/floors/:id
 * Admin — delete a floor only if it has no rooms
 */
const deleteFloor = async (req, res) => {
  try {
    const roomCount = await Room.countDocuments({ floor_id: req.params.id });
    if (roomCount > 0) {
      return res.status(400).json({
        message: `Cannot delete. Floor has ${roomCount} room(s). Remove all rooms first.`,
      });
    }
 
    const floor = await Floor.findByIdAndDelete(req.params.id);
    if (!floor) {
      return res.status(404).json({ message: "Floor not found." });
    }
 
    // Update building's total floor count
    await Building.findByIdAndUpdate(floor.building_id, {
      $inc: { total_floors: -1 },
    });
 
    res.status(200).json({ message: "Floor deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete floor.", error: err.message });
  }
};
 
/**
 * GET /api/floors/:id/rooms
 * Admin, Staff — get all rooms on a specific floor
 */
const getRoomsByFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);
    if (!floor) {
      return res.status(404).json({ message: "Floor not found." });
    }
 
    const rooms = await Room.find({ floor_id: req.params.id })
      .sort({ room_number: 1 });
 
    res.status(200).json({ floor_no: floor.floor_no, total: rooms.length, rooms });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms.", error: err.message });
  }
};
 
export {
  createFloor,
  getFloorById,
  updateFloor,
  deleteFloor,
  getRoomsByFloor,
};