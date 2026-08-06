import { motion } from "framer-motion";
import { Search } from "lucide-react";

const fuels = ["", "Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const transmissions = ["", "Manual", "Automatic", "CVT", "AMT", "DCT"];
const bodyTypes = ["", "Sedan", "SUV", "Hatchback", "MPV", "Coupe", "Convertible", "Wagon"];
const ownershipOptions = ["", "1st owner", "2nd owner", "3rd owner", "4th owner+"];
const sortOptions = [
  ["-createdAt", "Newest"],
  ["price", "Price low-high"],
  ["-price", "Price high-low"],
  ["kmDriven", "Lowest km"]
];
const formMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.045 } },
};
const fieldMotion = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

export default function SearchFilters({ filters, setFilters, onSubmit, compact = false, embedded = false }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const fields = [
    {
      key: "brand",
      label: "Brand",
      control: <input className="field" placeholder="e.g. Hyundai" value={filters.brand || ""} onChange={(event) => update("brand", event.target.value)} />
    },
    {
      key: "location",
      label: "City",
      control: <input className="field" placeholder="e.g. Mumbai" value={filters.location || ""} onChange={(event) => update("location", event.target.value)} />
    },
    {
      key: "minYear",
      label: "Year from",
      control: <input className="field" type="number" min="1980" placeholder="2015" value={filters.minYear || ""} onChange={(event) => update("minYear", event.target.value)} />
    },
    {
      key: "maxYear",
      label: "Year to",
      control: <input className="field" type="number" min="1980" placeholder="2024" value={filters.maxYear || ""} onChange={(event) => update("maxYear", event.target.value)} />
    },
    {
      key: "year",
      label: "Exact year",
      control: <input className="field" type="number" min="1980" placeholder="2022" value={filters.year || ""} onChange={(event) => update("year", event.target.value)} />
    },
    {
      key: "minPrice",
      label: "Minimum price",
      control: <input className="field" type="number" min="0" placeholder="₹ Minimum" value={filters.minPrice || ""} onChange={(event) => update("minPrice", event.target.value)} />
    },
    {
      key: "maxPrice",
      label: "Maximum price",
      control: <input className="field" type="number" min="0" placeholder="₹ Maximum" value={filters.maxPrice || ""} onChange={(event) => update("maxPrice", event.target.value)} />
    }
  ];

  return (
    <motion.form
      onSubmit={onSubmit}
      variants={formMotion}
      initial="hidden"
      animate="show"
      className={`grid gap-4 ${
        embedded ? "" : "premium-panel p-5 sm:p-6"
      } ${
        compact ? "md:grid-cols-3 xl:grid-cols-6" : "md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {fields.map(({ key, label, control }) => (
        <motion.label key={key} variants={fieldMotion} className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">{label}</span>
          {control}
        </motion.label>
      ))}
      <motion.label variants={fieldMotion} className="space-y-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Transmission</span>
        <select className="field" value={filters.transmission || ""} onChange={(event) => update("transmission", event.target.value)}>
          {transmissions.map((option) => <option key={option} value={option}>{option || "Any transmission"}</option>)}
        </select>
      </motion.label>
      <motion.label variants={fieldMotion} className="space-y-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Fuel type</span>
        <select className="field" value={filters.fuelType || ""} onChange={(event) => update("fuelType", event.target.value)}>
          {fuels.map((fuel) => <option key={fuel} value={fuel}>{fuel || "Any fuel"}</option>)}
        </select>
      </motion.label>
      <motion.label variants={fieldMotion} className="space-y-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Body type</span>
        <select className="field" value={filters.bodyType || ""} onChange={(event) => update("bodyType", event.target.value)}>
          {bodyTypes.map((type) => <option key={type} value={type}>{type || "Any body type"}</option>)}
        </select>
      </motion.label>
      <motion.label variants={fieldMotion} className="space-y-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Ownership</span>
        <select className="field" value={filters.ownership || ""} onChange={(event) => update("ownership", event.target.value)}>
          {ownershipOptions.map((owner) => <option key={owner} value={owner}>{owner || "Any ownership"}</option>)}
        </select>
      </motion.label>
      <motion.label variants={fieldMotion} className="space-y-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Seating</span>
        <select className="field" value={filters.seatCapacity || ""} onChange={(event) => update("seatCapacity", event.target.value)}>
          <option value="">Any seats</option>
          {[4, 5, 6, 7, 8, 9, 10].map((value) => (
            <option key={value} value={value}>{value} seats</option>
          ))}
        </select>
      </motion.label>
      {compact && (
        <motion.label variants={fieldMotion} className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Sort by</span>
          <select className="field" value={filters.sort || "-createdAt"} onChange={(event) => update("sort", event.target.value)}>
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </motion.label>
      )}
      <motion.button
        variants={fieldMotion}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary motion-sheen mt-1 md:col-span-full"
        type="submit"
      >
        <Search size={17} /> Show matching cars
      </motion.button>
    </motion.form>
  );
}
