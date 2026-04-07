import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// 🔥 SendGrid API Key Setup (No more SMTP port blocks!)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * 🚀 0. Verify Mail Connection (For server.js startup check)
 * SendGrid doesn't need persistent connection, just checking if API key exists.
 */
export const verifyMailConnection = async () => {
  if (process.env.SENDGRID_API_KEY) {
    console.log("✅ SendGrid Service: Ready (API Key Found)");
    return true;
  } else {
    console.error("❌ SendGrid Error: SENDGRID_API_KEY missing in .env");
    return false;
  }
};

/**
 * 📄 1. Send Quotation PDF
 */
export const sendQuotationPDFEmail = async (toEmail, clientName, pdfBuffer, companyName, quoteNo) => {
  const msg = {
    to: toEmail,
    from: process.env.EMAIL_USER, // 🔥 Must be the verified email in SendGrid
    replyTo: 'sanjaim0940r@gmail.com', // ✉️ Client reply pannuna indha mail-ku thaan varum
    subject: `Your Quotation (${quoteNo}) from ${companyName}`,
    html: `<h2>Hello ${clientName},</h2><p>Please find your quotation attached.</p>`,
    attachments: [
      {
        content: pdfBuffer.toString('base64'),
        filename: `Quotation_${quoteNo}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  };

  try {
    const info = await sgMail.send(msg);
    console.log("✅ PDF Email Sent via SendGrid!");
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ SendGrid PDF Error:", error.response ? error.response.body : error.message);
    throw error;
  }
};

/**
 * 🔐 2. Send OTP Email
 */
export const sendOTPEmail = async (toEmail, otp) => {
  const msg = {
    to: toEmail,
    from: process.env.EMAIL_USER, // 🔥 Must be the verified email in SendGrid
    subject: 'Your Login OTP - VisionX',
    html: `<div style="text-align:center;"><h2>Security Code</h2><h1 style="color: #2563eb; letter-spacing: 5px;">${otp}</h1></div>`,
  };

  try {
    const info = await sgMail.send(msg);
    console.log("✅ OTP Email Sent via SendGrid!");
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ SendGrid OTP Error:", error.response ? error.response.body : error.message);
    throw error;
  }
};

/**
 * 🔑 3. Send Password Reset Email
 */
export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const msg = {
    to: toEmail,
    from: process.env.EMAIL_USER, // 🔥 Must be the verified email in SendGrid
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
  };

  try {
    const info = await sgMail.send(msg);
    console.log("✅ Password Reset Email Sent via SendGrid!");
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ SendGrid Reset Error:", error.response ? error.response.body : error.message);
    throw error;
  }
};