import express from "express";
import { body, param } from "express-validator";
import {
  createCar,
  deleteCar,
  getCarById,
  getCarSummary,
  getCars,
  updateCar
} from "../controllers/carController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

const objectIdRule = param("id").isMongoId().withMessage("Invalid car id");

const carRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("price").isNumeric().withMessage("Price must be numeric"),
  body("year").isInt({ min: 1980, max: new Date().getFullYear() + 1 }).withMessage("Enter a valid year"),
  body("fuelType").isIn(["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]).withMessage("Invalid fuel type"),
  body("transmission").isIn(["Manual", "Automatic", "CVT", "AMT", "DCT"]).withMessage("Invalid transmission"),
  body("bodyType").optional().isIn(["Sedan", "SUV", "Hatchback", "MPV", "Coupe", "Convertible", "Wagon"]).withMessage("Invalid body type"),
  body("seatCapacity").optional().isInt({ min: 1, max: 10 }).withMessage("Enter a valid seating capacity"),
  body("ownership").optional().isIn(["1st owner", "2nd owner", "3rd owner", "4th owner+"]).withMessage("Invalid ownership"),
  body("kmDriven").isNumeric().withMessage("Kilometers driven must be numeric"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("status").optional().isIn(["available", "reserved", "sold"]).withMessage("Invalid status"),
  body("featured").optional().isBoolean().withMessage("Invalid featured value")
];

router.route("/").get(getCars).post(protect, upload.array("images", 8), carRules, createCar);
router.get("/admin/summary", protect, getCarSummary);
router
  .route("/:id")
  .get(objectIdRule, getCarById)
  .put(protect, upload.array("images", 8), objectIdRule, carRules, updateCar)
  .delete(protect, objectIdRule, deleteCar);

export default router;
