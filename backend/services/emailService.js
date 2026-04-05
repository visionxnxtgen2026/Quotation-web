import { sendMail } from "../config/mail.js";
import { generateQuotationPDF } from "./pdfService.js";
import { PassThrough } from "stream";

/**
 * Helper function to generate PDF as a memory buffer
 * 🔥 This directly uses your advanced pdfService.js so the design ALWAYS matches!
 * @param {Object} quotation - Quotation Document
 * @param {String} templateName - The chosen template design
 */
const createPDFBuffer = async (quotation, templateName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a PassThrough stream to catch the PDF output instead of sending it to browser
      const stream = new PassThrough();
      const buffers = [];
      
      stream.on("data", (chunk) => buffers.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(buffers)));
      stream.on("error", reject);

      // Create a mock Express 'res' object to satisfy generateQuotationPDF
      const mockRes = stream;
      mockRes.setHeader = () => {}; // Ignore headers meant for the browser
      mockRes.headersSent = false;
      mockRes.status = () => mockRes;
      mockRes.json = (errData) => reject(new Error(errData.message || "PDF Generation failed"));
      
      // Call your Advanced Enterprise PDF Generator WITH the template name
      await generateQuotationPDF(quotation, mockRes, templateName);
      
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 📧 Send Quotation Email with PDF Attachment
 * @param {string} toEmail - Client Email
 * @param {Object} quotation - Quotation Document
 * @param {String} templateName - The chosen template design
 */
export const sendQuotationEmail = async (toEmail, quotation, templateName = 'classic') => {
  try {
    const refNo = quotation.projectDetails?.referenceNo || "Draft";
    const companyName = quotation.projectDetails?.companyName || "Our Company";
    const clientName = quotation.projectDetails?.clientName || "Valued Client";
    const grandTotal = quotation.pricing?.grandTotal || 0;

    // 1. Generate PDF Buffer (Using the exact same UI as the download button!)
    // 🔥 Pass the template name to the buffer creator
    const pdfBuffer = await createPDFBuffer(quotation, templateName);

    // 2. Email HTML Template (Clean & Professional)
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Your Quotation is Ready</h2>
        </div>
        
        <div style="padding: 32px; background-color: #ffffff; color: #334155;">
          <p style="font-size: 16px; margin-top: 0;">Dear <strong>${clientName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for giving us the opportunity to quote for your project. Please find the detailed, professional quotation attached to this email.
          </p>

          <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Quotation Reference:</p>
            <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #0f172a;">#${refNo}</p>
            
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Total Value:</p>
            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #10b981;">Rs. ${Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            If you have any questions or require further clarification regarding this quote, please feel free to reply directly to this email.
          </p>
          
          <p style="font-size: 15px; margin-bottom: 0; margin-top: 32px;">Best regards,</p>
          <p style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #0f172a;">${companyName}</p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">This email was generated automatically. Please find the PDF attached.</p>
        </div>
      </div>
    `;

    // 3. Mail Options with Attachment
    const mailOptions = {
      from: `"${companyName}" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Quotation from ${companyName} (Ref: #${refNo})`,
      html: html,
      attachments: [
        {
          filename: `Quotation_${refNo.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    // 4. Send Email via configured transporter
    await sendMail(mailOptions);
    console.log(`✅ Email with Advanced PDF sent successfully to ${toEmail}`);

  } catch (error) {
    console.error("❌ Email Service Error:", error.message);
    throw new Error("Failed to send email with quotation attachment.");
  }
};