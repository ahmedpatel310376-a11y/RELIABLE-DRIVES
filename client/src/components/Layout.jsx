import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, LogOut, Menu, Phone, X } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { ADMIN_PATH, SELLER_PHONE } from "../config/site";

const navClass = ({ isActive }) =>
  `text-sm font-bold transition ${isActive ? "text-white" : "text-white/65 hover:text-white"}`;

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdminArea = location.pathname.startsWith(ADMIN_PATH);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-mist text-ink">
      <motion.header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled ? "border-white/10 bg-navy/95 shadow-xl backdrop-blur-xl" : "border-white/5 bg-navy"
        }`}
        initial={{ y: -64 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}
      >
        <div className="container-pad flex h-[4.5rem] items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.span
              whileHover={{ y: -1, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <BrandLogo variant="nav" />
            </motion.span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink className={navClass} to="/">Home</NavLink>
            <NavLink className={navClass} to="/about">About</NavLink>
            <NavLink className={navClass} to="/cars">Browse cars</NavLink>
            <motion.span
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white/65"
              whileHover={{ scale: 1.1 }}
            >
              <Heart size={16} />
              <AnimatePresence mode="wait">
                <motion.span key={ids.length} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {ids.length}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            {isAuthenticated ? (
              <>
                <NavLink className={navClass} to={ADMIN_PATH}>Dashboard</NavLink>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
                  onClick={handleLogout} title="Logout">
                  <LogOut size={16} />
                </motion.button>
              </>
            ) : (
              <a className="inline-flex items-center gap-2 rounded-xl bg-electric px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-electric/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
                href={`tel:+91${SELLER_PHONE}`}>
                <Phone size={15} /> {SELLER_PHONE}
              </a>
            )}
          </nav>

          <motion.button
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              className="border-t border-white/10 bg-navy px-4 pb-5 md:hidden"
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="flex flex-col gap-3 pt-4"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              >
                <motion.div variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}>
                  <NavLink className={navClass} to="/">Home</NavLink>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}>
                  <NavLink className={navClass} to="/about">About</NavLink>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}>
                  <NavLink className={navClass} to="/cars">Browse cars</NavLink>
                </motion.div>
                {isAuthenticated ? (
                  <>
                    <motion.div variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}>
                      <NavLink className={navClass} to={ADMIN_PATH}>Dashboard</NavLink>
                    </motion.div>
                    <motion.button variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                      className="text-left text-sm font-bold text-white/65" onClick={handleLogout}>Logout</motion.button>
                  </>
                ) : (
                  <motion.a variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-300" href={`tel:+91${SELLER_PHONE}`}>
                    <Phone size={15} /> Call {SELLER_PHONE}
                  </motion.a>
                )}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
        <Outlet />
      </main>

      {!isAdminArea && (
        <motion.footer
          className="mt-16 border-t border-white/10 bg-navy text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="container-pad grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <Link to="/" className="inline-flex">
                <BrandLogo variant="footer" />
              </Link>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-white/70">
                <Link to="/" className="transition hover:text-white">Home</Link>
                <Link to="/about" className="transition hover:text-white">About</Link>
                <Link to="/cars" className="transition hover:text-white">Browse cars</Link>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                Quality pre-owned cars presented with clear details, transparent pricing, and direct personal assistance.
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Speak with us</p>
              <a className="mt-2 inline-flex items-center gap-2 text-lg font-black" href={`tel:+91${SELLER_PHONE}`}>
                <Phone size={18} className="text-blue-400" /> +91 {SELLER_PHONE}
              </a>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="container-pad py-5 text-xs text-white/45">
              © {new Date().getFullYear()} Reliable Drives. All rights reserved.
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
