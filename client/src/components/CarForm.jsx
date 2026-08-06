import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, ImagePlus, Save, Trash2, Upload, X } from "lucide-react";

const MAX_IMAGE_COUNT = 8;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const emptyForm = {
  title: "",
  brand: "",
  price: "",
  year: new Date().getFullYear(),
  fuelType: "Petrol",
  transmission: "Manual",
  bodyType: "Sedan",
  seatCapacity: "5",
  ownership: "1st owner",
  kmDriven: "",
  location: "",
  description: "",
  status: "available",
  featured: false
};
const formMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.04 } },
};
const fieldMotion = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function CarForm({ selectedCar, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const photoPreviews = useMemo(
    () => files.map((file) => ({ file, url: window.URL.createObjectURL(file) })),
    [files]
  );

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

  useEffect(() => () => {
    photoPreviews.forEach((photo) => window.URL.revokeObjectURL(photo.url));
  }, [photoPreviews]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const chooseFiles = (selectedFiles) => {
    const incomingFiles = Array.from(selectedFiles || []);
    const imageFiles = incomingFiles.filter((file) => file.type.startsWith("image/"));
    const oversizedFiles = imageFiles.filter((file) => file.size > MAX_IMAGE_SIZE_BYTES);
    const validFiles = imageFiles.filter((file) => file.size <= MAX_IMAGE_SIZE_BYTES);
    const availableSlots = MAX_IMAGE_COUNT - files.length;
    const acceptedFiles = validFiles.slice(0, availableSlots);

    if (incomingFiles.length !== imageFiles.length) {
      toast.error("Only image files can be uploaded.");
    }
    if (oversizedFiles.length) {
      toast.error(`Each image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
    }
    if (validFiles.length > availableSlots) {
      toast.error(`You can upload up to ${MAX_IMAGE_COUNT} photos per car.`);
    }
    if (acceptedFiles.length) {
      setFiles((current) => [...current, ...acceptedFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (indexToRemove) => {
    setFiles((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const moveFile = (indexToMove, direction) => {
    const nextIndex = indexToMove + direction;
    if (nextIndex < 0 || nextIndex >= files.length) return;
    setFiles((current) => {
      const nextFiles = [...current];
      const [movedFile] = nextFiles.splice(indexToMove, 1);
      nextFiles.splice(nextIndex, 0, movedFile);
      return nextFiles;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    files.forEach((file) => data.append("images", file));
    onSubmit(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={formMotion}
      initial="hidden"
      animate="show"
      className="rounded-lg border border-line bg-white p-5 shadow-sm"
      layout
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <motion.h2 layout className="text-xl font-black">{selectedCar ? "Edit car" : "Add new car"}</motion.h2>
        <AnimatePresence>
          {selectedCar && (
            <motion.button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              Cancel
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <motion.div variants={fieldMotion}><input className="field" required placeholder="Car title" value={form.title} onChange={(e) => update("title", e.target.value)} /></motion.div>
        <motion.div variants={fieldMotion}><input className="field" required placeholder="Brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} /></motion.div>
        <motion.div variants={fieldMotion}><input className="field" required type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => update("price", e.target.value)} /></motion.div>
        <motion.div variants={fieldMotion}><input className="field" required type="number" min="1980" placeholder="Year" value={form.year} onChange={(e) => update("year", e.target.value)} /></motion.div>
        <motion.div variants={fieldMotion}>
          <select className="field" value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)}>
            {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </motion.div>
        <motion.div variants={fieldMotion}>
          <select className="field" value={form.transmission} onChange={(e) => update("transmission", e.target.value)}>
            {["Manual", "Automatic", "CVT", "AMT", "DCT"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </motion.div>
        <motion.div variants={fieldMotion}>
          <select className="field" value={form.bodyType} onChange={(e) => update("bodyType", e.target.value)}>
            {["Sedan", "SUV", "Hatchback", "MPV", "Coupe", "Convertible", "Wagon"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </motion.div>
        <motion.div variants={fieldMotion}>
          <select className="field" value={form.ownership} onChange={(e) => update("ownership", e.target.value)}>
            {["1st owner", "2nd owner", "3rd owner", "4th owner+"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </motion.div>
        <motion.div variants={fieldMotion}><input className="field" required type="number" min="0" placeholder="KM driven" value={form.kmDriven} onChange={(e) => update("kmDriven", e.target.value)} /></motion.div>
        <motion.div variants={fieldMotion}><input className="field" required placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} /></motion.div>
        <motion.div variants={fieldMotion}><input className="field" type="number" min="1" max="10" placeholder="Seating capacity" value={form.seatCapacity} onChange={(e) => update("seatCapacity", e.target.value)} /></motion.div>
        <motion.div variants={fieldMotion}>
          <select className="field" value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </motion.div>
        <motion.div variants={fieldMotion} className="flex items-center gap-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-ink/70">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured listing
          </label>
        </motion.div>
        <motion.div variants={fieldMotion} className="md:col-span-2">
          <div className="rounded-xl border border-line bg-mist/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-ink">Car photos</p>
                <p className="mt-1 text-xs font-semibold text-ink/50">
                  {files.length}/{MAX_IMAGE_COUNT} selected · JPG, PNG, or WebP · Max {MAX_IMAGE_SIZE_MB}MB each
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {files.length > 0 && (
                  <button type="button" className="btn-secondary px-4 py-2" onClick={() => setFiles([])}>
                    <X size={16} /> Clear
                  </button>
                )}
                <label className={`btn-secondary cursor-pointer px-4 py-2 ${files.length >= MAX_IMAGE_COUNT ? "pointer-events-none opacity-50" : ""}`}>
                  <Upload size={16} /> Choose photos
                  <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={files.length >= MAX_IMAGE_COUNT}
                    onChange={(event) => chooseFiles(event.target.files)}
                  />
                </label>
              </div>
            </div>

            {selectedCar?.images?.length > 0 && (
              <div className="mt-4 rounded-xl border border-line bg-white p-3">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">Currently live</p>
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {selectedCar.images.slice(0, MAX_IMAGE_COUNT).map((image, index) => (
                    <div key={`${image.url}-${index}`} className="overflow-hidden rounded-lg border border-line bg-white">
                      <img src={image.url} alt="" className="aspect-[4/3] w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {photoPreviews.length > 0 ? (
                <motion.div
                  className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  {photoPreviews.map((photo, index) => (
                    <motion.div
                      key={`${photo.file.name}-${photo.file.lastModified}-${index}`}
                      className="group overflow-hidden rounded-xl border border-line bg-white shadow-sm"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      layout
                    >
                      <div className="relative">
                        <img src={photo.url} alt={photo.file.name} className="aspect-[4/3] w-full object-cover" />
                        {index === 0 && (
                          <span className="absolute left-2 top-2 rounded-md bg-teal px-2 py-1 text-[11px] font-black uppercase text-white">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded-md bg-white/95 p-2 text-coral shadow-sm transition hover:bg-coral hover:text-white"
                          onClick={() => removeFile(index)}
                          title="Remove photo"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-ink">{photo.file.name}</p>
                          <p className="mt-1 text-[11px] font-semibold text-ink/45">
                            {(photo.file.size / (1024 * 1024)).toFixed(1)}MB
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            className="rounded-md border border-line p-2 text-ink/65 transition hover:border-teal hover:text-teal disabled:opacity-30"
                            onClick={() => moveFile(index, -1)}
                            disabled={index === 0}
                            title="Move earlier"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-line p-2 text-ink/65 transition hover:border-teal hover:text-teal disabled:opacity-30"
                            onClick={() => moveFile(index, 1)}
                            disabled={index === files.length - 1}
                            title="Move later"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white p-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ImagePlus size={28} className="text-ink/35" />
                  <p className="mt-3 text-sm font-bold text-ink">No new photos selected</p>
                  <p className="mt-1 max-w-sm text-xs font-semibold leading-5 text-ink/45">
                    Add photos here and review every image before creating the car listing.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.div variants={fieldMotion} className="md:col-span-2">
          <textarea className="field" required rows="4" placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </motion.div>
      </div>
      <motion.button className="btn-primary motion-sheen mt-5" disabled={saving} type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
        <Save size={16} /> {saving ? "Saving..." : selectedCar ? "Update car" : "Create car"}
      </motion.button>
    </motion.form>
  );
}
