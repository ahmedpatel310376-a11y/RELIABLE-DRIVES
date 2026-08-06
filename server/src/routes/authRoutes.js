import express from "express";
import { body } from "express-validator";
import { login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", protect, getMe);

export default router;
