import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // 🔐 Hidden from queries by default
    },

    // --- OTP & VERIFICATION ---
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // 🔥 --- FORGOT PASSWORD RESET FIELDS (NEW) --- 🔥
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // --- PROFILE FIELDS (Matches your React Form) ---
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "... (Updated in form)",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    profilePic: {
      type: String,
      default: "", // Stores URL or file path
    },

    // 🚀 --- SUBSCRIPTION & TRIAL FIELDS --- 🚀
    plan: {
      type: String,
      enum: ["basic", "pro"], 
      default: "basic",       
    },
    isSubscribed: {
      type: Boolean,
      default: false,         // Default ah false இருக்கும். காசு கட்டுனா true ஆகும்.
    },
    trialExpiresAt: {
      type: Date,             // இதுலதான் அந்த 90 நாட்கள் / 10 நாட்கள் தேதியை சேவ் பண்ணுவோம்
      default: null, 
    },
    paymentId: {
      type: String,           // To store Razorpay/Stripe transaction ID later
      default: null,
    },
  },
  {
    timestamps: true, // Auto-creates createdAt and updatedAt
  }
);

/**
 * 🔒 MIDDLEWARE: Hash password before saving
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * 🛠️ METHOD: Compare entered password with hashed password
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * 🔍 TRANSFORM: Clean sensitive data when converting to JSON
 */
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.otp;
    delete ret.otpExpires;
    
    // 🔥 Remove reset token fields from API responses for security
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;