import mongoose from "mongoose";

const RESIDENT_TYPES = ["student", "professional", "other"];
 
const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, trim: true }, // e.g. "Parent", "Sibling"
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);
 
const residentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One resident profile per user
    },
 
    resident_type: {
      type: String,
      enum: RESIDENT_TYPES,
      required: true,
      default: "student",
    },
 
    // Current room assignment
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null, // null = not yet assigned
    },
 
    building_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },
 
    check_in_date: {
      type: Date,
      default: null,
    },
 
    check_out_date: {
      type: Date,
      default: null, // null = currently residing
    },
 
    emergency_contact: {
      type: emergencyContactSchema,
      default: null,
    },
 
    // Additional resident info
    id_proof_type: {
      type: String, // e.g. "Aadhaar", "Passport", "Driver's License"
      trim: true,
    },
 
    id_proof_number: {
      type: String,
      trim: true,
      select: false, // Sensitive — exclude from default queries
    },
 
    notes: {
      type: String, // Internal admin notes about the resident
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
 
residentSchema.index({ user_id: 1 });
residentSchema.index({ room_id: 1 });
residentSchema.index({ building_id: 1 });
residentSchema.index({ check_in_date: 1, check_out_date: 1 });
 
module.exports = mongoose.model("Resident", residentSchema);