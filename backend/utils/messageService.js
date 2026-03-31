import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// -- Nodemailer Setup --
// Using explicit host and port for better reliability with Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add connection timeout for better error handling
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 30000,
});

// Verify the connection configuration on startup (optional but helpful for debug)
transporter.verify((error, success) => {
  if (error) {
    console.warn("[📩 Email Service]: Transport configuration issue:", error.message);
  } else {
    console.log("[📩 Email Service]: Server is ready to take our messages");
  }
});

/**
 * Sends a professional HTML email via Gmail Service
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text version of the message
 * @returns {Promise<boolean>}
 */
export const sendEmail = async (to, subject, text) => {
  try {
    // If no credentials are found, we log it to console as a 'mock' mode
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`\n[📩 Email Mock - No Credentials]\nTo: ${to}\nSubject: ${subject}\nText: ${text}\n`);
      return true;
    }

    const mailOptions = {
      from: `"FreshNest Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background-color: #f0fdf4; color: #1e293b; border-radius: 16px; max-width: 600px; margin: 20px auto; border: 1px solid #dcfce7; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 12px; background-color: #ffffff; border-radius: 50%; margin-bottom: 16px;">
              <span style="font-size: 32px;">🌱</span>
            </div>
            <h1 style="color: #166534; font-weight: 800; letter-spacing: -0.025em; margin: 0; font-size: 28px;">FreshNest</h1>
            <p style="color: #15803d; font-size: 14px; margin-top: 4px; font-weight: 600;">Premium Grocery Experience</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #f0fdf4;">
            <p style="white-space: pre-line; line-height: 1.6; font-size: 16px; color: #334155; margin: 0;">${text}</p>
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #dcfce7; text-align: center;">
            <p style="font-weight: 700; color: #16a34a; margin-bottom: 4px; font-size: 14px;">The FreshNest Team</p>
            <p style="font-size: 12px; color: #64748b;">This is an automated notification. Please do not reply directly to this email unless specified.</p>
            <div style="margin-top: 16px; font-size: 11px; color: #94a3b8;">
              © ${new Date().getFullYear()} FreshNest Mart. All rights reserved.
            </div>
          </div>
        </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[📩 Email Sent Success]: To: ${to} | ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[📩 Email Service ERROR]:`, error);
    // Log more specific error info if available
    if (error.code === 'EAUTH') {
      console.error("Authentication failed. Please verify EMAIL_USER and EMAIL_PASS (App Password).");
    }
    return false;
  }
};

/**
 * Twilio SMS Service for order and notification messages
 */

import twilio from "twilio";

// Twilio SMS Setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Sends SMS via Twilio
 * @param {string} to - Recipient phone number (with country code, e.g., +919876543210)
 * @param {string} message - SMS message text
 * @returns {Promise<boolean>}
 */
export const sendSMS = async (to, message) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log(`[📱 SMS Mock - No Credentials]\nTo: ${to}\nMessage: ${message}\n`);
      return true;
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log(`[📱 SMS Sent Success]: To: ${to} | SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error(`[📱 SMS Service ERROR]:`, error.message);
    return false;
  }
};

