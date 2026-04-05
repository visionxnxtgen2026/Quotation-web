import express from "express";
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  getDashboardStats,
} from "../controllers/quotationController.js";
import protect from "../middleware/authMiddleware.js";
import checkSubscription from "../middleware/checkSubscription.js"; // 👈 புதுசா ஆட் பண்ணியிருக்கோம்

const router = express.Router();

// ==============================
// 🔥 MIDDLEWARE: VALIDATE OBJECT ID
// ==============================
const validateObjectId = (req, res, next, id) => {
  const isValid = /^[0-9a-fA-F]{24}$/.test(id);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid quotation ID format ❌",
    });
  }
  next();
};

// Bind validation to "id" parameter
router.param("id", validateObjectId);

// ==============================
// 🌐 PUBLIC ROUTE (For Clients)
// ==============================
// 🚨 No 'protect' here! This allows clients to view the quote via link.
router.get("/public/:id", getQuotationById);

// ==============================
// 📊 DASHBOARD ROUTE (Protected)
// ==============================
router.get("/stats", protect, getDashboardStats);

// ==============================
// ➕ CREATE QUOTATION (Protected + 🚀 Subscription Check)
// ==============================
// ட்ரையல் முடிஞ்சிருந்தா புதுசா கொட்டேஷன் கிரியேட் பண்ண முடியாது
router.post("/", protect, checkSubscription, createQuotation); 

// ==============================
// 📄 GET ALL QUOTATIONS (Protected)
// ==============================
router.get("/", protect, getAllQuotations);

// ==============================
// 🔍 GET SINGLE QUOTATION (Protected - Internal Use)
// ==============================
router.get("/:id", protect, getQuotationById);

// ==============================
// ✏️ UPDATE QUOTATION (Protected + 🚀 Subscription Check)
// ==============================
// ட்ரையல் முடிஞ்சிருந்தா பழைய கொட்டேஷனை எடிட் பண்ண முடியாது
router.put("/:id", protect, checkSubscription, updateQuotation);

// ==============================
// ❌ DELETE QUOTATION (Protected)
// ==============================
router.delete("/:id", protect, deleteQuotation);

export default router;