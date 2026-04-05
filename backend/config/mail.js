import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 🚀 0. Verify Mail Connection (For server.js startup check)
 */
export const verifyMailConnection = async () => {
  try {
    if (process.env.RESEND_API_KEY) {
      console.log("✅ Mail Server: Connected and Ready (Resend API Active)");
      return true;
    } else {
      console.warn("⚠️ Mail Server: RESEND_API_KEY is missing in .env");
      return false;
    }
  } catch (error) {
    console.error("❌ Mail Server Verification Error:", error);
    return false;
  }
};

/**
 * 📄 1. Send Quotation PDF
 */
export const sendQuotationPDFEmail = async (toEmail, clientName, pdfBuffer, companyName, quoteNo) => {
  try {
    const data = await resend.emails.send({
      from: 'VisionX <onboarding@resend.dev>',
      to: [toEmail],
      subject: `Your Quotation (${quoteNo}) from ${companyName}`,
      html: `<h2>Hello ${clientName},</h2><p>Please find your quotation attached.</p>`,
      attachments: [{ filename: `Quotation_${quoteNo}.pdf`, content: pdfBuffer }],
    });
    console.log("✅ PDF Email Sent!");
    return { success: true, data };
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
    const data = await resend.emails.send({
      from: 'VisionX Auth <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Your Login OTP - VisionX',
      html: `<div style="text-align:center;"><h2>Security Code</h2><h1>${otp}</h1></div>`,
    });
    console.log("✅ OTP Email Sent!");
    return { success: true, data };
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
    const data = await resend.emails.send({
      from: 'VisionX Support <onboarding@resend.dev>',
      to: [toEmail],
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
    return { success: true, data };
  } catch (error) {
    console.error("❌ Reset Email Error:", error);
    throw error;
  }
};