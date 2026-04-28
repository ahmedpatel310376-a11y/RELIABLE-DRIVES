import { motion } from "framer-motion";
import { Gauge, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { fallbackImage, formatKm, formatPrice } from "../utils/format";

export default function CarCard({ car }) {
  const wishlist = useWishlist();
  const image = car.images?.[0]?.url || fallbackImage;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:shadow-soft"
    >
      <Link to={`/cars/${car._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-line">
          <img src={image} alt={car.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          {car.status === "sold" && (
            <span className="absolute left-3 top-3 rounded-md bg-coral px-2 py-1 text-xs font-bold uppercase text-white">Sold</span>
          )}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-black">{formatPrice(car.price)}</p>
            <Link to={`/cars/${car._id}`} className="font-semibold hover:text-teal">{car.title}</Link>
          </div>
          <button
            className={`grid h-9 w-9 place-items-center rounded-md border ${wishlist.has(car._id) ? "border-coral bg-coral text-white" : "border-line bg-white text-ink"}`}
            onClick={() => wishlist.toggle(car._id)}
            title="Toggle wishlist"
          >
            <Heart size={17} fill={wishlist.has(car._id) ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-ink/65">
          <span>{car.year}</span>
          <span>{car.fuelType}</span>
          <span>{car.transmission}</span>
          <span className="inline-flex items-center gap-1"><Gauge size={15} /> {formatKm(car.kmDriven)}</span>
        </div>
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-ink/70">
          <MapPin size={15} /> {car.location}
        </p>
      </div>
    </motion.article>
  );
}
