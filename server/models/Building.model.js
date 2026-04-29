import mongoose from "mongoose";

const BUILDING_STATUSES = ["active", "under_maintenance", "closed"];
 
const buildingSchema = new mongoose.Schema(
  {
    building_name: {
      type: String,
      required: true,
      trim: true,
    },
 
    address: {
      type: String,
      required: true,
      trim: true,
    },
 
    city: {
      type: String,
      required: true,
      trim: true,
    },
 
    state: {
      type: String,
      required: true,
      trim: true,
    },
 
    pincode: {
      type: String,
      trim: true,
    },
 
    status: {
      type: String,
      enum: BUILDING_STATUSES,
      default: "active",
    },
 
    // Facilities available in this building
    amenities: {
      type: [String], // e.g. ["wifi", "laundry", "gym", "cafeteria", "parking"]
      default: [],
    },
 
    total_floors: {
      type: Number,
      default: 0,
    },
 
    total_rooms: {
      type: Number,
      default: 0,
    },
 
    contact_number: {
      type: String,
      trim: true,
    },
 
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
 
buildingSchema.index({ city: 1, state: 1 });
buildingSchema.index({ status: 1 });
 
module.exports = mongoose.model("Building", buildingSchema);