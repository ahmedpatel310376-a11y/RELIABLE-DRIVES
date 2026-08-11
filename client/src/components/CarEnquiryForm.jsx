import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Car, Phone, User, DollarSign } from "lucide-react";
import http from "../api/http";

const containerMotion = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemMotion = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function CarEnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    budget: "",
    preferredBrand: "",
    preferredCar: "",
    fuelType: "",
    transmission: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const brands = ["Maruti", "Hyundai", "Honda", "Toyota", "Tata", "Mahindra", "Volkswagen", "Kia", "Renault", "Skoda"];
  const fuels = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  const transmissions = ["Manual", "Automatic", "CVT", "AMT", "DCT"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      await http.post("/enquiries", formData);
      setSubmittedPhone(formData.phone);
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        budget: "",
        preferredBrand: "",
        preferredCar: "",
        fuelType: "",
        transmission: "",
        notes: ""
      });

      toast.success("Enquiry submitted successfully!");

      setTimeout(() => {
        setSubmitted(false);
        setSubmittedPhone("");
      }, 5000);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Unable to submit enquiry");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center sm:p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
        <p className="mt-2 text-lg text-green-700 font-semibold">
          We will find your perfect car within 1 week
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Our team will contact you shortly at {submittedPhone}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerMotion}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8"
    >
      {/* Header */}
      <motion.div variants={itemMotion} className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Can&apos;t Find Your Car?
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Tell us what you&apos;re looking for and we&apos;ll find it for you
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <motion.div variants={itemMotion}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </motion.div>

        {/* Phone */}
        <motion.div variants={itemMotion}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </motion.div>

        {/* Budget */}
        <motion.div variants={itemMotion}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Budget (₹) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="500000"
              className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemMotion}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Preferred Car / Model
          </label>
          <div className="relative">
            <Car className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="preferredCar"
              value={formData.preferredCar}
              onChange={handleChange}
              placeholder="e.g. Honda City, Creta, Swift"
              className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </motion.div>

        {/* Grid: Brand, Fuel, Transmission */}
        <motion.div variants={itemMotion} className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Brand
            </label>
            <select
              name="preferredBrand"
              value={formData.preferredBrand}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Any Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fuel Type
            </label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Any Fuel</option>
              {fuels.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transmission
            </label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Any Transmission</option>
              {transmissions.map((trans) => (
                <option key={trans} value={trans}>
                  {trans}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div variants={itemMotion}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any other preferences? (Optional)"
            rows={4}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={itemMotion}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
        >
          {loading ? "Submitting..." : "Submit Enquiry"}
        </motion.button>
      </form>

      <p className="mt-6 text-xs text-gray-500 text-center">
        We respect your privacy. Your information is safe with us.
      </p>
    </motion.div>
  );
}
