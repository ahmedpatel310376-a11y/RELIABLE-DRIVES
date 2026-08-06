import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "src", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  const error = new Error("Only image uploads are allowed");
  error.statusCode = 415;
  cb(error);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8
  }
});
