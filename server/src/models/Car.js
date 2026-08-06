import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: null }
  },
  { _id: false }
);

const carSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0, index: true },
    year: { type: Number, required: true, min: 1980, max: new Date().getFullYear() + 1 },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      index: true
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Manual", "Automatic", "CVT", "AMT", "DCT"]
    },
    bodyType: {
      type: String,
      trim: true,
      enum: ["Sedan", "SUV", "Hatchback", "MPV", "Coupe", "Convertible", "Wagon"],
      default: null,
      index: true
    },
    seatCapacity: { type: Number, min: 1, max: 10, default: null },
    ownership: {
      type: String,
      enum: ["1st owner", "2nd owner", "3rd owner", "4th owner+"],
      default: null,
      index: true
    },
    kmDriven: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    images: { type: [imageSchema], default: [] },
    status: {
      type: String,
      enum: ["available", "reserved", "sold"],
      default: "available",
      index: true
    },
    featured: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
