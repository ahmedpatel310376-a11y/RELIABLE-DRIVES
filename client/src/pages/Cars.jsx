import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { MessageSquareText, Search, SlidersHorizontal, X } from "lucide-react";
import http from "../api/http";
import CarCard from "../components/CarCard";
import CarEnquiryForm from "../components/CarEnquiryForm";
import WhatsAppButton from "../components/WhatsAppButton";
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

  const activeFilterCount = ["brand", "location", "minPrice", "maxPrice", "fuelType", "transmission"].filter((key) => filters[key]).length;

  const brands = ["Maruti", "Hyundai", "Honda", "Toyota", "Tata", "Mahindra", "Volkswagen", "Kia", "Renault", "Skoda"];
  const fuels = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  const transmissions = ["Manual", "Automatic", "CVT", "AMT", "DCT"];

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-line bg-white py-16">
        <motion.div
          className="container-pad flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="section-label">Reliable Drives inventory</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-navy sm:text-5xl">Find your next car.</h1>
            <p className="mt-3 max-w-xl text-ink/65">Browse our complete collection or use advanced filters to find exactly what you need.</p>
          </div>
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-6 py-3 font-bold text-white shadow-lg shadow-electric/20 transition hover:bg-blue-600 hover:shadow-xl active:scale-95"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal size={18} />
            {filtersOpen ? "Close Filters" : "Open Filters"}
            {activeFilterCount > 0 && <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs text-white font-bold">{activeFilterCount}</span>}
          </motion.button>
        </motion.div>
      </section>

      {/* Filters Section */}
      <section className="container-pad py-8">
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -12 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8 mb-8"
            >
              <h3 className="mb-6 text-xl font-bold text-gray-900">Filter by:</h3>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                    <select
                      value={filters.brand || ""}
                      onChange={(e) => updateFilter("brand", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
                    <select
                      value={filters.fuelType || ""}
                      onChange={(e) => updateFilter("fuelType", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">All Fuels</option>
                      {fuels.map((fuel) => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                    <select
                      value={filters.transmission || ""}
                      onChange={(e) => updateFilter("transmission", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">All Transmissions</option>
                      {transmissions.map((trans) => (
                        <option key={trans} value={trans}>{trans}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={filters.location || ""}
                      onChange={(e) => updateFilter("location", e.target.value)}
                      placeholder="City name"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (₹)</label>
                    <input
                      type="number"
                      value={filters.minPrice || ""}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (₹)</label>
                    <input
                      type="number"
                      value={filters.maxPrice || ""}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                      placeholder="999999999"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Min Year */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Min Year</label>
                    <input
                      type="number"
                      value={filters.minYear || ""}
                      onChange={(e) => updateFilter("minYear", e.target.value)}
                      placeholder="2015"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Max Year */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Year</label>
                    <input
                      type="number"
                      value={filters.maxYear || ""}
                      onChange={(e) => updateFilter("maxYear", e.target.value)}
                      placeholder="2024"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 sm:flex-initial"
                  >
                    <Search size={18} className="mr-2 inline" /> Apply Filters
                  </button>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-xl border-2 border-gray-300 px-6 py-2.5 font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      <X size={18} className="mr-2 inline" /> Clear Filters
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        <motion.div
          className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.08 }}
        >
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.p key={pagination.total} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
                <span className="font-bold text-blue-900">{pagination.total}</span>
                <span className="text-gray-600 ml-2">car{pagination.total === 1 ? "" : "s"} found</span>
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="text-sm text-gray-600">
            Page <span className="font-bold">{pagination.page}</span> of <span className="font-bold">{pagination.pages}</span>
          </p>
        </motion.div>

        {/* Car Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-2xl" />)}
            </div>
          ) : cars.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center"
            >
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-bold text-gray-900">{loadError ? "Could not load inventory" : "No cars match these filters"}</p>
              <p className="mt-2 text-gray-600">{loadError ? "Please try again later" : "Try adjusting your search criteria"}</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <motion.div
            className="mt-10 flex justify-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="rounded-xl border-2 border-gray-300 px-6 py-2.5 font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}>
              Previous
            </motion.button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.pages, 7) }, (_, index) => index + 1).map((page) => (
                <motion.button
                  key={page} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => goToPage(page)}
                  className={`h-11 w-11 rounded-xl border-2 font-bold transition ${
                    page === pagination.page
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="rounded-xl border-2 border-gray-300 px-6 py-2.5 font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.page >= pagination.pages}
              onClick={() => goToPage(pagination.page + 1)}>
              Next
            </motion.button>
          </motion.div>
        )}
      </section>

      {/* Enquiry Form Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-pad">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-electric text-white shadow-lg shadow-electric/20">
                <MessageSquareText size={25} />
              </span>
              <p className="section-label mt-5">Customer enquiry</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-navy">Tell us what you need.</h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-ink/55">
              Share your preferred car, budget and contact details. Your enquiry will be saved for the Reliable Drives team.
            </p>
          </div>
          <CarEnquiryForm />
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </>
  );
}
