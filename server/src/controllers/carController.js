import fs from "fs/promises";
import { validationResult } from "express-validator";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import Car from "../models/Car.js";

const parseNumber = (value) => (value === undefined || value === "" ? undefined : Number(value));
const parseBoolean = (value) => value === "true" || value === true;

const mapCarPayload = (body) => ({
  title: body.title,
  brand: body.brand,
  price: parseNumber(body.price),
  year: parseNumber(body.year),
  fuelType: body.fuelType,
  transmission: body.transmission,
  bodyType: body.bodyType || null,
  seatCapacity: parseNumber(body.seatCapacity),
  ownership: body.ownership || null,
  kmDriven: parseNumber(body.kmDriven),
  location: body.location,
  description: body.description,
  status: body.status,
  featured: parseBoolean(body.featured),
});

// 🔥 IMAGE UPLOAD LOGIC (UPDATED)
const uploadImages = async (files, req) => {
  if (!files?.length) return [];

  // ✅ Cloudinary upload
  if (isCloudinaryConfigured) {
    const uploads = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "reliable-drives/cars",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        })
      )
    );

    // ✅ delete local temp files after upload
    await Promise.all(
      files.map((file) =>
        fs.unlink(file.path).catch(() => null)
      )
    );

    return uploads.map((img) => ({
      url: img.secure_url,
      publicId: img.public_id,
    }));
  }

  // ⚠️ fallback (local storage)
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return files.map((file) => ({
    url: `${baseUrl}/uploads/${file.filename}`,
    publicId: null,
  }));
};

// 🧹 cleanup if error occurs
const cleanupFiles = async (files) => {
  if (files?.length) {
    await Promise.all(files.map((f) => fs.unlink(f.path).catch(() => null)));
  }
};

// GET /api/cars
export const getCars = async (req, res, next) => {
  try {
    const {
      brand, fuelType, location, city, status,
      minPrice, maxPrice, transmission,
      minYear, maxYear, year, featured,
      bodyType, ownership, seatCapacity,
      sort = "-createdAt", page = 1, limit = 9,
    } = req.query;

    const filter = {};
    if (brand) filter.brand = new RegExp(brand, "i");
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (bodyType) filter.bodyType = bodyType;
    if (ownership) filter.ownership = ownership;
    if (seatCapacity) filter.seatCapacity = Number(seatCapacity);
    if (location || city) filter.location = new RegExp(location || city, "i");
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === "true" || featured === true;
    if (year) filter.year = Number(year);

    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = Number(minYear);
      if (maxYear) filter.year.$lte = Number(maxYear);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const allowedSorts = ["-createdAt", "createdAt", "price", "-price", "kmDriven", "-kmDriven", "year", "-year"];
    const safeSort = allowedSorts.includes(sort) ? sort : "-createdAt";

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Math.max(Number(limit), 1), 24);
    const skip = (pageNumber - 1) * pageSize;

    const [cars, total] = await Promise.all([
      Car.find(filter).sort(safeSort).skip(skip).limit(pageSize).lean(),
      Car.countDocuments(filter),
    ]);

    res.json({
      cars,
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

// GET /api/cars/:id
export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).lean();
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    next(err);
  }
};

// POST /api/cars
export const createCar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await cleanupFiles(req.files);
      return res.status(422).json({ message: "Please fix the highlighted fields", errors: errors.array() });
    }

    const images = await uploadImages(req.files, req);
    const car = await Car.create({ ...mapCarPayload(req.body), images });

    res.status(201).json(car);
  } catch (err) {
    await cleanupFiles(req.files);
    next(err);
  }
};

// PUT /api/cars/:id
export const updateCar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await cleanupFiles(req.files);
      return res.status(422).json({ message: "Please fix the highlighted fields", errors: errors.array() });
    }

    const car = await Car.findById(req.params.id);
    if (!car) {
      await cleanupFiles(req.files);
      return res.status(404).json({ message: "Car not found" });
    }

    Object.assign(car, mapCarPayload(req.body));

    const newImages = await uploadImages(req.files, req);
    if (newImages.length) {
      car.images.push(...newImages);
    }

    await car.save();
    res.json(car);
  } catch (err) {
    await cleanupFiles(req.files);
    next(err);
  }
};

// DELETE /api/cars/:id
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // ✅ delete from Cloudinary
    if (isCloudinaryConfigured) {
      await Promise.all(
        car.images
          .filter((img) => img.publicId)
          .map((img) =>
            cloudinary.uploader.destroy(img.publicId).catch(() => null)
          )
      );
    }

    await car.deleteOne();

    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    next(err);
  }
};