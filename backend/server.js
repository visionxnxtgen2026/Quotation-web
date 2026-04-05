// ==============================
// 🔐 PRE-LOAD ENV (ES MODULE FIX)
// ==============================
import "dotenv/config"; 

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs"; 
import { fileURLToPath } from "url";

// ==============================
// ⚙️ CONFIG & ROUTES
// ==============================
import connectDB from "./config/db.js";
import { verifyMailConnection } from "./config/mail.js"; // 🔥 Advanced Mail Service Check

// ⚠️ Note: Ensure these filenames exactly match the files in your /routes folder!
import authRoutes from "./routes/authRoutes.js"; 
import quotationRoutes from "./routes/quotationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import userRoutes from "./routes/userRoutes.js";               
import subscriptionRoutes from "./routes/subscriptionRoutes.js"; 
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// ==============================
// 🚀 INIT APP & PATHS
// ==============================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Auto-create uploads folder so Multer/PDF generation doesn't crash
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created 'uploads' directory for assets.");
}

// ==============================
// 🔒 SECURITY & CORS
// ==============================
app.use(helmet({
  crossOriginResourcePolicy: false, // ✅ Critical: Allows frontend to display uploaded images & PDFs
}));

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allows Postman / Local requests (when origin is undefined) OR specific allowed domains
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS Blocked by VisionX Security ❌"), false);
  },
  credentials: true, // Allow cookies/tokens to be sent
}));

// ==============================
// 🧠 MIDDLEWARES 
// ==============================
// 🔥 Increased limit to 50mb for handling Base64 Company Logos securely
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 📂 SERVE STATIC FILES
// This makes http://localhost:5000/uploads/image.jpg accessible to the frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Logs HTTP requests in terminal
}

// ==============================
// 🚀 MAIN API ROUTES
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "VisionX API is running 🚀" });
});

// Mount modular routes
app.use("/api/auth", authRoutes);                 // Handles Login, OTP, and Reset Password Links
app.use("/api/quotations", quotationRoutes);      // Handles CRUD for quotations
app.use("/api/export", exportRoutes);             // Handles PDF Generation & Email Sharing
app.use("/api/users", userRoutes);                // Handles User Profile
app.use("/api/subscription", subscriptionRoutes); // Handles Pro Upgrades

// ==============================
// ❌ ERROR HANDLERS
// ==============================
app.use(notFound);       // Catches 404 routes
app.use(errorHandler);   // Catches unhandled errors and formats them

// ==============================
// 🚀 START SERVER & SERVICES
// ==============================
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Verify Advanced Mail Transporter (from config/mail.js)
    if (typeof verifyMailConnection === 'function') {
      await verifyMailConnection();
    }

    // 3. Start Express Server
    server = app.listen(PORT, () => {
      console.log(`
=============================================
🚀 VisionX Server : http://localhost:${PORT}
📦 Environment    : ${process.env.NODE_ENV || 'development'}
=============================================`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1); // Kill process if DB or Server fails
  }
};

startServer();

// ==============================
// 🛑 GRACEFUL SHUTDOWN
// ==============================
// Ensures ongoing requests (like PDF generation) finish before the server turns off
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down VisionX Server safely...`);
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));   // Handles Ctrl+C in terminal
process.on("SIGTERM", () => shutdown("SIGTERM")); // Handles termination from hosting providers (Render/AWS)