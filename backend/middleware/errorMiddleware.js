/**
 * ❌ Not Found Middleware (404)
 * Handles unknown routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * 🔥 Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  /* =========================
     🔍 MONGOOSE BAD OBJECT ID
  ========================== */
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found ❌";
  }

  /* =========================
     🔐 JWT ERRORS
  ========================== */
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token ❌";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired ❌";
  }

  /* =========================
     📦 DUPLICATE KEY ERROR
  ========================== */
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists ❌`;
  }

  /* =========================
     📄 VALIDATION ERROR
  ========================== */
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  /* =========================
     🧾 FINAL RESPONSE
  ========================== */
  res.status(statusCode).json({
    success: false,
    message,
    // Show stack only in development
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};