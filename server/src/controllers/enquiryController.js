import { validationResult } from "express-validator";
import Enquiry from "../models/Enquiry.js";

const parseBudget = (value) => (value === undefined || value === "" ? undefined : Number(value));

const mapEnquiryPayload = (body) => ({
  name: body.name,
  phone: body.phone,
  budget: parseBudget(body.budget),
  preferredBrand: body.preferredBrand || "",
  preferredCar: body.preferredCar || "",
  fuelType: body.fuelType || "",
  transmission: body.transmission || "",
  notes: body.notes || ""
});

export const createEnquiry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Please fix the highlighted fields", errors: errors.array() });
    }

    const enquiry = await Enquiry.create(mapEnquiryPayload(req.body));
    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry: {
        id: enquiry._id,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * pageSize;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort("-createdAt").skip(skip).limit(pageSize).lean(),
      Enquiry.countDocuments(filter),
    ]);

    res.json({
      enquiries,
      pagination: {
        page: pageNumber,
        pages: Math.ceil(total / pageSize) || 1,
        total,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Please fix the highlighted fields", errors: errors.array() });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).lean();

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    next(err);
  }
};
