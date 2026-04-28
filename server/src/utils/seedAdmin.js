import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const existing = await Admin.findOne({ username: username.toLowerCase() });

  if (existing) {
    existing.password = password;
    await existing.save();
    console.log(`Updated admin: ${username}`);
  } else {
    await Admin.create({ username, password });
    console.log(`Created admin: ${username}`);
  }

  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
