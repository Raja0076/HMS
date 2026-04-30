import mongoose from 'mongoose';

const ROOM_TYPES = ["single", "double", "triple", "dormitory", "suite"];
const ROOM_STATUSES = ["available", "occupied", "full", "under_maintenance", "reserved"];
 
const roomSchema = new mongoose.Schema(
  {
    room_number: {
      type: String,
      required: true,
      trim: true,
      // e.g. "101", "A-204", "B-GF-03"
    },
 
    building_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
 
    floor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },
 
    room_type: {
      type: String,
      enum: ROOM_TYPES,
      required: true,
      default: "single",
    },
 
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
 
    current_occupancy: {
      type: Number,
      default: 0,
      min: 0,
    },
 
    status: {
      type: String,
      enum: ROOM_STATUSES,
      default: "available",
    },
 
    monthly_rent: {
      type: Number, // In local currency
      default: 0,
    },
 
    amenities: {
      type: [String], // Room-specific: ["ac", "attached_bathroom", "balcony", "tv"]
      default: [],
    },
 
    // Floor number denormalized for faster queries (avoids floor lookup)
    floor_no: {
      type: Number,
    },
 
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
 
// Room number must be unique per building
roomSchema.index({ building_id: 1, room_number: 1 }, { unique: true });
roomSchema.index({ floor_id: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ room_type: 1, status: 1 }); // Useful for availability queries
 
export default mongoose.model("Room", roomSchema);