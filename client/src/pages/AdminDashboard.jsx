import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import http from "../api/http";
import BrandLogo from "../components/BrandLogo";
import CarForm from "../components/CarForm";
import { fallbackImage, formatPrice } from "../utils/format";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ brand: "", status: "", featured: "", location: "" });
  const [fetching, setFetching] = useState(false);

  const fetchCars = async (params = {}) => {
    setFetching(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries({ limit: 200, sort: "-createdAt", ...params }).filter(
          ([, value]) => value !== "" && value !== undefined && value !== null
        )
      );
      const { data } = await http.get("/cars", { params: cleanParams });
      setCars(data.cars);
    } catch {
      toast.error("Unable to load inventory.");
      setCars([]);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const saveCar = async (formData) => {
    setSaving(true);
    try {
      if (selectedCar) {
        await http.put(`/cars/${selectedCar._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Car updated");
      } else {
        await http.post("/cars", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Car added");
      }
      setSelectedCar(null);
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this car listing?")) return;
    await http.delete(`/cars/${id}`);
    toast.success("Car deleted");
    fetchCars(filters);
  };

  const statusCycle = {
    available: "reserved",
    reserved: "sold",
    sold: "available"
  };

  const toggleStatus = async (car) => {
    const nextStatus = statusCycle[car.status] || "available";
    const formData = new FormData();
    Object.entries({ ...car, status: nextStatus }).forEach(([key, value]) => {
      if (key !== "images" && key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
        formData.append(key, value);
      }
    });
    await http.put(`/cars/${car._id}`, formData);
    toast.success(`Status updated to ${nextStatus}`);
    fetchCars(filters);
  };

  const toggleFeatured = async (car) => {
    const formData = new FormData();
    Object.entries({ ...car, featured: !car.featured }).forEach(([key, value]) => {
      if (key !== "images" && key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
        formData.append(key, value);
      }
    });
    await http.put(`/cars/${car._id}`, formData);
    toast.success(car.featured ? "Removed from featured" : "Marked as featured");
    fetchCars(filters);
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    fetchCars(filters);
  };

  const totalCount = cars.length;
  const countAvailable = cars.filter((car) => car.status === "available").length;
  const countReserved = cars.filter((car) => car.status === "reserved").length;
  const countSold = cars.filter((car) => car.status === "sold").length;
  const countFeatured = cars.filter((car) => car.featured).length;

  return (
    <section className="container-pad py-10">
      <motion.div
        className="mb-8 flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal">Inventory control</p>
          <h1 className="mt-2 text-4xl font-black">Admin dashboard</h1>
        </div>
        <div className="overflow-hidden rounded-xl bg-navy p-3">
          <BrandLogo variant="admin" />
        </div>
      </motion.div>
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04 }}
      >
        {[
          ["Total cars", totalCount, "bg-electric/10 text-electric"],
          ["Available", countAvailable, "bg-teal/10 text-teal"],
          ["Reserved", countReserved, "bg-blue-100 text-blue-700"],
          ["Sold", countSold, "bg-coral/10 text-coral"],
          ["Featured", countFeatured, "bg-[#a4e6ff]/15 text-[#0d4f6c]"]
        ].map(([label, value, style]) => (
          <div key={label} className="rounded-3xl border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/40">{label}</p>
            <p className={`mt-4 text-3xl font-black ${style}`}>{value}</p>
          </div>
        ))}
      </motion.div>

      <motion.form
        onSubmit={handleSearch}
        className="mb-8 grid gap-4 rounded-[1.75rem] border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Brand</span>
          <input className="field" value={filters.brand} onChange={(event) => setFilters({ ...filters, brand: event.target.value })} placeholder="Brand" />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Location</span>
          <input className="field" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="City" />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Status</span>
          <select className="field" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">Any status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Featured</span>
          <select className="field" value={filters.featured} onChange={(event) => setFilters({ ...filters, featured: event.target.value })}>
            <option value="">Any</option>
            <option value="true">Featured only</option>
          </select>
        </label>
        <div className="flex items-end justify-end gap-3">
          <button type="button" className="btn-secondary" disabled={fetching} onClick={() => { setFilters({ brand: "", status: "", featured: "", location: "" }); fetchCars({}); }}>
            Reset
          </button>
          <button type="submit" className="btn-primary" disabled={fetching}>
            {fetching ? "Applying..." : "Apply"}
          </button>
        </div>
      </motion.form>

      <div className="grid gap-7 xl:grid-cols-[.9fr_1.1fr]">
        <CarForm selectedCar={selectedCar} onSubmit={saveCar} onCancel={() => setSelectedCar(null)} saving={saving} />
        <motion.div
          className="overflow-hidden rounded-lg border border-line bg-white shadow-sm"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          layout
        >
          <div className="border-b border-line p-5">
            <h2 className="text-xl font-black">All cars</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-mist text-ink/65">
                <tr>
                  <th className="px-4 py-3">Car</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}><td className="px-4 py-6 text-ink/60" colSpan="6">Loading cars...</td></motion.tr>
                ) : (
                  <AnimatePresence initial={false}>
                    {cars.map((car, index) => (
                      <motion.tr
                        key={car._id}
                        className={`border-t border-line transition-colors hover:bg-mist/70 ${selectedCar?._id === car._id ? "bg-teal/5" : ""}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.26, delay: Math.min(index * 0.025, 0.18) }}
                        layout
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <motion.img
                              src={car.images?.[0]?.url || fallbackImage}
                              alt=""
                              className="h-12 w-16 rounded-md object-cover"
                              whileHover={{ scale: 1.06 }}
                              transition={{ duration: 0.2 }}
                            />
                            <div>
                              <p className="font-bold">{car.title}</p>
                              <p className="text-ink/55">{car.brand} · {car.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold">{formatPrice(car.price)}</td>
                        <td className="px-4 py-3">
                          <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`rounded-md px-3 py-1 text-xs font-black uppercase ${car.status === "sold" ? "bg-coral/10 text-coral" : car.status === "reserved" ? "bg-blue-100 text-blue-700" : "bg-teal/10 text-teal"}`}
                            onClick={() => toggleStatus(car)}
                          >
                            {car.status}
                          </motion.button>
                        </td>
                        <td className="px-4 py-3">
                          <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`rounded-md px-3 py-1 text-xs font-black uppercase ${car.featured ? "bg-electric text-navy" : "bg-white text-ink border border-line"}`}
                            onClick={() => toggleFeatured(car)}
                          >
                            {car.featured ? "Featured" : "Mark featured"}
                          </motion.button>
                        </td>
                        <td className="px-4 py-3">{car.location}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-3" onClick={() => setSelectedCar(car)} title="Edit"><Edit size={16} /></motion.button>
                            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="btn-secondary px-3 text-coral hover:border-coral hover:text-coral" onClick={() => deleteCar(car._id)} title="Delete"><Trash2 size={16} /></motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
