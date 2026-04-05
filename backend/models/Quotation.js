import mongoose from "mongoose";

// ==============================
// 🔹 RATE ITEM SCHEMA (Single Row)
// ==============================
const rateItemSchema = new mongoose.Schema(
  {
    work: {
      type: String,
      trim: true,
      default: "", 
    },
    labour: {
      type: Number,
      default: 0,
      min: 0,
      // 🔥 FIX: Intercepts negative values and forces them to 0 before saving
      set: (val) => Math.max(0, val || 0), 
    },
    material: {
      type: Number,
      default: 0,
      min: 0,
      // 🔥 FIX: Intercepts negative values
      set: (val) => Math.max(0, val || 0),
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
      set: (val) => Math.max(0, val || 0),
    },
  },
  { _id: false }
);

// ==============================
// 🔥 NEW: RATE SECTION SCHEMA (Category Box)
// ==============================
const rateSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "Material & Labour Rates",
    },
    workingArea: { // 🔥 NEW: Added Working Area support
      type: String,
      trim: true,
      default: "",
    },
    rows: {
      type: [rateItemSchema],
      default: [],
    }
  },
  { _id: true } // keeping id to help with React mapping if needed
);

// ==============================
// 🔹 MAIN SCHEMA
// ==============================
const quotationSchema = new mongoose.Schema(
  {
    // 🔥 LINK QUOTATION TO THE LOGGED-IN USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🏢 PROJECT DETAILS
    projectDetails: {
      companyLogo: { type: String, default: "" },
      companyName: { type: String, trim: true, default: "" },
      clientName: { type: String, required: true, trim: true },
      projectName: { type: String, trim: true, default: "" },
      referenceNo: { type: String, trim: true, default: null },
      subject: { type: String, trim: true, default: "" }, // 🔥 NEW: Subject Field
      date: { type: Date, default: Date.now },
      paintBrand: { // 🔥 UPDATED: Removed enum to allow custom brands
        type: String,
        trim: true,
        default: "",
      },
    },

    // 📐 AREA DETAILS
    areaDetails: {
      interiorArea: { type: String, default: "" },
      exteriorArea: { type: String, default: "" },
    },

    // 📝 COVER LETTER
    coverLetter: {
      subject: { type: String, trim: true, default: "" },
      body: { type: String, trim: true, default: "" },
    },

    // 🔥 NEW: MULTIPLE RATE SECTIONS (Replaces single rateTable)
    rateSections: {
      type: [rateSectionSchema],
      default: [],
    },

    // 🔄 LEGACY SUPPORT: Keeping this just in case old data exists
    rateTable: {
      type: [rateItemSchema],
      default: [],
    },

    // 💰 PRICING
    pricing: {
      subtotal: { 
        type: Number, 
        default: 0, 
        min: 0,
        set: (val) => Math.max(0, val || 0)
      },
      discount: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 100,
        set: (val) => Math.max(0, Math.min(100, val || 0)) // Keeps it between 0 and 100
      }, 
      tax: { 
        type: Number, 
        default: 0, 
        min: 0,
        set: (val) => Math.max(0, val || 0)
      }, 
      grandTotal: { 
        type: Number, 
        default: 0, 
        min: 0,
        set: (val) => Math.max(0, val || 0)
      },
      warranty: { type: String, default: "" }, 
    },

    // 📅 TIMELINE
    timeline: {
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
    },

    // 📄 TEXT AREAS
    textAreas: {
      scopeOfWork: { type: String, default: "" },
      exclusions: { type: String, default: "" },
      termsConditions: { type: String, default: "" },
    },

    // 💳 PAYMENT TERMS
    paymentTerms: {
      step1: { type: String, default: "" },
      step2: { type: String, default: "" },
      step3: { type: String, default: "" },
    },

    // 🔢 PAYMENT PERCENTS
    paymentPercents: {
      p1: { type: String, default: "" },
      p2: { type: String, default: "" },
      p3: { type: String, default: "" },
    },

    // ⏳ VALIDITY
    validity: {
      type: String,
      default: "30 Days from the date of issue",
    },

    // 🏦 BANK DETAILS
    bankDetails: {
      bankName: { type: String, default: "" },
      accountHolder: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      branch: { type: String, default: "" },
    },

    // ✍️ SIGNATURE
    signature: {
      name: { type: String, default: "" },
      designation: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },

    // 🔥 STATUS
    status: {
      type: String,
      enum: ["Draft", "Saved", "Sent", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// 🔥 AUTO CALCULATIONS (Safety Net)
// ==============================
const calculateTotals = (doc) => {
  let subtotal = 0;

  // 🔥 1. Calculate totals for NEW Multiple Sections Format (WITH AREA MATH)
  if (doc.rateSections && doc.rateSections.length > 0) {
    doc.rateSections.forEach((section) => {
      let sectionRateTotal = 0;

      section.rows.forEach((item) => {
        // Safe number parsing
        const labour = Math.max(0, Number(item.labour || 0));
        const material = Math.max(0, Number(item.material || 0));
        const total = labour + material;

        sectionRateTotal += total;

        item.labour = labour;
        item.material = material;
        item.total = total;
      });

      // Area Math
      const area = Number(section.workingArea) > 0 ? Number(section.workingArea) : 1;
      subtotal += (sectionRateTotal * area);
    });
  } 
  // 🔄 2. Fallback Calculation for OLD Single Table Format
  else if (doc.rateTable && doc.rateTable.length > 0) {
    doc.rateTable.forEach((item) => {
      const labour = Math.max(0, Number(item.labour || 0));
      const material = Math.max(0, Number(item.material || 0));
      const total = labour + material;

      subtotal += total;

      item.labour = labour;
      item.material = material;
      item.total = total;
    });
  }

  const discountPercent = Math.max(0, Number(doc.pricing?.discount || 0));
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxAmount = Math.max(0, Number(doc.pricing?.tax || 0));

  if (!doc.pricing) doc.pricing = {};
  doc.pricing.subtotal = subtotal;
  doc.pricing.grandTotal = Math.max(subtotal - discountAmount + taxAmount, 0);
};

// ==============================
// 🔹 BEFORE SAVE
// ==============================
quotationSchema.pre("save", function (next) {
  calculateTotals(this);
  next();
});

// ==============================
// 🔍 INDEXES
// ==============================

// Fast query index
quotationSchema.index({ user: 1 });

// Text search
quotationSchema.index({
  "projectDetails.clientName": "text",
  "projectDetails.projectName": "text",
});

// Fast sorting
quotationSchema.index({ createdAt: -1 });

// Prevent duplicate ref issue
quotationSchema.index(
  { "projectDetails.referenceNo": 1 },
  { sparse: true }
);

// ==============================
// 🚀 EXPORT
// ==============================
const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;