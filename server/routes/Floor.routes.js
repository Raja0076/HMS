import express from 'express'
import { verifyToken, authorizeRoles } from '../routes/Auth.middleware.js'

const router = express.Router();

import {
  createFloor,
  getFloorById,
  updateFloor,
  deleteFloor,
  getRoomsByFloor,
} from '../controllers/floor.controller.js';
 
/**
 * Floor Routes
 * Base path: /api
 *
 * Two entry points:
 *   POST /api/buildings/:id/floors  → createFloor  (defined in building.routes.js)
 *   GET/PUT/DELETE /api/floors/:id  → defined here
 */
 
router.use(verifyToken);
 
router.get("/:id",         authorizeRoles("admin", "staff"), getFloorById);
router.put("/:id",         authorizeRoles("admin"),           updateFloor);
router.delete("/:id",      authorizeRoles("admin"),           deleteFloor);
router.get("/:id/rooms",   authorizeRoles("admin", "staff"), getRoomsByFloor);
 
export default router;