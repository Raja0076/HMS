import bcrypt from 'bcrypt'
import { User, Resident } from '../models/index.js'

/**
 * GET /api/users
 * Admin, Staff — list all users with optional filters
 * Query params: ?role=  ?status=  ?page=  ?limit=
 */

const getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
 
    const filter = {};
    if (role)   filter.role = role;
    if (status) filter.status = status;
 
    const skip = (Number(page) - 1) * Number(limit);
 
    const [users, total] = await Promise.all([
      User.findOne(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ created_at: -1 }),
      User.countDocuments(filter),
    ]);
 
    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users.", error: err.message });
  }
};
 
/**
 * POST /api/users
 * Admin — create a staff or admin user
 * (Residents register themselves via /api/auth/register)
 */
const createUser = async (req, res) => {
  try {
    const {
      username, password, fullname, email,
      mobile, role, assigned_buildings,
    } = req.body;
 
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? "Email already in use."
          : "Username already taken.",
      });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const user = await User.create({
      username,
      password: hashedPassword,
      fullname,
      email,
      mobile,
      role: role || "staff",
      assigned_buildings: assigned_buildings || [],
      created_by: req.user._id,
    });
 
    res.status(201).json({ message: "User created successfully.", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to create user.", error: err.message });
  }
};
 
/**
 * GET /api/users/:id
 * Admin, Staff — get a single user by ID
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("assigned_buildings", "building_name city");
 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user.", error: err.message });
  }
};
 
/**
 * PUT /api/users/:id
 * Admin — update user details (not password — use change-password for that)
 */
const updateUser = async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;
    // Prevent accidental password or role change through this endpoint
    // Use /change-password and /status endpoints for those
 
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.status(200).json({ message: "User updated successfully.", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user.", error: err.message });
  }
};
 
/**
 * DELETE /api/users/:id
 * Admin — soft delete by setting status to inactive
 * We never hard-delete users to preserve data integrity
 */
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }
 
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );
 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.status(200).json({ message: "User deactivated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to deactivate user.", error: err.message });
  }
};
 
/**
 * PUT /api/users/:id/status
 * Admin — change user status: active | inactive | suspended
 */
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
 
    const allowed = ["active", "inactive", "suspended"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}.` });
    }
 
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.status(200).json({ message: `User status updated to '${status}'.`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status.", error: err.message });
  }
};
 
export {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
};