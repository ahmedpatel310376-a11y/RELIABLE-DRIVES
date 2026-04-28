import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";

const emptyForm = {
  title: "",
  brand: "",
  price: "",
  year: new Date().getFullYear(),
  fuelType: "Petrol",
  transmission: "Manual",
  kmDriven: "",
  location: "",
  description: "",
  status: "available"
};

export default function CarForm({ selectedCar, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!selectedCar) {
      setForm(emptyForm);
      setFiles([]);
      return;
    }

    setForm(
      Object.keys(emptyForm).reduce(
        (next, key) => ({ ...next, [key]: selectedCar[key] ?? emptyForm[key] }),
        {}
      )
    );
    setFiles([]);
  }, [selectedCar]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    files.forEach((file) => data.append("images", file));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">{selectedCar ? "Edit car" : "Add new car"}</h2>
        {selectedCar && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="field" required placeholder="Car title" value={form.title} onChange={(e) => update("title", e.target.value)} />
        <input className="field" required placeholder="Brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} />
        <input className="field" required type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => update("price", e.target.value)} />
        <input className="field" required type="number" min="1980" placeholder="Year" value={form.year} onChange={(e) => update("year", e.target.value)} />
        <select className="field" value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)}>
          {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="field" value={form.transmission} onChange={(e) => update("transmission", e.target.value)}>
          {["Manual", "Automatic"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <input className="field" required type="number" min="0" placeholder="KM driven" value={form.kmDriven} onChange={(e) => update("kmDriven", e.target.value)} />
        <input className="field" required placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
        <select className="field" value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
        <label className="field flex cursor-pointer items-center gap-2">
          <Upload size={16} /> Upload images
          <input className="hidden" type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        </label>
        <textarea className="field md:col-span-2" required rows="4" placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>
      {files.length > 0 && <p className="mt-3 text-sm text-ink/60">{files.length} image(s) selected</p>}
      <button className="btn-primary mt-5" disabled={saving} type="submit">
        <Save size={16} /> {saving ? "Saving..." : selectedCar ? "Update car" : "Create car"}
      </button>
    </form>
  );
}
