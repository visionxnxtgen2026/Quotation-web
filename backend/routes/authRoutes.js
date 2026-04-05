import express from "express";
import {
  // 🔐 AUTH (Login/Register)
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp, 

  // 🔁 PASSWORD (Forgot Link / Reset Token)
  forgotPassword,
  resetPassword,

  // 🧑‍💻 PROFILE (CRUD)
  updateUserProfile,
  
  // 🚨 DELETE ACCOUNT (NEW 🔥)
  deleteUserAccount,
} from "../controllers/authController.js";

// Import Middlewares
import protect from "../middleware/authMiddleware.js"; 
import upload from "../middleware/uploadMiddleware.js"; 

const router = express.Router();

/**
 * ==============================
 * 🧪 SYSTEM ROUTES
 * ==============================
 */
router.get("/health", (req, res) => {
  res.json({ status: "Auth service running ✅" });
});

/**
 * ==============================
 * 🔐 AUTHENTICATION ROUTES
 * ==============================
 */

// 📝 Register + send OTP
router.post("/register", registerUser);

// 🔑 Verify OTP
router.post("/verify-otp", verifyOtp);

// 🔓 Login
router.post("/login", loginUser);

// 🔁 Resend OTP
router.post("/resend-otp", resendOtp);

/**
 * ==============================
 * 🔁 PASSWORD MANAGEMENT
 * ==============================
 */

// 📩 Send Reset Link to Email (forgot password)
router.post("/forgot-password", forgotPassword);

// 🔒 Reset password (🔥 UPDATED: Now requires :token in the URL)
router.post("/reset-password/:token", resetPassword);

/**
 * ==============================
 * 🧑‍💻 PROTECTED USER ROUTES
 * ==============================
 */

// 👤 Get Current User Profile Data
router.get("/profile", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ✏️ Update User Profile
router.put(
  "/user/update", 
  protect, 
  upload.single("profilePic"), 
  updateUserProfile
);

/**
 * ==============================
 * 🚨 DANGER ZONE
 * ==============================
 */

// ❌ Delete User Account and All Associated Data
router.delete("/user/delete", protect, deleteUserAccount);

/**
 * ==============================
 * 🔁 OPTIONAL / FUTURE
 * ==============================
 */
// router.post("/logout", logoutUser);

export default router;