import multer from "multer";

// ✅ Vercel compatible
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
const allowedFileTypes = /jpeg|jpg|png|webp/;

const extname = allowedFileTypes.test(
file.originalname.split(".").pop().toLowerCase()
);

const mimetype =
file.mimetype === "image/jpeg" ||
file.mimetype === "image/jpg" ||
file.mimetype === "image/png" ||
file.mimetype === "image/webp";

if (mimetype && extname) {
return cb(null, true);
}

cb(new Error("Only images (JPG, JPEG, PNG, WEBP) are allowed!"), false);
};

const upload = multer({
storage,
limits: {
fileSize: 2 * 1024 * 1024,
},
fileFilter,
});

export default upload;
