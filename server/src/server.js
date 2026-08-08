import "dotenv/config";
import path from "path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const requiredEnvironment = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);

if (missingEnvironment.length) {
  console.error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
  process.exit(1);
}

if (
  process.env.NODE_ENV === "production"
  && (process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.toLowerCase().includes("replace"))
) {
  console.error("JWT_SECRET must contain at least 32 characters in production");
  process.exit(1);
}

const app = express();
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL.split(",").map((origin) => origin.trim()),
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Reliable Drives API",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚗 Reliable Drives API running on port ${PORT}`));

// Handle unhandled rejections gracefully
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err.message);
});
