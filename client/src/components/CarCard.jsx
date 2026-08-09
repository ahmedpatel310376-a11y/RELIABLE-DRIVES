import { motion } from "framer-motion";
import { Heart, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { fallbackImage } from "../utils/format";

export default function CarCard({ car }) {
  const wishlist = useWishlist();
  const image = car.images?.[0]?.url || fallbackImage;
  const badgeColor =
    car.status === "sold" ? "bg-red-500" : car.status === "reserved" ? "bg-amber-500" : "bg-emerald-500";
  const badgeLabel =
    car.status === "sold" ? "Sold" : car.status === "reserved" ? "Reserved" : "Available";

  return (
    <motion.article
      whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:border-blue-200"
    >
      {/* Image Section */}
      <Link to={`/cars/${car._id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-gray-100 sm:h-64">
          <motion.img
            src={image}
            alt={car.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />

          {/* Badge */}
          {(car.featured || car.status !== "available") && (
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {car.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  <Zap size={12} /> Featured
                </span>
              )}
              {car.status !== "available" && (
                <span className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg ${badgeColor}`}>
                  {badgeLabel}
                </span>
              )}
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-col gap-3 p-5 sm:gap-4 sm:p-6">
        {/* Price - Most prominent */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-2xl font-black text-blue-600 sm:text-3xl">
            ₹{(car.price / 100000).toFixed(1)}L
          </p>
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border-2 transition ${
              wishlist.has(car._id)
                ? "border-red-500 bg-red-50 text-red-500"
                : "border-gray-200 bg-white text-gray-400 hover:border-red-300 hover:text-red-400"
            }`}
            onClick={() => wishlist.toggle(car._id)}
            title="Toggle wishlist"
          >
            <Heart size={18} fill={wishlist.has(car._id) ? "currentColor" : "none"} />
          </motion.button>
        </div>

        {/* Car Title */}
        <Link to={`/cars/${car._id}`} className="group/link">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition group-hover/link:text-blue-600 sm:text-xl">
            {car.title}
          </h3>
        </Link>

        {/* Key Details - Tags/Pills */}
        <div className="flex flex-wrap gap-2">
          {car.year && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {car.year}
            </span>
          )}
          {car.fuelType && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {car.fuelType}
            </span>
          )}
          {car.transmission && (
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              {car.transmission}
            </span>
          )}
        </div>

        {/* Location */}
        {car.location && (
          <p className="inline-flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-blue-500" />
            <span className="font-medium">{car.location}</span>
          </p>
        )}

        {/* CTA Button */}
        <Link
          to={`/cars/${car._id}`}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/40 active:scale-95"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
