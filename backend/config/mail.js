import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// ✅ 1. Validate API Key early
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is missing in environment variables");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("✅ SendGrid initialized");
}

// ✅ 2. Common sender configuration
const SENDER_EMAIL = process.env.EMAIL_USER; 
const REPLY_TO_EMAIL = "sanjaim0940r@gmail.com"; // ✉️ Unga personal mail-ah reply-to-va vacha Gmail nambum

/**
 * 🚀 Verify Mail Setup
 */
export const verifyMailConnection = async () => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ SendGrid not configured");
    return false;
  }
  return true;
};

/**
 * 📄 1. Send Quotation PDF
 */
export const sendQuotationPDFEmail = async (toEmail, clientName, pdfBuffer, companyName, quoteNo) => {
  const msg = {
    to: toEmail,
    from: {
      email: SENDER_EMAIL,
      name: companyName // 🔥 Company name-ah sender name-ah vaikkurom
    },
    replyTo: REPLY_TO_EMAIL, 
    subject: `Quotation ${quoteNo} - ${companyName}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #0f172a;">Hello ${clientName},</h2>
        <p>Please find your professional quotation attached below for your review.</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <br/>
        <p>Best Regards,<br/><strong>${companyName} Team</strong> 🚀</p>
      </div>
    `,
    attachments: [
      {
        content: pdfBuffer.toString("base64"),
        filename: `Quotation_${quoteNo}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Quotation Email Sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ SendGrid PDF Error:", error.response?.body || error.message);
    return { success: false, error };
  }
};

/**
 * 🔐 2. Send OTP Email
 */
export const sendOTPEmail = async (toEmail, otp) => {
  const msg = {
    to: toEmail,
    from: {
      email: SENDER_EMAIL,
      name: "VisionX Security" // 🔥 Professional identification
    },
    replyTo: REPLY_TO_EMAIL,
    subject: `Your Login Verification Code: ${otp}`,
    html: `
      <div style="text-align:center; font-family:sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color:#1e293b;">Security Verification</h2>
        <p style="color:#64748b;">Use the code below to securely log into your account.</p>
        <h1 style="color:#2563eb; letter-spacing:8px; background:#f1f5f9; display:inline-block; padding: 10px 25px; border-radius: 8px;">${otp}</h1>
        <p style="font-size:12px; color:#94a3b8; margin-top:20px;">This code will expire in 5 minutes.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ OTP Sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ OTP Error:", error.response?.body || error.message);
    return { success: false, error };
  }
};

/**
 * 🔑 3. Send Password Reset Email
 */
export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const msg = {
    to: toEmail,
    from: {
      email: SENDER_EMAIL,
      name: "VisionX Team"
    },
    replyTo: REPLY_TO_EMAIL,
    subject: "Reset Your Password - VisionX",
    html: `
      <div style="font-family:sans-serif; padding:30px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color:#2563eb;">Reset Password Request</h2>
        <p style="color:#475569;">We received a request to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
           <a href="${resetLink}" 
              style="padding:14px 28px; background:#2563eb; color:white; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
              Reset My Password
           </a>
        </div>
        <p style="margin-top:15px; font-size:12px; color:#94a3b8;">
          If you didn't request this, you can safely ignore this email. This link is valid for 1 hour.
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Reset Email Sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Reset Error:", error.response?.body || error.message);
    return { success: false, error };
  }
};