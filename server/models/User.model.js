import mongoose from "mongoose";

const USER_ROLES = ["admin", "staff", "resident"];
const USER_STATUSES = ["active", "inactive", "suspended"];
 
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
 
    password: {
      type: String,
      required: true,
      select: false, // Never returned in queries by default
    },
 
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
 
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
 
    mobile: {
      type: String,
      trim: true,
    },
 
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: "resident",
    },
 
    profile_image: {
      type: String, // URL or file path
      default: null,
    },
 
    status: {
      type: String,
      enum: USER_STATUSES,
      default: "active",
    },
 
    // For staff: buildings they are assigned to manage
    assigned_buildings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building",
      },
    ],
 
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = self-registered or system-created
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
 
// Index for fast lookups (email and username already have indexes via unique: true)
userSchema.index({ role: 1, status: 1 });
 
export default mongoose.model("User", userSchema);