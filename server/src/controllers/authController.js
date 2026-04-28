import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Admin from "../models/Admin.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

export const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Invalid login details", errors: errors.array() });
  }

  const { username, password } = req.body;
  const admin = await Admin.findOne({ username: username.toLowerCase() });

  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  res.json({
    token: signToken(admin._id),
    admin: {
      id: admin._id,
      username: admin.username
    }
  });
};
