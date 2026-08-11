import express from "express";
import { body, param } from "express-validator";
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus
} from "../controllers/enquiryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const enquiryRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone").trim().isLength({ min: 7 }).withMessage("Enter a valid phone number"),
  body("budget").isNumeric().withMessage("Budget must be numeric"),
  body("preferredBrand").optional().trim(),
  body("preferredCar").optional().trim(),
  body("fuelType").optional().isIn(["", "Petrol", "Diesel", "CNG", "Electric", "Hybrid"]).withMessage("Invalid fuel type"),
  body("transmission").optional().isIn(["", "Manual", "Automatic", "CVT", "AMT", "DCT"]).withMessage("Invalid transmission"),
  body("notes").optional().trim()
];

const statusRule = body("status")
  .isIn(["New", "Contacted", "In Progress", "Closed"])
  .withMessage("Invalid enquiry status");

router.route("/")
  .post(enquiryRules, createEnquiry)
  .get(protect, getEnquiries);

router.patch(
  "/:id/status",
  protect,
  param("id").isMongoId().withMessage("Invalid enquiry id"),
  statusRule,
  updateEnquiryStatus
);

export default router;
