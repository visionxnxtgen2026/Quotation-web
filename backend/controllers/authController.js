import crypto from "crypto"; // 🔥 ADDED: For generating secure reset tokens
import User from "../models/User.js";
import Quotation from "../models/Quotation.js";
import generateOtp, { getOtpExpiry } from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js"; // For OTP emails
import { sendPasswordResetEmail } from "../config/mail.js"; // 🔥 ADDED: For Reset Link emails
import generateToken from "../utils/generateToken.js";

// ==============================
// 🔐 REGISTER + SEND OTP
// ==============================
export const registerUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  try {
    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const expiry = getOtpExpiry(5);

    // 🚀 --- TRIAL EXPIRY LOGIC (NEW) --- 🚀
    const currentDate = new Date();
    const cutoffDate = new Date("2026-06-01T00:00:00Z"); // ஜூன் 1, 2026-க்கு முன்னாடி
    
    let trialDays = 10; // Default ah 10 நாட்கள் (ஜூன் 1-க்கு பிறகு வருபவர்களுக்கு)
    if (currentDate < cutoffDate) {
      trialDays = 90; // மே 31 அல்லது அதற்கு முன் வருபவர்களுக்கு 90 நாட்கள்
    }

    const trialExpiresAt = new Date(currentDate);
    trialExpiresAt.setDate(trialExpiresAt.getDate() + trialDays);
    // -------------------------------------

    if (!user) {
      user = new User({
        name,
        mobile,
        email,
        password, 
        otp,
        otpExpires: expiry,
        trialExpiresAt: trialExpiresAt, // 👈 Save the calculated expiry date
      });
    } else {
      user.otp = otp;
      user.otpExpires = expiry;
      user.password = password; 
      user.trialExpiresAt = trialExpiresAt; // Update if they are re-registering before verification
    }

    await user.save();
    await sendEmail(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ==============================
// 🔑 VERIFY REGISTER OTP
// ==============================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 🔥 Safety Check: Remove any spaces if coming from frontend
    const cleanOtp = otp ? otp.toString().replace(/\s/g, "") : "";

    const user = await User.findOne({ email }).select("+otp +otpExpires");

    // 🔍 DEBUG: Check this in your VS Code Terminal
    console.log("--- OTP VERIFICATION ---");
    console.log("Email:", email);
    console.log("Received OTP (Clean):", `|${cleanOtp}|`);
    console.log("DB Stored OTP:", `|${user?.otp}|`);
    console.log("------------------------");

    if (!user || user.otp !== cleanOtp || user.otpExpires < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP ❌" 
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: user, 
      message: "Verification successful",
    });

  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({ message: "Verification failed" });
  }
};

// ==============================
// 🔁 RESEND OTP
// ==============================
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = getOtpExpiry(5);

    await user.save();
    await sendEmail(email, otp);

    res.json({ success: true, message: "New OTP sent successfully! 📩" });

  } catch (err) {
    console.error("Resend OTP Error:", err.message);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// ==============================
// 🔐 LOGIN
// ==============================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Verify account first" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials ❌" });
    }

    res.json({
      token: generateToken(user._id),
      user: user, 
      message: "Login successful",
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

// ==============================
// 📩 FORGOT PASSWORD (SEND RESET LINK)
// ==============================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email ❌" });
    }

    // 1. Generate Secure Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Save Token & Expiry (1 Hour) to DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    // 3. Create Reset Link (Frontend URL)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // 4. Send Email using the advanced template we created
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ success: true, message: "Reset link sent successfully to your email! ✅" });

  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send reset link" });
  }
};

// ==============================
// 🔑 RESET PASSWORD (UPDATE DB)
// ==============================
export const resetPassword = async (req, res) => {
  // Token now comes from the URL parameter, not the body
  const { token } = req.params; 
  const { password } = req.body;

  try {
    // Check if token matches and has not expired
    const user = await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // $gt means Greater Than current time
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset link. ❌" });
    }

    // Update password (Mongoose pre-save hook will hash it automatically)
    user.password = password; 
    
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.json({ success: true, message: "Password reset successful! 🎉" });

  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

// ==============================
// 🧑‍💻 UPDATE USER PROFILE
// ==============================
export const updateUserProfile = async (req, res) => {
  try {
    const { name, mobile, designation, location, bio } = req.body;
    const userId = req.user._id; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    user.designation = designation !== undefined ? designation : user.designation;
    user.location = location !== undefined ? location : user.location;
    user.bio = bio !== undefined ? bio : user.bio;

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      user.profilePic = `${baseUrl}/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================
// 🚨 DELETE USER ACCOUNT (DANGER)
// ==============================
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 1. Delete all quotations associated with this user
    await Quotation.deleteMany({ user: userId });

    // 2. Delete the user document itself
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Account Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during account deletion" });
  }
};