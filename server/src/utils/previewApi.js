import cors from "cors";
import express from "express";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const now = new Date().toISOString();

let cars = [
  {
    _id: "660000000000000000000001",
    title: "2021 Hyundai Creta SX Diesel",
    brand: "Hyundai",
    price: 1249000,
    year: 2021,
    fuelType: "Diesel",
    transmission: "Manual",
    kmDriven: 34200,
    location: "Mumbai",
    description:
      "Single-owner SUV with full service history, clean interiors, new tyres, and a smooth highway-ready diesel engine.",
    status: "available",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=85"
      }
    ],
    createdAt: now
  },
  {
    _id: "660000000000000000000002",
    title: "2020 Honda City ZX CVT",
    brand: "Honda",
    price: 1085000,
    year: 2020,
    fuelType: "Petrol",
    transmission: "Automatic",
    kmDriven: 28500,
    location: "Delhi",
    description:
      "Premium sedan with CVT automatic, leatherette cabin, touchscreen infotainment, and verified ownership records.",
    status: "available",
    images: [
      {
        url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85"
      }
    ],
    createdAt: now
  },
  {
    _id: "660000000000000000000003",
    title: "2019 Maruti Suzuki Baleno Alpha",
    brand: "Maruti",
    price: 625000,
    year: 2019,
    fuelType: "Petrol",
    transmission: "Manual",
    kmDriven: 41800,
    location: "Bengaluru",
    description:
      "Efficient hatchback with low running cost, excellent city manners, reverse camera, and inspected mechanicals.",
    status: "sold",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85"
      }
    ],
    createdAt: now
  },
  {
    _id: "660000000000000000000004",
    title: "2022 Tata Nexon EV Prime",
    brand: "Tata",
    price: 1375000,
    year: 2022,
    fuelType: "Electric",
    transmission: "Automatic",
    kmDriven: 19600,
    location: "Pune",
    description:
      "Clean EV with battery warranty, quick acceleration, connected features, and verified charging history.",
    status: "available",
    images: [
      {
        url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=85"
      }
    ],
    createdAt: now
  }
];

const toNumber = (value) => (value === undefined ? value : Number(value));

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Reliable Drives Preview API" });
});

app.post("/api/auth/login", (req, res) => {
  res.json({
    token: "preview-token",
    admin: { id: "preview-admin", username: req.body?.username || "admin" }
  });
});

app.get("/api/cars", (req, res) => {
  const {
    brand,
    fuelType,
    location,
    city,
    status,
    minPrice,
    maxPrice,
    sort = "-createdAt",
    page = 1,
    limit = 9
  } = req.query;

  let result = [...cars];
  if (brand) result = result.filter((car) => car.brand.toLowerCase().includes(String(brand).toLowerCase()));
  if (fuelType) result = result.filter((car) => car.fuelType === fuelType);
  if (location || city) {
    result = result.filter((car) => car.location.toLowerCase().includes(String(location || city).toLowerCase()));
  }
  if (status) result = result.filter((car) => car.status === status);
  if (minPrice) result = result.filter((car) => car.price >= Number(minPrice));
  if (maxPrice) result = result.filter((car) => car.price <= Number(maxPrice));
  if (sort === "price") result.sort((a, b) => a.price - b.price);
  if (sort === "-price") result.sort((a, b) => b.price - a.price);
  if (sort === "kmDriven") result.sort((a, b) => a.kmDriven - b.kmDriven);

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const total = result.length;
  const paged = result.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  res.json({
    cars: paged,
    pagination: {
      page: pageNumber,
      pages: Math.ceil(total / pageSize) || 1,
      total
    }
  });
});

app.get("/api/cars/:id", (req, res) => {
  const car = cars.find((item) => item._id === req.params.id);
  if (!car) return res.status(404).json({ message: "Car not found" });
  res.json(car);
});

app.post("/api/cars", upload.array("images"), (req, res) => {
  const car = {
    _id: String(Date.now()),
    ...req.body,
    price: toNumber(req.body.price),
    year: toNumber(req.body.year),
    kmDriven: toNumber(req.body.kmDriven),
    images: [
      {
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85"
      }
    ],
    createdAt: now
  };
  cars.unshift(car);
  res.status(201).json(car);
});

app.put("/api/cars/:id", upload.array("images"), (req, res) => {
  const index = cars.findIndex((item) => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Car not found" });

  cars[index] = {
    ...cars[index],
    ...req.body,
    price: toNumber(req.body.price),
    year: toNumber(req.body.year),
    kmDriven: toNumber(req.body.kmDriven)
  };
  res.json(cars[index]);
});

app.delete("/api/cars/:id", (req, res) => {
  cars = cars.filter((item) => item._id !== req.params.id);
  res.json({ message: "Car deleted successfully" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Reliable Drives preview API running on http://localhost:${PORT}`);
});
