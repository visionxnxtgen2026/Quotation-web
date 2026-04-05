import crypto from "crypto";

// 🔐 Generate OTP (default 6 digits)
const generateOtp = (length = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  return crypto.randomInt(min, max).toString();
};

// ⏳ OTP expiry (in ms)
export const getOtpExpiry = (minutes = 5) => {
  return Date.now() + minutes * 60 * 1000;
};

export default generateOtp;