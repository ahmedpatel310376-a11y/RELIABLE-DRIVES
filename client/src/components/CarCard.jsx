import { motion } from "framer-motion";
import { Gauge, Heart, MapPin, Calendar, Fuel } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { fallbackImage, formatKm, formatPrice } from "../utils/format";

export default function CarCard({ car }) {
  const wishlist = useWishlist();
  const image = car.images?.[0]?.url || fallbackImage;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-soft"
    >
      <Link to={`/cars/${car._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-line">
          <motion.img
            src={image}
            alt={car.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.45 }}
          />
          {(car.status === "sold" || car.status === "reserved" || car.featured) && (
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {car.featured && (
                <span className="rounded-md bg-electric px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-navy shadow-md">Featured</span>
              )}
              {(car.status === "sold" || car.status === "reserved") && (
                <span className={`rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white ${car.status === "sold" ? "bg-coral" : "bg-blue-600"}`}>
                  {car.status}
                </span>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-black text-electric">{formatPrice(car.price)}</p>
            <Link to={`/cars/${car._id}`} className="font-semibold hover:text-teal line-clamp-1">{car.title}</Link>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ rotate: wishlist.has(car._id) ? 0 : -8, scale: 1.06 }}
            className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-md border transition ${
              wishlist.has(car._id) ? "border-coral bg-coral text-white" : "border-line bg-white text-ink hover:border-coral hover:text-coral"
            }`}
            onClick={() => wishlist.toggle(car._id)}
            title="Toggle wishlist"
          >
            <Heart size={17} fill={wishlist.has(car._id) ? "currentColor" : "none"} />
          </motion.button>
        </div>

        <div className="grid gap-2 text-xs text-ink/60 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2"><Calendar size={13} /> {car.year}</span>
          <span className="inline-flex items-center gap-2"><Fuel size={13} /> {car.fuelType}</span>
          <span className="inline-flex items-center gap-2 capitalize">{car.transmission}</span>
          <span className="inline-flex items-center gap-2"><Gauge size={13} /> {formatKm(car.kmDriven)}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-ink/70">
            <MapPin size={14} /> {car.location}
          </p>
          <Link to={`/cars/${car._id}`} className="rounded-full border border-line bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-ink transition hover:border-teal hover:text-teal">
            View details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
