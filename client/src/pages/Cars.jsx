import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import http from "../api/http";
import CarCard from "../components/CarCard";
import SearchFilters from "../components/SearchFilters";
import Skeleton from "../components/Skeleton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(Object.fromEntries(searchParams.entries()));
  const [cars, setCars] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchCars = useCallback(async (params = Object.fromEntries(searchParams.entries())) => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data } = await http.get("/cars", { params: { ...params, limit: 9 } });
      setCars(data.cars);
      setPagination(data.pagination);
    } catch {
      setCars([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters(params);
    fetchCars(params);
  }, [fetchCars, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(Object.fromEntries(Object.entries({ ...filters, page: 1 }).filter(([, v]) => v)));
  };

  const goToPage = (page) => {
    setSearchParams(Object.fromEntries(Object.entries({ ...filters, page }).filter(([, v]) => v)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const activeFilterCount = ["brand", "location", "minPrice", "maxPrice", "fuelType"].filter((key) => filters[key]).length;

  return (
    <>
      <section className="blue-grid bg-navy py-14 text-white">
        <motion.div
          className="container-pad flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="section-label text-blue-300">Reliable Drives inventory</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Find your next car.</h1>
            <p className="mt-3 max-w-xl text-white/60">Browse every available listing, or open search when you want to narrow the selection.</p>
          </div>
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-black text-white shadow-glow"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal size={17} />
            {filtersOpen ? "Close search" : "Search & filter"}
            {activeFilterCount > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs text-electric">{activeFilterCount}</span>}
          </motion.button>
        </motion.div>
      </section>

      <section className="container-pad py-10">
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -12 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden pb-2"
            >
              <SearchFilters filters={filters} setFilters={setFilters} onSubmit={handleSearch} compact />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.08 }}
        >
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.p key={pagination.total} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
                <span className="font-black text-ink">{pagination.total}</span> car{pagination.total === 1 ? "" : "s"} found
              </motion.p>
            </AnimatePresence>
            {activeFilterCount > 0 && (
              <button className="inline-flex items-center gap-1 font-bold text-electric" onClick={clearFilters}>
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
          <p>Page {pagination.page} of {pagination.pages}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-2xl" />)}
            </div>
          ) : cars.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="premium-panel mt-8 p-12 text-center"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-electric/10 text-electric"><Search size={24} /></span>
              <p className="mt-5 font-black text-ink/75">{loadError ? "Inventory could not be loaded." : "No cars match these options."}</p>
              <p className="mt-1 text-sm text-ink/50">{loadError ? "Please try again in a moment." : "Adjust your search or clear the filters."}</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={container} initial="hidden" animate="show"
            >
              {cars.map((car) => (
                <motion.div key={car._id} variants={item}>
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && pagination.pages > 1 && (
          <motion.div
            className="mt-10 flex justify-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-secondary" disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}>
              Previous
            </motion.button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.pages, 7) }, (_, index) => index + 1).map((page) => (
                <motion.button
                  key={page} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => goToPage(page)}
                  className={`h-11 w-11 rounded-xl border text-sm font-bold transition ${
                    page === pagination.page ? "border-teal bg-teal text-white" : "border-line bg-white hover:border-teal hover:text-teal"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-secondary" disabled={pagination.page >= pagination.pages}
              onClick={() => goToPage(pagination.page + 1)}>
              Next
            </motion.button>
          </motion.div>
        )}
      </section>
    </>
  );
}
