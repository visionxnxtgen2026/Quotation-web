import jwt from "jsonwebtoken";

// 🔐 Generate Access Token
export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d", // 🔥 reduce from 30d → more secure
    }
  );
};

// 🔁 (OPTIONAL) Refresh Token (advanced use)
export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export default generateToken;