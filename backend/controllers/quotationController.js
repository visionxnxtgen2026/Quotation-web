import mongoose from "mongoose";
import Quotation from "../models/Quotation.js";
import { generateQuotationId } from "../utils/generateQuotationId.js";

// ==============================
// 🔥 HELPER: CALCULATE TOTALS (UPDATED FOR MULTI-SECTION & AREA)
// ==============================
const calculatePricing = (data) => {
  let grandSubtotal = 0;

  // 1. Calculate Multi-Category Rows & Working Area
  if (data.rateSections && data.rateSections.length > 0) {
    data.rateSections = data.rateSections.map((section) => {
      let sectionRatePerSqft = 0;

      // Calculate individual rows inside the section
      if (section.rows && section.rows.length > 0) {
        section.rows = section.rows.map((row) => {
          const labour = Number(row.labour || 0);
          const material = Number(row.material || 0);
          const total = labour + material;
          
          sectionRatePerSqft += total;

          return {
            ...row,
            labour,
            material,
            total,
          };
        });
      }

      // Multiply by Working Area (If no area given, default to 1)
      const area = Number(section.workingArea) > 0 ? Number(section.workingArea) : 1;
      const sectionTotalAmount = sectionRatePerSqft * area;

      grandSubtotal += sectionTotalAmount;

      return {
        ...section,
        sectionTotalAmount // Good to keep track in DB
      };
    });
  } 
  // Backward compatibility for older drafts
  else if (data.rateTable && data.rateTable.length > 0) {
    data.rateTable = data.rateTable.map((row) => {
      const labour = Number(row.labour || 0);
      const material = Number(row.material || 0);
      const total = labour + material;
      grandSubtotal += total;
      return { ...row, labour, material, total };
    });
  }

  // 2. Calculate Discount, Tax & Grand Total
  const discountPercent = Number(data.pricing?.discount || 0);
  const discountAmount = (grandSubtotal * discountPercent) / 100;
  const taxAmount = Number(data.pricing?.tax || 0);

  data.pricing = {
    ...data.pricing,
    subtotal: grandSubtotal,
    discountAmount: discountAmount,
    taxAmount: taxAmount,
    grandTotal: Math.max(grandSubtotal - discountAmount + taxAmount, 0),
  };

  return data;
};

// ==============================
// ➕ CREATE QUOTATION
// ==============================
export const createQuotation = async (req, res) => {
  try {
    let data = { ...req.body };

    // 🔥 AGGRESSIVE SANITIZATION
    delete data._id;
    delete data.id; 
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;

    // 🔥 SECURE: Link this quotation to the logged-in user!
    data.user = req.user._id || req.user.id;

    // Ensure projectDetails exists
    if (!data.projectDetails) data.projectDetails = {};

    // Generate Reference Number
    if (!data.projectDetails.referenceNo) {
      data.projectDetails.referenceNo = generateQuotationId();
    }

    // Calculate accurate totals before saving
    data = calculatePricing(data);

    // Default status
    data.status = data.status || "Draft";

    const quotation = await Quotation.create(data);

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully",
      data: quotation,
      _id: quotation._id 
    });

  } catch (error) {
    console.error("🔥 CREATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create quotation",
      error: error.message,
    });
  }
};

// ==============================
// 📄 GET ALL QUOTATIONS (Mapped for Dashboard Table)
// ==============================
export const getAllQuotations = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";
    
    const userId = req.user._id || req.user.id;

    // 🔥 SECURE: Only fetch documents matching the logged-in user
    let query = { user: userId };

    // Search Logic
    if (search) {
      query.$or = [
        { "projectDetails.clientName": { $regex: search, $options: "i" } },
        { "projectDetails.projectName": { $regex: search, $options: "i" } },
        { "projectDetails.referenceNo": { $regex: search, $options: "i" } },
        { "projectDetails.subject": { $regex: search, $options: "i" } } // Added subject search
      ];
    }

    const quotations = await Quotation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedQuotations = quotations.map((q) => ({
      _id: q._id, 
      id: q.projectDetails?.referenceNo || q._id.toString().substring(0, 8), 
      client: q.projectDetails?.clientName || "Unknown Client",
      project: q.projectDetails?.projectName || "Unnamed Project",
      date: q.projectDetails?.date 
        ? new Date(q.projectDetails.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : new Date(q.createdAt).toLocaleDateString('en-GB'),
      value: q.pricing?.grandTotal || 0,
      status: q.status || "Draft",
      raw: q 
    }));

    return res.status(200).json(formattedQuotations);

  } catch (error) {
    console.error("🔥 GET ALL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quotations",
      error: error.message,
    });
  }
};

// ==============================
// 🔍 GET SINGLE QUOTATION (For Preview/Edit)
// ==============================
export const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    // 🔥 SECURE: Ensure the quotation belongs to the user
    const quotation = await Quotation.findOne({ _id: id, user: userId });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or you don't have permission to view it.",
      });
    }

    return res.status(200).json(quotation);

  } catch (error) {
    console.error("🔥 GET ONE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching quotation",
      error: error.message,
    });
  }
};

// ==============================
// ✏️ UPDATE QUOTATION
// ==============================
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    let data = { ...req.body };

    // SANITIZE
    delete data._id;
    delete data.id;
    delete data.__v;
    delete data.user; // Prevent changing the owner

    data = calculatePricing(data);

    // 🔥 SECURE: findOneAndUpdate ensures we only update if it belongs to this user
    const updated = await Quotation.findOneAndUpdate(
      { _id: id, user: userId }, 
      { $set: data }, 
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation updated successfully",
      data: updated
    });

  } catch (error) {
    console.error("🔥 UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// ==============================
// ❌ DELETE QUOTATION
// ==============================
export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    // 🔥 SECURE: Only allow delete if the user owns it
    const deleted = await Quotation.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
    });

  } catch (error) {
    console.error("🔥 DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

// ==============================
// 📊 DASHBOARD STATS
// ==============================
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 🔥 SECURE: Count only this user's quotations
    const total = await Quotation.countDocuments({ user: userId });

    // 🔥 SECURE: Sum only this user's values
    const totalValueAgg = await Quotation.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, value: { $sum: "$pricing.grandTotal" } } },
    ]);

    const value = totalValueAgg[0]?.value || 0;

    // 🔥 SECURE: Get only this user's most recent quotation
    const lastQuotation = await Quotation.findOne({ user: userId }).sort({ createdAt: -1 });
    
    const lastCreated = lastQuotation
      ? new Date(lastQuotation.createdAt).toLocaleString('en-IN', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        })
      : "None";

    return res.status(200).json({
      total,
      value,
      lastCreated
    });

  } catch (error) {
    console.error("🔥 STATS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};