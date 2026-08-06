export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === "MulterError") {
    const uploadMessages = {
      LIMIT_FILE_SIZE: "Each photo must be 5MB or smaller",
      LIMIT_FILE_COUNT: "You can upload up to 8 photos per car",
      LIMIT_UNEXPECTED_FILE: "Only car photos can be uploaded in the images field"
    };
    const uploadStatus = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    return res.status(uploadStatus).json({
      message: uploadMessages[err.code] || "Photo upload failed",
    });
  }

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(422).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // Handle Mongoose cast errors (bad ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired, please login again" });
  }

  // Handle duplicate key errors (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `Duplicate value for ${field}` });
  }

  res.status(statusCode).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
