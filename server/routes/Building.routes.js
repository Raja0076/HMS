import express from 'express'
import { verifyToken, authorizeRoles } from '../routes/Auth.middleware.js'

const router = express.Router();

const {
  getAllBuildings,
  createBuilding,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  getFloorsByBuilding,
  getRoomsByBuilding,
} = require("../controllers/building.controller");
 
/**
 * Building Routes
 * Base path: /api/buildings
 */
 
router.use(verifyToken);
 
// All authenticated users can view buildings
router.get("/",    getAllBuildings);
router.get("/:id", getBuildingById);
 
// Admin only — create / update / delete
router.post("/",        authorizeRoles("admin"), createBuilding);
router.put("/:id",      authorizeRoles("admin"), updateBuilding);
router.delete("/:id",   authorizeRoles("admin"), deleteBuilding);
 
// Nested reads — get floors or rooms belonging to a building
// Accessible to admin and staff
router.get("/:id/floors", authorizeRoles("admin", "staff"), getFloorsByBuilding);
router.get("/:id/rooms",  authorizeRoles("admin", "staff"), getRoomsByBuilding);
 
module.exports = router;