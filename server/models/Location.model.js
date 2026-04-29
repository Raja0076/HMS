const LOCATION_TYPES = [
  "common_area",   // Lobby, lounge, corridor
  "amenity",       // Gym, pool, recreation room
  "dining",        // Cafeteria, dining hall, pantry
  "utility",       // Laundry, storage, generator room
  "admin",         // Office, reception, security cabin
  "outdoor",       // Parking, garden, rooftop
  "other",
];
 
const locationSchema = new mongoose.Schema(
  {
    long_name: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Ground Floor Cafeteria - Block A"
    },
 
    short_name: {
      type: String,
      trim: true,
      // e.g. "Cafeteria A", "Main Gym"
    },
 
    location_type: {
      type: String,
      enum: LOCATION_TYPES,
      default: "common_area",
    },
 
    building_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
 
    // Optional — not all locations are on a specific floor
    floor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      default: null,
    },
 
    // Optional — only if the location corresponds to a specific room
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
 
    is_active: {
      type: Boolean,
      default: true,
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
 
locationSchema.index({ building_id: 1, location_type: 1 });
locationSchema.index({ floor_id: 1 });
 
module.exports = mongoose.model("Location", locationSchema);