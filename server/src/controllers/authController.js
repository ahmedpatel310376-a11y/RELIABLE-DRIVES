import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password))) {
      // Consistent message to prevent username enumeration
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(admin._id);
    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({ id: req.admin._id, username: req.admin.username });
  } catch (err) {
    next(err);
  }
};
