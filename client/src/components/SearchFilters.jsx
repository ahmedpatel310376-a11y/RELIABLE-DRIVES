import { Search } from "lucide-react";

const fuels = ["", "Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

export default function SearchFilters({ filters, setFilters, onSubmit, compact = false }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <form
      onSubmit={onSubmit}
      className={`grid gap-3 rounded-lg border border-line bg-white p-4 shadow-soft ${
        compact ? "md:grid-cols-6" : "md:grid-cols-5"
      }`}
    >
      <input className="field" placeholder="Brand" value={filters.brand || ""} onChange={(e) => update("brand", e.target.value)} />
      <input className="field" placeholder="City" value={filters.location || ""} onChange={(e) => update("location", e.target.value)} />
      <input className="field" type="number" placeholder="Min price" value={filters.minPrice || ""} onChange={(e) => update("minPrice", e.target.value)} />
      <input className="field" type="number" placeholder="Max price" value={filters.maxPrice || ""} onChange={(e) => update("maxPrice", e.target.value)} />
      <select className="field" value={filters.fuelType || ""} onChange={(e) => update("fuelType", e.target.value)}>
        {fuels.map((fuel) => <option key={fuel} value={fuel}>{fuel || "Any fuel"}</option>)}
      </select>
      {compact && (
        <select className="field" value={filters.sort || "-createdAt"} onChange={(e) => update("sort", e.target.value)}>
          <option value="-createdAt">Newest</option>
          <option value="price">Price low-high</option>
          <option value="-price">Price high-low</option>
          <option value="kmDriven">Lowest km</option>
        </select>
      )}
      <button className="btn-primary md:col-span-full" type="submit">
        <Search size={16} /> Search cars
      </button>
    </form>
  );
}
