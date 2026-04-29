import { Building, Floor, Room } from '../models';


/**
 * GET /api/buildings
 * All authenticated users — list buildings
 * Query params: ?city=  ?state=  ?status=
 */

const getAllBuildings = async (req, res) => {
  try {
    const { city, state, status } = req.query;
 
    const filter = {};
    if (city)   filter.city   = new RegExp(city, "i");
    if (state)  filter.state  = new RegExp(state, "i");
    if (status) filter.status = status;
 
    const buildings = await Building.find(filter).sort({ building_name: 1 });
 
    res.status(200).json({ total: buildings.length, buildings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch buildings.", error: err.message });
  }
};
 
/**
 * POST /api/buildings
 * Admin — create a new building
 */
const createBuilding = async (req, res) => {
  try {
    const building = await Building.create({
      ...req.body,
      created_by: req.user._id,
    });
 
    res.status(201).json({ message: "Building created successfully.", building });
  } catch (err) {
    res.status(500).json({ message: "Failed to create building.", error: err.message });
  }
};
 
/**
 * GET /api/buildings/:id
 * All authenticated users — get building details
 */
const getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
 
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }
 
    res.status(200).json({ building });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch building.", error: err.message });
  }
};
 
/**
 * PUT /api/buildings/:id
 * Admin — update building details
 */
const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
 
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }
 
    res.status(200).json({ message: "Building updated successfully.", building });
  } catch (err) {
    res.status(500).json({ message: "Failed to update building.", error: err.message });
  }
};
 
/**
 * DELETE /api/buildings/:id
 * Admin — delete a building only if it has no active rooms
 */
const deleteBuilding = async (req, res) => {
  try {
    const roomCount = await Room.countDocuments({ building_id: req.params.id });
    if (roomCount > 0) {
      return res.status(400).json({
        message: `Cannot delete. Building has ${roomCount} room(s). Remove all rooms first.`,
      });
    }
 
    const building = await Building.findByIdAndDelete(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }
 
    // Also clean up floors
    await Floor.deleteMany({ building_id: req.params.id });
 
    res.status(200).json({ message: "Building deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete building.", error: err.message });
  }
};
 
/**
 * GET /api/buildings/:id/floors
 * Admin, Staff — get all floors in a building
 */
const getFloorsByBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }
 
    const floors = await Floor.find({ building_id: req.params.id }).sort({ floor_no: 1 });
 
    res.status(200).json({ building_name: building.building_name, total: floors.length, floors });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch floors.", error: err.message });
  }
};
 
/**
 * GET /api/buildings/:id/rooms
 * Admin, Staff — get all rooms in a building
 * Query params: ?status=  ?room_type=  ?floor_id=
 */
const getRoomsByBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: "Building not found." });
    }
 
    const { status, room_type, floor_id } = req.query;
 
    const filter = { building_id: req.params.id };
    if (status)    filter.status    = status;
    if (room_type) filter.room_type = room_type;
    if (floor_id)  filter.floor_id  = floor_id;
 
    const rooms = await Room.find(filter)
      .populate("floor_id", "floor_no floor_name")
      .sort({ floor_no: 1, room_number: 1 });
 
    res.status(200).json({ building_name: building.building_name, total: rooms.length, rooms });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms.", error: err.message });
  }
};
 
module.exports = {
  getAllBuildings,
  createBuilding,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  getFloorsByBuilding,
  getRoomsByBuilding,
};