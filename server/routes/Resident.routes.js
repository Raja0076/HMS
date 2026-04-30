import express from 'express'
import { verifyToken, authorizeRoles } from '../routes/Auth.middleware.js'

const router = express.Router();

import {
  getAllResidents,
  getResidentById,
  updateResident,
  assignRoom,
  checkoutResident,
} from '../controllers/resident.controller.js';
 
/**
 * Resident Routes
 * Base path: /api/residents
 *
 * Residents can view/edit their own profile.
 * Admin and staff can view all residents and manage room assignments.
 */
 
router.use(verifyToken);
 
// Admin & staff: list all residents with filters (?building_id=, ?room_id=, ?status=)
router.get("/", authorizeRoles("admin", "staff"), getAllResidents);
 
// A resident can fetch their own profile; admin/staff can fetch any
router.get("/:id", getResidentById);
 
// Resident can update own profile (emergency contact, etc.); admin can update any
router.put("/:id", updateResident);
 
// Admin/staff only — room assignment and checkout
router.post("/:id/assign-room", authorizeRoles("admin", "staff"), assignRoom);
router.post("/:id/checkout",    authorizeRoles("admin", "staff"), checkoutResident);
 
export default router;