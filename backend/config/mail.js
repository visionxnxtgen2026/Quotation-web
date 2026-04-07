import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 🚀 Create Nodemailer Transporter using Gmail SMTP (Fixed for Railway IPv6 issues)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER, // Unga Gmail ID
    pass: process.env.EMAIL_PASS, // Unga 16-digit App Password
  },
  tls: {
    rejectUnauthorized: false // 🔥 Railway network strict blocks-ah thavirkka idhu thevai
  }
});

/**
 * 🚀 0. Verify Mail Connection (For server.js startup check)
 */
export const verifyMailConnection = async () => {
  try {
    // Transporter-ah connect panna 10 seconds timeout veippom. Appo thaan app nirkkaama run aagum.
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Mail Timeout")), 10000))
    ]);
    console.log("✅ Mail Server: Connected and Ready (Nodemailer Active)");
    return true;
  } catch (error) {
    console.error("❌ Mail Server Verification Error:", error.message);
    console.warn("⚠️ Hint: Check your EMAIL_USER and EMAIL_PASS in .env");
    return false; // Error vandhaalum false return pannum, server crash aagadhu
  }
};

/**
 * 📄 1. Send Quotation PDF
 */
export const sendQuotationPDFEmail = async (toEmail, clientName, pdfBuffer, companyName, quoteNo) => {
  try {
    const info = await transporter.sendMail({
      from: `"VisionX" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Your Quotation (${quoteNo}) from ${companyName}`,
      html: `<h2>Hello ${clientName},</h2><p>Please find your quotation attached.</p>`,
      attachments: [{ filename: `Quotation_${quoteNo}.pdf`, content: pdfBuffer }],
    });
    console.log("✅ PDF Email Sent!");
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ PDF Email Error:", error);
    throw error;
  }
};

/**
 * 🔐 2. Send OTP Email
 */
export const sendOTPEmail = async (toEmail, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"VisionX Auth" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your Login OTP - VisionX',
      html: `<div style="text-align:center;"><h2>Security Code</h2><h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1></div>`,
    });
    console.log("✅ OTP Email Sent!");
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ OTP Error:", error);
    throw error;
  }
};

/**
 * 🔑 3. Send Password Reset Email
 */
export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: `"VisionX Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Reset Your VisionX Password',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log("✅ Password Reset Email Sent!");
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Reset Email Error:", error);
    throw error;
  }
};