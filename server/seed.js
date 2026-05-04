import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/index.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    const existing = await User.findOne({ email: "admin@hostel.com" });
    if (existing) {
      console.log("Admin already exists, skipping.");
      process.exit();
    }

    await User.create({
      username: "superadmin",
      password: await bcrypt.hash("Admin@1234", 10),
      fullname: "Super Admin",
      email: "admin@hostel.com",
      mobile: "9000000000",
      role: "admin",
      status: "active",
    });

    console.log("✅ Admin created successfully!");
    console.log("   Email:    admin@hostel.com");
    console.log("   Password: Admin@1234");
    process.exit();

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();