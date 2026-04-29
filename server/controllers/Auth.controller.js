import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { User, Resident} from '../models';

/**
 * Generates a signed JWT token for the given user ID and role
 */

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
 
/**
 * POST /api/auth/register
 * Public — creates a new resident account
 */
const register = async (req, res) => {
  try {
    const { username, password, fullname, email, mobile, resident_type } = req.body;
 
    // Check duplicates
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
      role: "resident",
    });
 
    // Auto-create resident profile
    await Resident.create({
      user_id: user._id,
      resident_type: resident_type || "student",
    });
 
    const token = generateToken(user);
 
    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
};
 
/**
 * POST /api/auth/login
 * Public — returns JWT token on valid credentials
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    // password is select:false in the schema so we explicitly select it
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
 
    if (user.status !== "active") {
      return res.status(403).json({ message: "Account is inactive or suspended." });
    }
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
 
    const token = generateToken(user);
 
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};
 
/**
 * POST /api/auth/logout
 * Protected — client should discard the token
 * (JWT is stateless; true blacklisting needs Redis)
 */
const logout = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
};
 
/**
 * GET /api/auth/me
 * Protected — returns the logged-in user's profile
 * For residents, also returns their resident profile
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
 
    let residentProfile = null;
    if (user.role === "resident") {
      residentProfile = await Resident.findOne({ user_id: user._id })
        .populate("room_id", "room_number room_type floor_no")
        .populate("building_id", "building_name address");
    }
 
    res.status(200).json({ user, residentProfile });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile.", error: err.message });
  }
};
 
/**
 * PUT /api/auth/change-password
 * Protected — updates password after verifying old one
 */
const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
 
    const user = await User.findById(req.user._id).select("+password");
 
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }
 
    user.password = await bcrypt.hash(new_password, 10);
    await user.save();
 
    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Password change failed.", error: err.message });
  }
};
 
module.exports = { register, login, logout, getMe, changePassword };
 