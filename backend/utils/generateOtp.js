import crypto from "crypto";

// 🔐 Generate secure OTP
const generateOtp = () => {
  const otp = crypto.randomInt(100000, 1000000).toString(); // 6 digit
  return otp;
};

// ⏳ OTP expiry (5 minutes)
export const getOtpExpiry = () => {
  return Date.now() + 5 * 60 * 1000;
};

export default generateOtp;