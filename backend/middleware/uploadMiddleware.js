import multer from "multer";
import path from "path";
import fs from "fs";

// 📁 1. Ensure the upload directory exists
// Using './uploads' to match the static path in server.js
const uploadDir = "uploads/"; 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ 2. Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    // Generates: profilePic-1712345678.jpg
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// 🛡️ 3. File Filter (Security check for images only)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // Sends a clean error message to our Global Error Handler
    cb(new Error("Only images (JPG, JPEG, PNG, WEBP) are allowed!"), false);
  }
};

// 🚀 4. Initialize Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB Limit
  },
  fileFilter: fileFilter,
});

export default upload;
