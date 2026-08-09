import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Trash2, Plus, TrendingUp, Package, CheckCircle, Clock, AlertCircle, Star, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import http from "../api/http";
import BrandLogo from "../components/BrandLogo";
import CarForm from "../components/CarForm";
import CarEnquiryForm from "../components/CarEnquiryForm";
import { fallbackImage, formatPrice } from "../utils/format";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ brand: "", status: "", featured: "", location: "" });
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");

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

  const stats = [
    { label: "Total Cars", value: totalCount, icon: Package, color: "bg-blue-100 text-blue-600", bgColor: "from-blue-50 to-blue-100" },
    { label: "Available", value: countAvailable, icon: CheckCircle, color: "bg-green-100 text-green-600", bgColor: "from-green-50 to-green-100" },
    { label: "Reserved", value: countReserved, icon: Clock, color: "bg-yellow-100 text-yellow-600", bgColor: "from-yellow-50 to-yellow-100" },
    { label: "Sold", value: countSold, icon: AlertCircle, color: "bg-red-100 text-red-600", bgColor: "from-red-50 to-red-100" },
    { label: "Featured", value: countFeatured, icon: Star, color: "bg-purple-100 text-purple-600", bgColor: "from-purple-50 to-purple-100" }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 sm:py-12">
      <div className="container-pad">
        {/* Header */}
        <motion.div
          className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Inventory Control</p>
            <h1 className="mt-2 text-4xl font-black text-gray-900 sm:text-5xl">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your car inventory, listings, and customer enquiries</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-md">
            <BrandLogo variant="admin" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {stats.map(({ label, value, icon: Icon, color, bgColor }, idx) => (
            <motion.div
              key={label}
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)" }}
              className={`rounded-2xl border border-gray-200 bg-gradient-to-br ${bgColor} p-6 shadow-md transition`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + idx * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{label}</p>
                  <p className="mt-3 text-4xl font-black text-gray-900">{value}</p>
                </div>
                <div className={`rounded-full p-3 ${color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="mb-8 flex gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {[
            { id: "inventory", label: "Inventory Management", icon: Package },
            { id: "enquiries", label: "Customer Enquiries", icon: MessageSquare }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
                activeTab === id
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filter Section */}
            <motion.form
              onSubmit={handleSearch}
              className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <h3 className="mb-6 text-lg font-bold text-gray-900">Filter Inventory</h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Brand</span>
                  <input
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={filters.brand}
                    onChange={(event) => setFilters({ ...filters, brand: event.target.value })}
                    placeholder="e.g., Toyota"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Location</span>
                  <input
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={filters.location}
                    onChange={(event) => setFilters({ ...filters, location: event.target.value })}
                    placeholder="e.g., Mumbai"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Status</span>
                  <select
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={filters.status}
                    onChange={(event) => setFilters({ ...filters, status: event.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">Featured</span>
                  <select
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    value={filters.featured}
                    onChange={(event) => setFilters({ ...filters, featured: event.target.value })}
                  >
                    <option value="">All Cars</option>
                    <option value="true">Featured Only</option>
                  </select>
                </label>
                <div className="flex items-end gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2.5 font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                    disabled={fetching}
                    onClick={() => {
                      setFilters({ brand: "", status: "", featured: "", location: "" });
                      fetchCars({});
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50"
                    disabled={fetching}
                  >
                    {fetching ? "Filtering..." : "Apply"}
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Main Content Grid */}
            <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
              {/* Car Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCar ? "Edit Car" : "Add New Car"}
                  </h2>
                  {selectedCar && (
                    <button
                      onClick={() => setSelectedCar(null)}
                      className="rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      ✕ Cancel
                    </button>
                  )}
                </div>
                <CarForm
                  selectedCar={selectedCar}
                  onSubmit={saveCar}
                  onCancel={() => setSelectedCar(null)}
                  saving={saving}
                />
              </motion.div>

              {/* Cars Table */}
              <motion.div
                className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
              >
                <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50 p-6">
                  <h2 className="text-xl font-bold text-gray-900">All Cars</h2>
                  <p className="mt-1 text-sm text-gray-600">{totalCount} total listings</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-bold text-gray-700">Car</th>
                        <th className="px-6 py-4 font-bold text-gray-700">Price</th>
                        <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                        <th className="px-6 py-4 font-bold text-gray-700">Featured</th>
                        <th className="px-6 py-4 font-bold text-gray-700">Location</th>
                        <th className="px-6 py-4 font-bold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            Loading cars...
                          </td>
                        </tr>
                      ) : cars.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            No cars found
                          </td>
                        </tr>
                      ) : (
                        <AnimatePresence initial={false}>
                          {cars.map((car, index) => (
                            <motion.tr
                              key={car._id}
                              className={`border-t border-gray-200 transition hover:bg-blue-50 ${
                                selectedCar?._id === car._id ? "bg-blue-100" : ""
                              }`}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -16 }}
                              transition={{ duration: 0.26, delay: Math.min(index * 0.025, 0.18) }}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <motion.img
                                    src={car.images?.[0]?.url || fallbackImage}
                                    alt=""
                                    className="h-12 w-16 rounded-lg object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <div>
                                    <p className="font-bold text-gray-900">{car.title}</p>
                                    <p className="text-xs text-gray-600">
                                      {car.brand} · {car.year}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-900">
                                {formatPrice(car.price)}
                              </td>
                              <td className="px-6 py-4">
                                <motion.button
                                  whileHover={{ y: -1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase transition ${
                                    car.status === "sold"
                                      ? "bg-red-100 text-red-700"
                                      : car.status === "reserved"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                  onClick={() => toggleStatus(car)}
                                  title="Click to change status"
                                >
                                  {car.status}
                                </motion.button>
                              </td>
                              <td className="px-6 py-4">
                                <motion.button
                                  whileHover={{ y: -1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase transition ${
                                    car.featured
                                      ? "bg-purple-100 text-purple-700"
                                      : "border border-gray-300 text-gray-700 hover:border-gray-400"
                                  }`}
                                  onClick={() => toggleFeatured(car)}
                                  title="Click to toggle featured"
                                >
                                  {car.featured ? "★ Featured" : "☆ Mark"}
                                </motion.button>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{car.location}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="rounded-lg border-2 border-gray-300 p-2 text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                                    onClick={() => setSelectedCar(car)}
                                    title="Edit car"
                                  >
                                    <Edit size={16} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="rounded-lg border-2 border-gray-300 p-2 text-gray-700 transition hover:border-red-500 hover:text-red-600"
                                    onClick={() => deleteCar(car._id)}
                                    title="Delete car"
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
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
          </motion.div>
        )}

        {/* Enquiries Tab */}
        {activeTab === "enquiries" && (
          <motion.div
            key="enquiries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Customer Enquiry Form</h2>
              <p className="mt-2 text-gray-600">
                Send test enquiries to verify the form functionality
              </p>
            </div>
            <CarEnquiryForm />
          </motion.div>
        )}
      </div>
    </section>
  );
}
