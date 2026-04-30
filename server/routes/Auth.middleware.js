import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
 
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
 
    if (user.status !== "active") {
      return res.status(403).json({ message: "Account is inactive or suspended." });
    }
 
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
 
/**
 * authorizeRoles(...roles)
 * Usage: authorizeRoles("admin")
 *        authorizeRoles("admin", "staff")
 * Must be used AFTER verifyToken
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};
 
export { verifyToken, authorizeRoles };