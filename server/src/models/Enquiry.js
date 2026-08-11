import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    preferredBrand: { type: String, trim: true, default: "" },
    preferredCar: { type: String, trim: true, default: "" },
    fuelType: {
      type: String,
      enum: ["", "Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      default: ""
    },
    transmission: {
      type: String,
      enum: ["", "Manual", "Automatic", "CVT", "AMT", "DCT"],
      default: ""
    },
    notes: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Closed"],
      default: "New",
      index: true
    }
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });

export default mongoose.model("Enquiry", enquirySchema);
