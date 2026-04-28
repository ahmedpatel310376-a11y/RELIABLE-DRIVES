import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CarFront, PhoneCall, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";
import CarCard from "../components/CarCard";
import SearchFilters from "../components/SearchFilters";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const [filters, setFilters] = useState({});
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get("/cars", { params: { limit: 6, status: "available" } })
      .then(({ data }) => setCars(data.cars))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString();
    navigate(`/cars?${query}`);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1800&q=85"
            alt="Premium used car"
            className="h-full w-full object-cover opacity-35"
          />
        </div>
        <div className="container-pad relative grid min-h-[calc(100vh-4rem)] items-center gap-8 py-12 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-sm font-semibold">
              <ShieldCheck size={16} /> 200-point inspected second-hand cars
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Reliable Drives
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
              Buy and sell verified used cars with transparent pricing, rich listings, and a smooth admin workflow for every vehicle.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cars" className="btn-primary bg-coral hover:bg-coral/90">
                Browse cars <ArrowRight size={17} />
              </Link>
              <a href="tel:+911234567890" className="btn-secondary border-white/30 bg-white/10 text-white hover:border-white hover:text-white">
                <PhoneCall size={17} /> Contact seller
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <SearchFilters filters={filters} setFilters={setFilters} onSubmit={handleSearch} />
          </motion.div>
        </div>
      </section>

      <section className="container-pad -mt-10 relative z-10">
        <div className="grid gap-3 rounded-lg border border-line bg-white p-4 shadow-soft sm:grid-cols-3">
          {[
            [BadgeCheck, "Verified ownership"],
            [CarFront, "Ready-to-drive listings"],
            [ShieldCheck, "Secure admin controls"]
          ].map(([Icon, text]) => (
            <div key={text} className="flex items-center gap-3 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-teal/10 text-teal"><Icon size={20} /></span>
              <p className="font-bold">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-pad py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal">Featured cars</p>
            <h2 className="mt-2 text-3xl font-black">Fresh arrivals</h2>
          </div>
          <Link to="/cars" className="btn-secondary">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80" />)
            : cars.map((car) => <CarCard key={car._id} car={car} />)}
        </div>
      </section>
    </>
  );
}
