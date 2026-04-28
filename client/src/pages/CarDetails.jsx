import { useEffect, useState } from "react";
import { Calendar, Fuel, Gauge, Heart, MapPin, MessageCircle, Settings } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import http from "../api/http";
import Skeleton from "../components/Skeleton";
import { useWishlist } from "../context/WishlistContext";
import { fallbackImage, formatKm, formatPrice } from "../utils/format";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const wishlist = useWishlist();

  useEffect(() => {
    http
      .get(`/cars/${id}`)
      .then(({ data }) => setCar(data))
      .catch(() => toast.error("Car not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <section className="container-pad py-10"><Skeleton className="h-[520px]" /></section>;
  }

  if (!car) return null;

  const images = car.images?.length ? car.images : [{ url: fallbackImage }];
  const specs = [
    [Calendar, "Year", car.year],
    [Fuel, "Fuel", car.fuelType],
    [Settings, "Transmission", car.transmission],
    [Gauge, "Driven", formatKm(car.kmDriven)],
    [MapPin, "Location", car.location]
  ];

  return (
    <section className="container-pad py-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="relative overflow-hidden rounded-lg border border-line bg-white">
            <img src={images[active].url} alt={car.title} className="aspect-[16/11] w-full object-cover" />
            {car.status === "sold" && <span className="absolute left-4 top-4 rounded-md bg-coral px-3 py-1 text-sm font-black uppercase text-white">Sold</span>}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {images.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                onClick={() => setActive(index)}
                className={`overflow-hidden rounded-md border ${index === active ? "border-teal" : "border-line"}`}
              >
                <img src={image.url} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-teal">{car.brand}</p>
          <h1 className="mt-2 text-4xl font-black">{car.title}</h1>
          <p className="mt-3 text-3xl font-black text-coral">{formatPrice(car.price)}</p>
          <p className="mt-5 leading-7 text-ink/70">{car.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {specs.map(([Icon, label, value]) => (
              <div key={label} className="rounded-md border border-line p-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink/55"><Icon size={16} /> {label}</p>
                <p className="mt-1 font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn-primary" href={`https://wa.me/911234567890?text=I am interested in ${encodeURIComponent(car.title)}`} target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> Contact seller
            </a>
            <button className="btn-secondary" onClick={() => wishlist.toggle(car._id)}>
              <Heart size={17} fill={wishlist.has(car._id) ? "currentColor" : "none"} /> Wishlist
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
