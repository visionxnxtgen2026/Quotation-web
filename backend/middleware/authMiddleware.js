import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Header (Bearer token) or Query (for downloads)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    // 2. Validate token existence
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided ❌",
      });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * 4. Fetch User
     * Using decoded.id or decoded._id to match your generateToken logic.
     * We exclude sensitive fields like password and OTP from req.user.
     */
    const user = await User.findById(decoded.id || decoded._id).select("-password -otp -otpExpires");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists ❌",
      });
    }

    // 5. Security Check: Ensure user is verified (OTP completed)
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first 🔐",
      });
    }

    // 6. Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    
    let message = "Not authorized, token failed ❌";
    if (error.name === "TokenExpiredError") {
      message = "Session expired, please login again ⏳";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token format ❌";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export default protect;
