// ==============================
// 🔐 PRE-LOAD ENV
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
import { verifyMailConnection } from "./config/mail.js";

import authRoutes from "./routes/authRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// ==============================
// 🚀 INIT APP
// ==============================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
// 📁 CREATE UPLOAD FOLDERS
// ==============================
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads", "profiles"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

// ==============================
// 🔒 SECURITY & CORS
// ==============================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://quotation-web-wheat.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // ✅ allow Postman / server calls

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS Blocked ❌"), false);
    },
    credentials: true,
  })
);

// ==============================
// 🧠 MIDDLEWARES
// ==============================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ==============================
// 🚀 ROUTES & HEALTH CHECK
// ==============================
app.get("/health", (req, res) => res.status(200).send("OK"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "VisionX API running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subscription", subscriptionRoutes);

// ==============================
// ❌ ERROR HANDLERS
// ==============================
app.use(notFound);
app.use(errorHandler);

// ==============================
// 🚀 START SERVER (FIXED)
// ==============================
const PORT = process.env.PORT || 8080;

let server;

const startServer = async () => {
  try {
    // ✅ START SERVER FIRST (Railway safe)
    server = app.listen(PORT, "0.0.0.0", async () => {
      console.log(`🚀 Server running on port ${PORT}`);

      // ✅ DB CONNECT (background)
      try {
        await connectDB();
        console.log("✅ Database connected");
      } catch (err) {
        console.error("❌ DB Error:", err.message);
      }

      // ✅ MAIL CHECK (fixed logic)
      try {
        if (typeof verifyMailConnection === "function") {
          const mailReady = await verifyMailConnection();

          if (mailReady) {
            console.log("✅ Mail Service Ready");
          } else {
            console.log("⚠️ Mail Service NOT configured");
          }
        }
      } catch (err) {
        console.log("⚠️ Mail check failed, but server still running");
      }
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();

// ==============================
// 🛑 SHUTDOWN HANDLER
// ==============================
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down...`);
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));