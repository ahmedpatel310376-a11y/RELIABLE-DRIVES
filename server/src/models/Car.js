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
      enum: ["Manual", "Automatic"]
    },
    kmDriven: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    images: { type: [imageSchema], default: [] },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
