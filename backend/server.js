import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// CONFIG
import connectDB from "./config/db.js";
import { verifyMailConnection } from "./config/mail.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

// MIDDLEWARE
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// ==============================
// DATABASE CONNECTION
// ==============================
await connectDB();

try {
await verifyMailConnection();
console.log("✅ Mail Service Ready");
} catch (err) {
console.log("⚠️ Mail Service NOT configured");
}

// ==============================
// SECURITY
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
if (!origin) return callback(null, true);

```
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("CORS Blocked"), false);
},
credentials: true,
```

})
);

// ==============================
// BODY PARSER
// ==============================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "production") {
app.use(morgan("dev"));
}

// ==============================
// HEALTH CHECK
// ==============================
app.get("/health", (req, res) => {
res.status(200).send("OK");
});

app.get("/", (req, res) => {
res.json({
success: true,
message: "VisionX API running 🚀",
});
});

// ==============================
// API ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subscription", subscriptionRoutes);

// ==============================
// ERROR HANDLERS
// ==============================
app.use(notFound);
app.use(errorHandler);

// ==============================
// LOCAL DEVELOPMENT ONLY
// ==============================
if (process.env.NODE_ENV !== "production") {
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
}

// ==============================
// EXPORT FOR VERCEL
// ==============================
export default app;
