import mongoose from "mongoose";

/**
 * 🚀 Robust MongoDB Connection with Auto-Retry and DNS Handling
 */
const connectDB = async (retries = 5) => {
  try {
    // Suppress strictQuery warning for Mongoose 7+
    mongoose.set("strictQuery", false);

    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ ERROR: MONGO_URI is missing in .env file");
      process.exit(1);
    }

    console.log("⏳ Attempting to connect to MongoDB Atlas...");

    // Connection Configuration for stability and DNS bypass
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds wait before failing
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
      family: 4 // 🔥 FIX: Force IPv4. This bypasses many local DNS SRV record issues.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`❌ DB CONNECTION ERROR: ${error.message}`);

    // Troubleshooting Tip for DNS Error (ECONNREFUSED)
    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.warn("👉 TIP: This is likely a DNS issue. Try changing your Wi-Fi DNS to 8.8.8.8 (Google) or check your Network Firewall.");
    }

    if (retries > 0) {
      console.log(`🔄 Retrying connection in 5 seconds... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error("❌ Maximum retry attempts reached. Server shutting down.");
      process.exit(1);
    }
  }
};

// Listen for connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error(`📡 Mongoose Runtime Error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose connection lost. Trying to reconnect...");
});

export default connectDB;