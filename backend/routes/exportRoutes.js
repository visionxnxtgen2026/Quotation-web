import express from "express";
import { downloadPDF, sendEmail } from "../controllers/exportController.js";
import protect from "../middleware/authMiddleware.js";
import Quotation from "../models/Quotation.js";
import { generateQuotationPDF } from "../services/pdfService.js";

const router = express.Router();

/**
 * =======================================
 * 📄 VIEW & DOWNLOAD QUOTATION PDF (Protected)
 * GET /api/export/pdf/:id
 * =======================================
 * Dashboard-ல் "Download as PDF" கிளிக் செய்யும்போது வேலை செய்யும்.
 * 'protect' இருப்பதால் லாகின் செய்தவர்கள் மட்டுமே இதை எடுக்க முடியும்.
 */
router.get("/pdf/:id", protect, downloadPDF);

/**
 * =======================================
 * 📧 SEND QUOTATION VIA EMAIL (Protected)
 * POST /api/export/email
 * =======================================
 * Dashboard-ல் இருந்து Client-க்கு Email அனுப்பும் Route.
 */
router.post("/email", protect, sendEmail);

/**
 * =======================================
 * 🌐 PUBLIC VIEW PDF (For Client Shared Links)
 * GET /api/export/pdf/public/:id
 * =======================================
 * Client-க்கு Share Link அனுப்பினால், அவர்கள் லாகின் இல்லாமல் PDF பார்க்க இது உதவும்.
 * இங்கு 'protect' தேவையில்லை, அதனால் தனியாக Security Crash இல்லாமல் எழுதியுள்ளோம்.
 */
router.get("/pdf/public/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { template } = req.query; 

    // Public Route என்பதால் 'req.user' செக் இல்லாமல் நேரடியாக ID-யை வைத்து எடுக்கிறோம்
    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({ 
        success: false, 
        message: "Quotation not found or link has expired ❌" 
      });
    }

    // 🔥 SYNCED SMART FILENAME LOGIC (Matches the Controller)
    const clientName = quotation.projectDetails?.clientName || "Document";
    const quoteNo = quotation.projectDetails?.referenceNo || "Shared";
    
    const safeClientName = clientName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
    const safeQuoteNo = quoteNo.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");

    const fileName = `Quotation_${safeQuoteNo}_${safeClientName}.pdf`;

    // 🔥 'inline' disposition: PDF ஆட்டோமேட்டிக்காக டவுன்லோட் ஆகாமல் பிரவுசரில் Preview ஆக ஓபன் ஆகும்.
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    // PDF-ஐ உருவாக்கி நேரடியாக ஸ்ட்ரீம் செய்கிறோம்
    await generateQuotationPDF(quotation, res, template || 'classic');

  } catch (error) {
    console.error("🔥 Public View PDF Error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate PDF for public view ❌" 
      });
    }
  }
});

export default router;