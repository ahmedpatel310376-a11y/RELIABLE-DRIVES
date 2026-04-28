import express from "express";
import { body } from "express-validator";
import { loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  loginAdmin
);

export default router;
