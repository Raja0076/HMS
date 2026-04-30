import express from 'express'
import { verifyToken, authorizeRoles } from '../routes/Auth.middleware.js'
const router = express.Router();
 
import {
  register,
  login,
  logout,
  getMe,
  changePassword,
} from '../controllers/Auth.controller.js';

/**
 * Auth Routes
 * Base path: /api/auth
 */
 
// Public
router.post("/register", register);
router.post("/login",    login);
 
// Protected
router.post("/logout",          verifyToken, logout);
router.get("/me",               verifyToken, getMe);
router.put("/change-password",  verifyToken, changePassword);
 
export default router;