import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Headphones,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";
import BrandLogo from "../components/BrandLogo";
import CarCard from "../components/CarCard";
import SearchFilters from "../components/SearchFilters";
import Skeleton from "../components/Skeleton";
import WhatsAppButton from "../components/WhatsAppButton";
import { SELLER_PHONE } from "../config/site";

const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const brands = ["Maruti", "Hyundai", "Honda", "Toyota", "Tata", "Mahindra", "Volkswagen", "Kia", "Renault", "Skoda"];

const commitments = [
  {
    icon: CheckCircle2,
    title: "Clear vehicle details",
    description: "See pricing, kilometres, fuel type, transmission, location, and availability before you call."
  },
  {
    icon: Headphones,
    title: "Direct assistance",
    description: "Speak directly with Reliable Drives for questions, viewing requests, and next steps."
  },
  {
    icon: ShieldCheck,
    title: "Carefully managed inventory",
    description: "Listings are controlled through a private, authenticated inventory dashboard."
  }
];

export default function Home() {
  const [filters, setFilters] = useState({});
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  useEffect(() => {
    http.get("/cars", { params: { limit: 6 } })
      .then(({ data }) => setCars(data.cars))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString();
    navigate(`/cars${query ? `?${query}` : ""}`);
  };

  return (
    <>
      <section ref={heroRef} className="blue-grid relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden bg-navy text-white">
        <motion.div className="absolute inset-0 -z-20" style={{ y: parallaxY }}>
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1800&q=88"
            alt="Premium pre-owned car on an open road"
            className="h-full w-full object-cover opacity-30"
          />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/90 to-navy/35" />
        <div className="absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full bg-electric/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="container-pad grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr]"
        >
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="mb-8 flex max-w-md flex-col items-start gap-5 sm:mb-10">
              <div className="inline-flex overflow-hidden rounded-2xl border border-white/10 bg-navy/85 p-3 shadow-2xl backdrop-blur">
                <BrandLogo variant="footer" />
              </div>
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-200 backdrop-blur">
                <Sparkles size={15} /> Premium pre-owned cars
              </p>
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Drive something
              <span className="block bg-gradient-to-r from-blue-300 via-electric to-blue-200 bg-clip-text text-transparent">
                worth trusting.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Discover quality second-hand cars with straightforward pricing, essential vehicle details, and personal support when you are ready to enquire.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <motion.button
                className="btn-primary motion-sheen px-6"
                onClick={() => setSearchOpen(true)}
                whileTap={{ scale: 0.98 }}
              >
                <Search size={18} /> Search your car
              </motion.button>
              <a
                href={`tel:+91${SELLER_PHONE}`}
                className="btn-secondary border-white/15 bg-white/5 px-6 text-white backdrop-blur hover:border-blue-300 hover:bg-white/10 hover:text-white"
              >
                <PhoneCall size={18} /> Call {SELLER_PHONE}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-white/55">
              <span className="inline-flex items-center gap-2"><BadgeCheck size={16} className="text-blue-300" /> Transparent listings</span>
              <span className="inline-flex items-center gap-2"><CarFront size={16} className="text-blue-300" /> Direct enquiries</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-blue-300" /> Location-based search</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-electric/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-electric text-white shadow-glow">
                <Search size={25} />
              </span>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-blue-200">Personalised discovery</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Find the right car in a few clicks.</h2>
              <p className="mt-4 leading-7 text-white/65">
                Choose your preferred brand, city, budget, and fuel type only when you are ready to search.
              </p>
              <button
                className="mt-7 inline-flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white px-5 py-4 text-left font-black text-ink transition hover:-translate-y-0.5 hover:shadow-glow"
                onClick={() => setSearchOpen(true)}
              >
                Open car search <ArrowRight size={19} className="text-electric" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="container-pad relative z-10 -mt-8">
        <motion.div
          className="premium-panel grid gap-2 p-3 sm:grid-cols-3"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
        >
          {[
            [BadgeCheck, "Clearly presented vehicles"],
            [CarFront, "Quality-focused inventory"],
            [Headphones, "Direct personal support"]
          ].map(([Icon, text]) => (
            <div key={text} className="flex items-center gap-3 rounded-xl p-4 transition hover:bg-blue-50">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric/10 text-electric"><Icon size={21} /></span>
              <p className="font-extrabold">{text}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="container-pad py-20">
        <FadeUp className="mb-10 max-w-2xl">
          <p className="section-label">Why Reliable Drives</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A more confident way to browse used cars.</h2>
        </FadeUp>
        <div className="grid gap-5 md:grid-cols-3">
          {commitments.map(({ icon: Icon, title, description }, index) => (
            <FadeUp key={title} delay={index * 0.1}>
              <motion.article
                className="premium-panel h-full p-7"
                whileHover={{ y: -7, boxShadow: "0 28px 80px rgba(6, 24, 47, 0.16)" }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-blue-300">
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/60">{description}</p>
              </motion.article>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-y border-line bg-white py-5">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...brands, ...brands].map((brand, index) => (
            <span key={`${brand}-${index}`} className="text-sm font-black uppercase tracking-[0.18em] text-navy/35">{brand}</span>
          ))}
        </motion.div>
      </section>

      <section className="container-pad py-20">
        <FadeUp>
          <div className="mb-9 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Available now</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Featured cars</h2>
            </div>
            <Link to="/cars" className="btn-secondary group">
              View inventory <ChevronRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeUp>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-2xl" />)
            : cars.map((car, index) => (
              <FadeUp key={car._id} delay={index * 0.07}>
                <CarCard car={car} />
              </FadeUp>
            ))}
        </div>
        {!loading && cars.length === 0 && (
          <div className="premium-panel p-10 text-center">
            <p className="font-black">New inventory is being prepared.</p>
            <p className="mt-2 text-sm text-ink/55">Call us for the latest available vehicles.</p>
          </div>
        )}
      </section>

      <section className="blue-grid bg-navy py-20 text-white">
        <div className="container-pad">
          <FadeUp className="mb-12 text-center">
            <p className="section-label text-blue-300">Simple process</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">From search to enquiry.</h2>
          </FadeUp>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Search, step: "01", title: "Set your preferences", description: "Open search and choose the brand, location, budget, or fuel type that works for you." },
              { icon: TrendingUp, step: "02", title: "Compare the details", description: "Review clear photos, pricing, kilometres, transmission, and essential vehicle information." },
              { icon: Users, step: "03", title: "Contact us directly", description: "Call or send a WhatsApp message to ask questions and arrange the next step." }
            ].map(({ icon: Icon, step, title, description }, index) => (
              <FadeUp key={step} delay={index * 0.12}>
                <motion.article
                  className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
                  whileHover={{ y: -6, borderColor: "rgba(105, 168, 255, 0.45)" }}
                >
                  <p className="absolute right-5 top-3 text-6xl font-black text-white/5">{step}</p>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-electric text-white"><Icon size={22} /></span>
                  <h3 className="mt-6 text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">{description}</p>
                </motion.article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="container-pad py-20">
        <FadeUp>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-electric to-blue-700 p-8 text-white shadow-glow sm:p-12">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[42px] border-white/10" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <Zap size={34} className="text-blue-100" />
                <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Ready to find your next drive?</h2>
                <p className="mt-4 max-w-xl text-white/70">Explore the latest inventory or speak with us directly for personal assistance.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary bg-white text-electric shadow-none hover:bg-blue-50" onClick={() => setSearchOpen(true)}>
                  Search cars <Search size={17} />
                </button>
                <a className="btn-secondary border-white/20 bg-white/10 text-white hover:border-white hover:text-white" href={`tel:+91${SELLER_PHONE}`}>
                  Call now
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="premium-panel relative w-full max-w-4xl p-6 sm:p-8"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl border border-line bg-white transition hover:border-electric hover:text-electric"
                onClick={() => setSearchOpen(false)}
                aria-label="Close car search"
              >
                <X size={18} />
              </button>
              <div className="mb-7 pr-12">
                <p className="section-label">Search inventory</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">What car are you looking for?</h2>
                <p className="mt-2 text-sm text-ink/55">Use one or more options, or browse all available cars.</p>
              </div>
              <SearchFilters filters={filters} setFilters={setFilters} onSubmit={handleSearch} embedded />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </>
  );
}
