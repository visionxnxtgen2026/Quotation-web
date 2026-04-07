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

// 🔥 Auto-create ALL upload folders so Multer/PDF generation doesn't crash
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads", "profiles"), // Explicitly create profiles folder
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ==============================
// 🔒 SECURITY & CORS
// ==============================
app.use(helmet({
  crossOriginResourcePolicy: false, // ✅ Critical: Allows frontend to display uploaded images & PDFs
}));

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://quotation-web-wheat.vercel.app", // 🔥 EXPLICITLY ADDED YOUR VERCEL URL
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
// 🚀 START SERVER & SERVICES (Bulletproof Railway Fix)
// ==============================
const PORT = process.env.PORT || 8080; // Changed default to 8080
let server;

const startServer = () => { // Removed 'async' to avoid waiting
  try {
    // 1. Start Express Server FIRST 🚀 (Railway health check passes instantly)
    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`
=============================================
🚀 VisionX Server : http://0.0.0.0:${PORT}
📦 Status         : Online & Ready
=============================================`);

      // 2. Connect to MongoDB in the BACKGROUND
      // Ippo idhu late aanaalum Railway app-ah kill pannadhu
      connectDB().catch(err => console.error("❌ DB Background Error:", err));

      // 3. Verify Mail Connection in the BACKGROUND
      if (typeof verifyMailConnection === 'function') {
        verifyMailConnection();
      }
    });

  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1); 
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
process.on("SIGTERM", () => shutdown("SIGTERM")); // Handles termination from hosting providers (Render/Railway/AWS)