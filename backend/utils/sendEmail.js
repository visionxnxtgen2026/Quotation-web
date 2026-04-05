import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 🔐 Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ⚠️ App Password (no spaces)
  },
});

// 🧪 Verify transporter
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email server ready");
  } catch (error) {
    console.error("❌ Email server error:", error.message);
  }
};

verifyConnection();

// 📩 Send OTP Email
const sendEmail = async (to, otp) => {
  try {
    if (!to || !otp) {
      throw new Error("Missing email or OTP");
    }

    const mailOptions = {
      from: `"QuoteGen Pro 🚀" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "🔐 Your OTP Code - QuoteGen Pro",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#2563eb;">QuoteGen Pro</h2>
          <p>Your OTP for verification is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            margin: 20px 0;
            color: #111;
          ">
            ${otp}
          </div>

          <p>This OTP is valid for <b>5 minutes</b>.</p>

          <hr />
          <p style="font-size:12px;color:gray;">
            If you didn’t request this, ignore this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent successfully:", info.messageId);

    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

export default sendEmail;