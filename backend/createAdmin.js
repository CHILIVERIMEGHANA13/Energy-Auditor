import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/energyAuditApp";

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const email = "admin@example.com";
  const password = "adminpassword";
  const name = "Admin";
  const role = "admin";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await admin.save();
  console.log("Admin user created successfully!");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});