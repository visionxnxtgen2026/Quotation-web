import twilio from "twilio";
import { generateQuotationPDF } from "./pdfService.js";

// Twilio Credentials (இதை .env ஃபைல்ல வெச்சுக்கோங்க)
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

const client = twilio(accountSid, authToken);

/**
 * Helper function to generate PDF Buffer using Puppeteer
 * 🔥 Much simpler now because Puppeteer sends the full buffer at once!
 */
const createPDFBuffer = async (quotation, templateName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Mock Express 'res' object to catch the Puppeteer PDF Buffer
      const mockRes = {
        headersSent: false,
        setHeader: () => {}, 
        contentType: () => {},
        status: function() { return this; },
        send: (buffer) => resolve(buffer), // Catch the buffer here
        end: (buffer) => resolve(buffer),  // Fallback
        json: (errData) => reject(new Error(errData.message || "PDF Generation failed"))
      };
      
      // 🔥 Call the Advanced Puppeteer PDF Generator WITH the template name
      await generateQuotationPDF(quotation, mockRes, templateName);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 📲 Send Quotation via WhatsApp Message
 * @param {string} toClientNumber - Client's WhatsApp Number (e.g., 'whatsapp:+919876543210')
 * @param {Object} quotation - Quotation Document
 * @param {String} templateName - The chosen template design
 */
export const sendQuotationWhatsApp = async (toClientNumber, quotation, templateName = 'classic') => {
  try {
    const refNo = quotation.projectDetails?.referenceNo || "Draft";
    const companyName = quotation.projectDetails?.companyName || "Our Company";
    
    // 💡 NOTE: Twilio requires a public URL for PDF attachments.
    // If you integrate AWS S3 / Cloudinary later, you can uncomment the below line,
    // upload the buffer, and send the returned public link as 'mediaUrl' in Twilio.
    // const pdfBuffer = await createPDFBuffer(quotation, templateName); 

    // For now, we share the direct Frontend Preview Link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const documentLink = `${frontendUrl}/preview/${quotation._id}`;

    const grandTotal = Number(quotation.pricing?.grandTotal || 0).toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });

    const messageBody = `Hello from *${companyName}*! 👋\n\nYour quotation (Ref: #${refNo}) is ready.\n\nGrand Total: *Rs. ${grandTotal}*\n\nYou can view and download your professional PDF document here:\n🔗 ${documentLink}\n\nLet us know if you have any questions!`;

    // Send Message via Twilio
    const message = await client.messages.create({
      body: messageBody,
      from: twilioWhatsAppNumber,
      to: toClientNumber // format must be 'whatsapp:+<country_code><number>'
    });

    console.log(`✅ WhatsApp message sent successfully. SID: ${message.sid}`);
    return { success: true, sid: message.sid };

  } catch (error) {
    console.error("❌ WhatsApp Service Error:", error.message);
    throw new Error("Failed to send WhatsApp message.");
  }
};