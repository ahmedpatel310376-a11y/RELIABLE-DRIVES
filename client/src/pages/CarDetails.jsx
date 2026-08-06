import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Fuel, Gauge, Heart, MapPin, MessageCircle, Settings, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import http from "../api/http";
import Skeleton from "../components/Skeleton";
import { fallbackImage, formatKm, formatPrice } from "../utils/format";
import { SELLER_PHONE, SELLER_PHONE_E164 } from "../config/site";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    http.get(`/cars/${id}`)
      .then(({ data }) => setCar(data))
      .catch(() => toast.error("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!car) return;
    http.get("/cars", {
      params: { brand: car.brand, status: "available", limit: 4, sort: "-createdAt" }
    })
      .then(({ data }) => setRelated(data.cars.filter((item) => item._id !== car._id)))
      .catch(() => setRelated([]));
  }, [car]);

  // Share functionality intentionally omitted when clipboard unsupported

  if (loading) {
    return <section className="container-pad py-10"><Skeleton className="h-[520px]" /></section>;
  }
  if (!car) return null;

  const images = car.images?.length ? car.images : [{ url: fallbackImage }];
  const specs = [
    [Calendar, "Year", car.year],
    [Fuel, "Fuel", car.fuelType],
    [Settings, "Transmission", car.transmission],
    [Gauge, "Driven", formatKm(car.kmDriven)],
    [MapPin, "Location", car.location],
    [Heart, "Ownership", car.ownership || "Unknown"],
    [ArrowLeft, "Seats", car.seatCapacity ? `${car.seatCapacity} seats` : "N/A"],
    [Sparkles, "Body", car.bodyType || "Standard"],
  ];

  return (
    <motion.section
      className="container-pad py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link to="/cars" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/60 transition hover:text-ink">
          <ArrowLeft size={16} /> Back to listings
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_0.95fr]">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}>
            <motion.div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-sm" layout>
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={images[active].url}
                  alt={car.title}
                  className="aspect-[16/9] w-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {car.featured && <span className="rounded-full bg-electric px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-navy">Featured</span>}
                {(car.status === "sold" || car.status === "reserved") && (
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white ${car.status === "sold" ? "bg-coral" : "bg-blue-600"}`}>
                    {car.status}
                  </span>
                )}
              </div>
            </motion.div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {images.map((image, index) => (
                  <motion.button
                    key={`${image.url}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActive(index)}
                    className={`relative overflow-hidden rounded-2xl border-2 transition ${index === active ? "border-teal" : "border-line"}`}
                  >
                    {index === active && <motion.span layoutId="activeCarImage" className="absolute inset-0 z-10 ring-2 ring-inset ring-teal" />}
                    <img src={image.url} alt="" className="aspect-square w-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }} className="space-y-6 rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
            <div className="space-y-3">
              <p className="section-label">Vehicle overview</p>
              <h2 className="text-3xl font-black tracking-tight">Trusted details for every drive.</h2>
              <p className="text-ink/70 leading-7">{car.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {specs.map(([Icon, label, value], index) => (
                <div key={`${label}-${index}`} className="rounded-3xl border border-line p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/50"><Icon size={14} /> {label}</p>
                  <p className="mt-3 text-base font-black text-ink">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.14 }} className="grid gap-4 rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
            <div>
              <p className="section-label">Inspection highlights</p>
              <h2 className="mt-2 text-2xl font-black">What you can expect</h2>
            </div>
            <ul className="grid gap-4 text-sm leading-7 text-ink/70 sm:grid-cols-2">
              {[
                "Detailed condition review with transparent imagery.",
                "Clear service history and ownership details.",
                "Honest pricing without hidden fees.",
                "Priority support for test drives and enquiries."
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-1 text-teal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {related.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.18 }} className="space-y-5 rounded-[1.75rem] border border-line bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-label">Related vehicles</p>
                  <h2 className="text-2xl font-black">More cars you may like</h2>
                </div>
                <Link to="/cars" className="text-sm font-bold text-electric hover:underline">Browse all</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.slice(0, 2).map((item) => (
                  <Link key={item._id} to={`/cars/${item._id}`} className="group overflow-hidden rounded-3xl border border-line bg-navy/5 p-4 transition hover:-translate-y-1">
                    <p className="text-sm font-black text-ink">{item.title}</p>
                    <p className="mt-2 text-sm text-ink/60">{formatPrice(item.price)}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink/50">{item.year} · {item.transmission}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-24 rounded-[1.75rem] border border-line bg-white p-7 shadow-sm"
        >
          <div className="space-y-4">
            <div className="rounded-3xl bg-navy/5 p-5 text-sm font-bold uppercase tracking-[0.18em] text-ink/60">
              <p>{car.brand}</p>
              <p className="mt-2 text-2xl font-black text-ink">{car.title}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.18em] text-ink/45">Price</p>
              <p className="text-4xl font-black text-coral">{formatPrice(car.price)}</p>
            </div>
            <div className="grid gap-3 rounded-3xl border border-line bg-blue-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink/70">Condition</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-ink">Verified</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink/70">Status</span>
                <span className="text-sm font-black uppercase tracking-[0.16em] text-ink">{car.status}</span>
              </div>
              {car.featured && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-ink/70">Featured</span>
                  <span className="text-sm font-black uppercase tracking-[0.16em] text-teal">Yes</span>
                </div>
              )}
            </div>
            <div className="grid gap-3 rounded-3xl border border-line p-5">
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <Sparkles size={16} /> Instant enquiry
              </div>
              <div className="space-y-2">
                <a className="btn-primary w-full justify-center" href={`https://wa.me/${SELLER_PHONE_E164}?text=${encodeURIComponent(`Hello Reliable Drives, I am interested in ${car.title}. Please share more details.`)}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} /> WhatsApp seller
                </a>
                <a className="btn-secondary w-full text-center" href={`tel:+91${SELLER_PHONE}`}>
                  Call {SELLER_PHONE}
                </a>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}
