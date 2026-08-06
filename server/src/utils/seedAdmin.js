import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set before seeding the owner account");
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must contain at least 12 characters");
  }
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
