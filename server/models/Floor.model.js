import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    floor_no: {
      type: Number,
      required: true,
      // 0 = ground floor, negative = basement (-1, -2...)
    },
 
    floor_name: {
      type: String,
      trim: true,
      // e.g. "Ground Floor", "Basement", "First Floor"
    },
 
    building_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
 
    total_rooms: {
      type: Number,
      default: 0,
    },
 
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
 
// A floor number must be unique within a building
floorSchema.index({ building_id: 1, floor_no: 1 }, { unique: true });
 
export default mongoose.model("Floor", floorSchema);