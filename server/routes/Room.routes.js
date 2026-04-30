import express from 'express'
import { verifyToken, authorizeRoles } from '../routes/Auth.middleware.js'

const router = express.Router();

import {
  getAllRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomResidents,
  updateRoomStatus,
} from '../controllers/room.controller.js';
 
/**
 * Room Routes
 * Base path: /api/rooms
 *
 * Supports query filters on GET /api/rooms:
 *   ?building_id=   filter by building
 *   ?floor_id=      filter by floor
 *   ?room_type=     single | double | triple | dormitory | suite
 *   ?status=        available | occupied | full | under_maintenance | reserved
 */
 
router.use(verifyToken);
 
// Residents can browse available rooms; admin & staff can see all
router.get("/",    getAllRooms);
router.get("/:id", getRoomById);
 
// Admin / staff — create and manage rooms
router.post("/",             authorizeRoles("admin", "staff"), createRoom);
router.put("/:id",           authorizeRoles("admin", "staff"), updateRoom);
router.delete("/:id",        authorizeRoles("admin"),           deleteRoom);
 
// Current occupants of a room
router.get("/:id/residents", authorizeRoles("admin", "staff"), getRoomResidents);
 
// Quick status change (available → maintenance, etc.) without full update
router.put("/:id/status",    authorizeRoles("admin", "staff"), updateRoomStatus);
 
export default router;