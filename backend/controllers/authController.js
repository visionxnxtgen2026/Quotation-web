import crypto from "crypto"; 
import User from "../models/User.js";
import Quotation from "../models/Quotation.js";
import generateOtp, { getOtpExpiry } from "../utils/generateOtp.js";
import generateToken from "../utils/generateToken.js";
import { sendPasswordResetEmail, sendOTPEmail } from "../config/mail.js"; 

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
    const cutoffDate = new Date("2026-06-01T00:00:00Z"); 
    
    let trialDays = 10; 
    if (currentDate < cutoffDate) {
      trialDays = 90; 
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
        trialExpiresAt: trialExpiresAt, 
      });
    } else {
      user.otp = otp;
      user.otpExpires = expiry;
      user.password = password; 
      user.trialExpiresAt = trialExpiresAt; 
    }

    await user.save();
    
    // 🔥 DEBUG: OTP-ah Railway Logs-la kaatta idhai add panniruken!
    console.log(`\n======================================`);
    console.log(`🚀 🔥 GOD MODE OTP FOR ${email}: ${otp} 🔥 🚀`);
    console.log(`======================================\n`);

    // Mail anuppura function call
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP generated successfully!" });

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

    const cleanOtp = otp ? otp.toString().replace(/\s/g, "") : "";

    const user = await User.findOne({ email }).select("+otp +otpExpires");

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
    
    // 🔥 DEBUG: Resend pannaalum logs-la kaatta idhai add panniruken!
    console.log(`\n======================================`);
    console.log(`🚀 🔥 RESENT OTP FOR ${email}: ${otp} 🔥 🚀`);
    console.log(`======================================\n`);

    await sendOTPEmail(email, otp);

    res.json({ success: true, message: "New OTP generated successfully! 📩" });

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

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

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
  const { token } = req.params; 
  const { password } = req.body;

  try {
    const user = await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset link. ❌" });
    }

    user.password = password; 
    
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

    await Quotation.deleteMany({ user: userId });
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