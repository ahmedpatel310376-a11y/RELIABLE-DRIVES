import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import http from "../api/http";
import CarForm from "../components/CarForm";
import { fallbackImage, formatPrice } from "../utils/format";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    setLoading(true);
    const { data } = await http.get("/cars", { params: { limit: 100, sort: "-createdAt" } });
    setCars(data.cars);
    setLoading(false);
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
    fetchCars();
  };

  const toggleStatus = async (car) => {
    const formData = new FormData();
    Object.entries({ ...car, status: car.status === "sold" ? "available" : "sold" }).forEach(([key, value]) => {
      if (key !== "images" && key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
        formData.append(key, value);
      }
    });
    await http.put(`/cars/${car._id}`, formData);
    toast.success("Status updated");
    fetchCars();
  };

  return (
    <section className="container-pad py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-teal">Inventory control</p>
        <h1 className="mt-2 text-4xl font-black">Admin dashboard</h1>
      </div>
      <div className="grid gap-7 xl:grid-cols-[.9fr_1.1fr]">
        <CarForm selectedCar={selectedCar} onSubmit={saveCar} onCancel={() => setSelectedCar(null)} saving={saving} />
        <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
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
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6 text-ink/60" colSpan="5">Loading cars...</td></tr>
                ) : cars.map((car) => (
                  <tr key={car._id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={car.images?.[0]?.url || fallbackImage} alt="" className="h-12 w-16 rounded-md object-cover" />
                        <div>
                          <p className="font-bold">{car.title}</p>
                          <p className="text-ink/55">{car.brand} · {car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold">{formatPrice(car.price)}</td>
                    <td className="px-4 py-3">
                      <button
                        className={`rounded-md px-3 py-1 text-xs font-black uppercase ${car.status === "sold" ? "bg-coral/10 text-coral" : "bg-teal/10 text-teal"}`}
                        onClick={() => toggleStatus(car)}
                      >
                        {car.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">{car.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="btn-secondary px-3" onClick={() => setSelectedCar(car)} title="Edit"><Edit size={16} /></button>
                        <button className="btn-secondary px-3 text-coral hover:border-coral hover:text-coral" onClick={() => deleteCar(car._id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
