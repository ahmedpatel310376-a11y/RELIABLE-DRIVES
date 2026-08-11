import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  CircleDot,
  Clock3,
  Edit,
  Eye,
  Filter,
  Fuel,
  LayoutDashboard,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Settings2,
  Star,
  Trash2,
  UserRound,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import http from "../api/http";
import BrandLogo from "../components/BrandLogo";
import CarForm from "../components/CarForm";
import { fallbackImage, formatPrice } from "../utils/format";

const enquiryStatuses = ["New", "Contacted", "In Progress", "Closed"];

const statusStyles = {
  available: "bg-blue-50 text-electric ring-blue-100",
  reserved: "bg-amber-50 text-amber-700 ring-amber-100",
  sold: "bg-slate-100 text-slate-600 ring-slate-200",
  New: "bg-blue-50 text-electric ring-blue-100",
  Contacted: "bg-sky-50 text-sky-700 ring-sky-100",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-100",
  Closed: "bg-emerald-50 text-emerald-700 ring-emerald-100"
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value))
    : "Not available";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ brand: "", status: "", featured: "", location: "" });
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [summary, setSummary] = useState({
    counts: { total: 0, available: 0, reserved: 0, sold: 0, featured: 0 },
    recent: []
  });
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("");
  const initialLoadDone = useRef(false);

  const fetchCars = async (params = {}) => {
    setFetching(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries({ limit: 24, sort: "-createdAt", ...params }).filter(
          ([, value]) => value !== "" && value !== undefined && value !== null
        )
      );
      const { data } = await http.get("/cars", { params: cleanParams });
      setCars(data.cars);
      setInventoryTotal(data.pagination?.total || data.cars.length);
    } catch {
      toast.error("Unable to load inventory.");
      setCars([]);
      setInventoryTotal(0);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await http.get("/cars/admin/summary");
      setSummary(data);
    } catch {
      setSummary((current) => ({
        counts: {
          total: inventoryTotal,
          available: cars.filter((car) => car.status === "available").length,
          reserved: cars.filter((car) => car.status === "reserved").length,
          sold: cars.filter((car) => car.status === "sold").length,
          featured: cars.filter((car) => car.featured).length
        },
        recent: current.recent.length ? current.recent : cars.slice(0, 6)
      }));
    }
  };

  const fetchEnquiries = async (status = enquiryStatusFilter) => {
    setEnquiriesLoading(true);
    try {
      const params = status ? { status } : {};
      const { data } = await http.get("/enquiries", { params });
      setEnquiries(data.enquiries);
    } catch {
      toast.error("Unable to load enquiries.");
      setEnquiries([]);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    fetchCars();
    fetchSummary();
    fetchEnquiries("");
  });

  const refreshDashboard = () => {
    fetchCars(filters);
    fetchSummary();
    fetchEnquiries(enquiryStatusFilter);
  };

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
      refreshDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this car listing?")) return;
    try {
      await http.delete(`/cars/${id}`);
      toast.success("Car deleted");
      refreshDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const statusCycle = {
    available: "reserved",
    reserved: "sold",
    sold: "available"
  };

  const updateCarWithFormData = async (car, updates) => {
    const formData = new FormData();
    Object.entries({ ...car, ...updates }).forEach(([key, value]) => {
      if (!["images", "_id", "__v", "createdAt", "updatedAt"].includes(key)) {
        formData.append(key, value);
      }
    });
    await http.put(`/cars/${car._id}`, formData);
  };

  const toggleStatus = async (car) => {
    const nextStatus = statusCycle[car.status] || "available";
    try {
      await updateCarWithFormData(car, { status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
      refreshDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const toggleFeatured = async (car) => {
    try {
      await updateCarWithFormData(car, { featured: !car.featured });
      toast.success(car.featured ? "Removed from featured" : "Marked as featured");
      refreshDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Featured update failed");
    }
  };

  const updateEnquiryStatus = async (enquiry, status) => {
    try {
      const { data } = await http.patch(`/enquiries/${enquiry._id}/status`, { status });
      setEnquiries((current) => current.map((item) => (item._id === data._id ? data : item)));
      toast.success("Enquiry status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update enquiry");
    }
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    fetchCars(filters);
  };

  const handleEnquiryFilter = (status) => {
    setEnquiryStatusFilter(status);
    fetchEnquiries(status);
  };

  const counts = summary.counts.total ? summary.counts : {
    total: inventoryTotal,
    available: cars.filter((car) => car.status === "available").length,
    reserved: cars.filter((car) => car.status === "reserved").length,
    sold: cars.filter((car) => car.status === "sold").length,
    featured: cars.filter((car) => car.featured).length
  };

  const recentInventory = summary.recent.length ? summary.recent : cars.slice(0, 6);
  const newEnquiries = enquiries.filter((enquiry) => enquiry.status === "New").length;
  const contactedEnquiries = enquiries.filter((enquiry) => enquiry.status === "Contacted").length;

  const metrics = [
    { label: "Total inventory", value: counts.total, icon: Package, detail: "All live listings", accent: "text-electric", bg: "bg-blue-50" },
    { label: "Available cars", value: counts.available, icon: CheckCircle2, detail: "Ready for enquiry", accent: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Sold cars", value: counts.sold, icon: XCircle, detail: "Completed deals", accent: "text-slate-600", bg: "bg-slate-100" },
    { label: "Featured cars", value: counts.featured, icon: Star, detail: "Homepage priority", accent: "text-blue-700", bg: "bg-blue-100" }
  ];

  const quickActions = [
    { label: "Add Car", description: "Create a new listing", icon: Plus, tab: "inventory", action: () => setSelectedCar(null) },
    { label: "Manage Inventory", description: "Edit status and listings", icon: Settings2, tab: "inventory" },
    { label: "View Enquiries", description: `${newEnquiries} new customer request${newEnquiries === 1 ? "" : "s"}`, icon: MessageSquare, tab: "enquiries" }
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: CarFront },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare }
  ];

  const openAction = (action) => {
    setActiveTab(action.tab);
    action.action?.();
  };

  return (
    <section className="min-h-screen bg-mist py-8 sm:py-10">
      <div className="container-pad">
        <motion.div
          className="relative mb-8 overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-soft sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(22,119,255,0.28),_transparent_42%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">Reliable Drives control room</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Inventory Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                Manage listings, review customer enquiries, and keep the dealership inventory ready for serious buyers.
              </p>
            </div>
            <div className="w-fit rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <BrandLogo variant="admin" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.04 }}
        >
          {metrics.map(({ label, value, icon: Icon, detail, accent, bg }, index) => (
            <motion.article
              key={label}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm transition"
              whileHover={{ y: -4, boxShadow: "0 24px 70px rgba(6, 24, 47, 0.12)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06 + index * 0.04 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">{label}</p>
                  <p className="mt-4 text-4xl font-black text-ink">{value}</p>
                  <p className="mt-2 text-sm font-semibold text-ink/50">{detail}</p>
                </div>
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${bg} ${accent}`}>
                  <Icon size={22} />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <motion.div
            className="rounded-2xl border border-line bg-white p-4 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => openAction(action)}
                  className="group rounded-xl border border-line bg-mist/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-electric hover:bg-white hover:shadow-sm"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-blue-300 transition group-hover:bg-electric group-hover:text-white">
                    <action.icon size={19} />
                  </span>
                  <span className="mt-4 block text-sm font-black text-ink">{action.label}</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-ink/50">{action.description}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-line bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">Enquiry pulse</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-3xl font-black text-electric">{newEnquiries}</p>
                <p className="mt-1 text-xs font-bold text-ink/50">New leads</p>
              </div>
              <div className="rounded-xl bg-sky-50 p-4">
                <p className="text-3xl font-black text-sky-700">{contactedEnquiries}</p>
                <p className="mt-1 text-xs font-bold text-ink/50">Contacted</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition sm:flex-none sm:px-6 ${
                activeTab === id
                  ? "bg-electric text-white shadow-lg shadow-electric/20"
                  : "text-ink/60 hover:bg-mist hover:text-ink"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <section className="rounded-2xl border border-line bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-line p-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">Recent inventory</p>
                    <h2 className="mt-1 text-xl font-black text-ink">Latest listings</h2>
                  </div>
                  <button type="button" className="btn-secondary px-4 py-2" onClick={() => setActiveTab("inventory")}>
                    Manage <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="divide-y divide-line">
                  {recentInventory.length ? recentInventory.map((car) => (
                    <div key={car._id} className="flex items-center gap-4 p-4 transition hover:bg-mist/70">
                      <img src={car.images?.[0]?.url || fallbackImage} alt="" className="h-16 w-24 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-ink">{car.title}</p>
                        <p className="mt-1 text-sm font-semibold text-ink/50">{car.brand} · {car.year} · {formatPrice(car.price)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ring-1 ${statusStyles[car.status] || statusStyles.available}`}>
                        {car.status}
                      </span>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-sm font-semibold text-ink/45">No inventory added yet.</div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-line p-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">Recent enquiries</p>
                    <h2 className="mt-1 text-xl font-black text-ink">Customer requests</h2>
                  </div>
                  <button type="button" className="btn-secondary px-4 py-2" onClick={() => setActiveTab("enquiries")}>
                    View <Eye size={15} />
                  </button>
                </div>
                <div className="divide-y divide-line">
                  {enquiriesLoading ? (
                    <div className="p-8 text-center text-sm font-semibold text-ink/45">Loading enquiries...</div>
                  ) : enquiries.slice(0, 5).length ? enquiries.slice(0, 5).map((enquiry) => (
                    <div key={enquiry._id} className="p-4 transition hover:bg-mist/70">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-ink">{enquiry.name}</p>
                          <p className="mt-1 text-sm font-semibold text-ink/50">{enquiry.phone}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusStyles[enquiry.status] || statusStyles.New}`}>
                          {enquiry.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-ink/60">
                        {enquiry.preferredCar || enquiry.preferredBrand || "Open preference"} · Budget {formatPrice(enquiry.budget)}
                      </p>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-sm font-semibold text-ink/45">No enquiries yet.</div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <form onSubmit={handleSearch} className="mb-7 rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Filter size={18} className="text-electric" />
                  <h2 className="text-lg font-black text-ink">Filter inventory</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                  <div className="flex items-end gap-3">
                    <button type="button" className="btn-secondary flex-1" disabled={fetching} onClick={() => { setFilters({ brand: "", status: "", featured: "", location: "" }); fetchCars({}); }}>
                      Reset
                    </button>
                    <button type="submit" className="btn-primary flex-1" disabled={fetching}>
                      {fetching ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>
              </form>

              <div className="grid gap-7 xl:grid-cols-[.9fr_1.1fr]">
                <CarForm selectedCar={selectedCar} onSubmit={saveCar} onCancel={() => setSelectedCar(null)} saving={saving} />
                <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                  <div className="border-b border-line p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">Manage inventory</p>
                    <h2 className="mt-1 text-xl font-black text-ink">All listings</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] text-left text-sm">
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
                          <tr><td className="px-4 py-8 text-center text-ink/50" colSpan="6">Loading cars...</td></tr>
                        ) : cars.length === 0 ? (
                          <tr><td className="px-4 py-8 text-center text-ink/50" colSpan="6">No cars found.</td></tr>
                        ) : cars.map((car, index) => (
                          <motion.tr
                            key={car._id}
                            className={`border-t border-line transition hover:bg-mist/70 ${selectedCar?._id === car._id ? "bg-blue-50" : ""}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: Math.min(index * 0.02, 0.16) }}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={car.images?.[0]?.url || fallbackImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                                <div className="min-w-0">
                                  <p className="truncate font-black text-ink">{car.title}</p>
                                  <p className="text-xs font-semibold text-ink/50">{car.brand} · {car.year}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-black text-ink">{formatPrice(car.price)}</td>
                            <td className="px-4 py-3">
                              <button type="button" className={`rounded-full px-3 py-1 text-xs font-black uppercase ring-1 ${statusStyles[car.status] || statusStyles.available}`} onClick={() => toggleStatus(car)}>
                                {car.status}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <button type="button" className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase ring-1 ${car.featured ? "bg-blue-50 text-electric ring-blue-100" : "bg-white text-ink/55 ring-line"}`} onClick={() => toggleFeatured(car)}>
                                <Star size={13} /> {car.featured ? "Featured" : "Mark"}
                              </button>
                            </td>
                            <td className="px-4 py-3 font-semibold text-ink/65">{car.location}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button type="button" className="rounded-lg border border-line p-2 text-ink/65 transition hover:border-electric hover:text-electric" onClick={() => setSelectedCar(car)} title="Edit car">
                                  <Edit size={16} />
                                </button>
                                <button type="button" className="rounded-lg border border-line p-2 text-ink/65 transition hover:border-electric hover:text-electric" onClick={() => deleteCar(car._id)} title="Delete car">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === "enquiries" && (
            <motion.section
              key="enquiries"
              className="rounded-2xl border border-line bg-white shadow-sm"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">Customer enquiries</p>
                  <h2 className="mt-1 text-xl font-black text-ink">Lead management</h2>
                </div>
                <select className="field max-w-xs" value={enquiryStatusFilter} onChange={(event) => handleEnquiryFilter(event.target.value)}>
                  <option value="">All enquiries</option>
                  {enquiryStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1040px] text-left text-sm">
                  <thead className="bg-mist text-ink/65">
                    <tr>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Budget</th>
                      <th className="px-4 py-3">Preference</th>
                      <th className="px-4 py-3">Fuel</th>
                      <th className="px-4 py-3">Transmission</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiriesLoading ? (
                      <tr><td className="px-4 py-8 text-center text-ink/50" colSpan="8">Loading enquiries...</td></tr>
                    ) : enquiries.length === 0 ? (
                      <tr><td className="px-4 py-8 text-center text-ink/50" colSpan="8">No enquiries found.</td></tr>
                    ) : enquiries.map((enquiry) => (
                      <tr key={enquiry._id} className="border-t border-line transition hover:bg-mist/70">
                        <td className="px-4 py-4">
                          <p className="font-black text-ink">{enquiry.name}</p>
                          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-ink/50"><Phone size={13} /> {enquiry.phone}</p>
                        </td>
                        <td className="px-4 py-4 font-black text-ink">{formatPrice(enquiry.budget)}</td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-ink">{enquiry.preferredCar || "Any model"}</p>
                          <p className="mt-1 text-xs font-semibold text-ink/50">{enquiry.preferredBrand || "Any brand"}</p>
                        </td>
                        <td className="px-4 py-4 text-ink/65">{enquiry.fuelType || "Any"}</td>
                        <td className="px-4 py-4 text-ink/65">{enquiry.transmission || "Any"}</td>
                        <td className="max-w-xs px-4 py-4 text-ink/60">{enquiry.notes || "No notes added"}</td>
                        <td className="px-4 py-4 text-xs font-semibold text-ink/50">{formatDate(enquiry.createdAt)}</td>
                        <td className="px-4 py-4">
                          <select
                            className={`rounded-xl border border-line px-3 py-2 text-xs font-black outline-none ${statusStyles[enquiry.status] || statusStyles.New}`}
                            value={enquiry.status}
                            onChange={(event) => updateEnquiryStatus(enquiry, event.target.value)}
                          >
                            {enquiryStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 lg:hidden">
                {enquiriesLoading ? (
                  <div className="py-8 text-center text-sm font-semibold text-ink/50">Loading enquiries...</div>
                ) : enquiries.length === 0 ? (
                  <div className="py-8 text-center text-sm font-semibold text-ink/50">No enquiries found.</div>
                ) : enquiries.map((enquiry) => (
                  <article key={enquiry._id} className="rounded-2xl border border-line bg-mist/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 font-black text-ink"><UserRound size={16} className="text-electric" /> {enquiry.name}</p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink/55"><Phone size={15} /> {enquiry.phone}</p>
                      </div>
                      <select
                        className={`rounded-xl border border-line px-3 py-2 text-xs font-black outline-none ${statusStyles[enquiry.status] || statusStyles.New}`}
                        value={enquiry.status}
                        onChange={(event) => updateEnquiryStatus(enquiry, event.target.value)}
                      >
                        {enquiryStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <p className="rounded-xl bg-white p-3 font-semibold text-ink/65"><BadgeCheck size={15} className="mb-1 text-electric" /> {enquiry.preferredCar || enquiry.preferredBrand || "Open preference"}</p>
                      <p className="rounded-xl bg-white p-3 font-semibold text-ink/65"><CircleDot size={15} className="mb-1 text-electric" /> Budget {formatPrice(enquiry.budget)}</p>
                      <p className="rounded-xl bg-white p-3 font-semibold text-ink/65"><Fuel size={15} className="mb-1 text-electric" /> {enquiry.fuelType || "Any fuel"}</p>
                      <p className="rounded-xl bg-white p-3 font-semibold text-ink/65"><Clock3 size={15} className="mb-1 text-electric" /> {formatDate(enquiry.createdAt)}</p>
                    </div>
                    <p className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-ink/60">{enquiry.notes || "No notes added"}</p>
                  </article>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
