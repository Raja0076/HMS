import express from 'express'
import { verifyToken, authorizeRoles } from '../routes/Auth.middleware.js'

const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
} = require("../controllers/user.controller");
 
/**
 * User Routes
 * Base path: /api/users
 * All routes require authentication
 * Most routes are admin-only; staff can view but not create/delete
 */
 
router.use(verifyToken); // All user routes require login
 
router.get("/",    authorizeRoles("admin", "staff"), getAllUsers);
router.post("/",   authorizeRoles("admin"),           createUser);
 
router.get("/:id",           authorizeRoles("admin", "staff"), getUserById);
router.put("/:id",           authorizeRoles("admin"),           updateUser);
router.delete("/:id",        authorizeRoles("admin"),           deleteUser);
router.put("/:id/status",    authorizeRoles("admin"),           updateUserStatus);
 
module.exports = router;