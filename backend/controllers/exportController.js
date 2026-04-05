import Quotation from "../models/Quotation.js";
import { generateQuotationPDF } from "../services/pdfService.js";
import { sendQuotationPDFEmail } from "../config/mail.js"; // 🔥 Uses Resend logic
import { Writable } from "stream";

/**
 * Valid template slugs (Matches Frontend TemplateSelector.jsx)
 */
const VALID_TEMPLATES = new Set([
  "classic", "modern", "corporate", "compact", "creative", "grouped",
  "obsidian", "sovereign", "aurora",
]);

// Helper to fallback to classic if an invalid template is passed
const resolveTemplate = (raw) =>
  raw && VALID_TEMPLATES.has(raw.toLowerCase()) ? raw.toLowerCase() : "classic";

/**
 * =======================================
 * 📄 VIEW & DOWNLOAD PDF (Frontend Stream)
 * GET /api/export/pdf/:id?template=obsidian
 * =======================================
 */
export const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const template = resolveTemplate(req.query.template);
    const userId = req.user._id || req.user.id;

    // 1. Fetch quotation (Strictly scoped to the authenticated user for security)
    const quotation = await Quotation.findOne({ _id: id, user: userId });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or you don't have permission to view it ❌",
      });
    }

    // 2. Build a Professional Filename (e.g., Quotation_QTN-101_ClientName.pdf)
    const clientName = quotation.projectDetails?.clientName || "Document";
    const quoteNo = quotation.projectDetails?.referenceNo || "Draft";
    
    const safeClientName = clientName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");
    const safeQuoteNo = quoteNo.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-]/g, "");

    const fileName = `Quotation_${safeQuoteNo}_${safeClientName}.pdf`;

    // 3. Set proper HTTP headers for PDF streaming
    // 🔥 FIX: Prevent Express from treating it as an API JSON response
    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`); // Safe binary download
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    // 4. Stream PDF directly to the browser (Zero memory bloat)
    await generateQuotationPDF(quotation, res, template);
    
  } catch (error) {
    console.error("🔥 Download PDF Error:", error.message);
    
    // Prevent "Headers already sent" crash
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF ❌",
        error: error.message,
      });
    }
  }
};

/**
 * =======================================
 * 📧 SEND QUOTATION VIA EMAIL
 * POST /api/export/email
 * Body: { quotationId, email, template }
 * =======================================
 */
export const sendEmail = async (req, res) => {
  try {
    const { quotationId, email, template: rawTemplate } = req.body;
    const template = resolveTemplate(rawTemplate);
    const userId = req.user._id || req.user.id;

    // 1. Validate inputs
    if (!quotationId || !email) {
      return res.status(400).json({
        success: false,
        message: "Both Quotation ID and Email address are required ❌",
      });
    }

    // 2. Fetch quotation securely
    const quotation = await Quotation.findOne({ _id: quotationId, user: userId });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or unauthorized ❌",
      });
    }

    // 3. Generate PDF into a memory buffer (Required for Resend email attachments)
    const chunks = [];
    const bufferStream = new Writable({
      write(chunk, encoding, next) {
        chunks.push(chunk);
        next();
      },
    });

    // Wait for the PDF kit to finish writing to the buffer stream
    await new Promise((resolve, reject) => {
      bufferStream.on("finish", resolve);
      bufferStream.on("error", reject);
      generateQuotationPDF(quotation, bufferStream, template).catch(reject);
    });

    const pdfBuffer = Buffer.concat(chunks); // 🔥 Clean Binary PDF Data for attachment

    // 4. Extract contextual data for the email body
    const clientName  = quotation.projectDetails?.clientName  || "Valued Client";
    const companyName = quotation.projectDetails?.companyName || "Our Company";
    const quoteNo     = quotation.projectDetails?.referenceNo || "Draft";

    // 5. Send via the mail service (Resend)
    // ⚠️ NOTE: Since you are on Resend Free Tier, the 'email' input MUST be your registered email.
    await sendQuotationPDFEmail(email, clientName, pdfBuffer, companyName, quoteNo);

    // 6. Success response
    return res.status(200).json({
      success: true,
      message: `✅ Quotation successfully sent to ${email}`,
    });
    
  } catch (error) {
    console.error("🔥 Send Email Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please check server configuration.",
      error: error.message,
    });
  }
};