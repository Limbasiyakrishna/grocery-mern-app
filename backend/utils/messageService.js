import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// =============================================================================
// EMAIL SERVICE - Nodemailer with Gmail / Ethereal fallback
// =============================================================================

let transporter = null;
let isEthereal = false;
let latestEmailStatus = "uninitialized";

export const getEmailTransportStatus = () => ({
  mode: latestEmailStatus,
  isEthereal,
  provider: isEthereal ? "ethereal" : "gmail",
  emailUser: process.env.EMAIL_USER || "NOT_SET",
  emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/[\s\r\n\t]/g, "").length : 0,
});

export const initializeTransporter = async () => {
  // Only reuse a confirmed-working Gmail transporter
  if (transporter && !isEthereal && latestEmailStatus === "gmail_ready") {
    return transporter;
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Aggressively strip all whitespace, quotes, and invisible chars
    const emailUser = process.env.EMAIL_USER.trim().replace(/["']/g, "");
    const emailPass = process.env.EMAIL_PASS.replace(/[\s\r\n\t"']/g, "");

    if (process.env.EMAIL_PASS.trim() !== emailPass) {
      console.warn(`[📩 Email]: EMAIL_PASS sanitized. Length after cleaning: ${emailPass.length}`);
    }
    if (emailPass.length !== 16) {
      console.warn(`[📩 Email]: ⚠️  Gmail App Password should be exactly 16 chars. Got: ${emailPass.length}`);
      console.warn(`[📩 Email]: ⚠️  Generate one at: https://myaccount.google.com/apppasswords`);
    }

    console.log(`[📩 Email]: Connecting to Gmail as: ${emailUser} (App Password length: ${emailPass.length})`);

    // Use service:"gmail" — more reliable than manual host/port for App Passwords
    const gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
    });

    try {
      await gmailTransporter.verify();
      transporter = gmailTransporter;
      isEthereal = false;
      latestEmailStatus = "gmail_ready";
      console.log("[📩 Email]: ✅ Gmail VERIFIED — real emails will be delivered to inboxes!");
      return transporter;
    } catch (err) {
      transporter = null;
      isEthereal = false;
      latestEmailStatus = "gmail_failed_auth";
      console.error(`[📩 Email]: ❌ Gmail auth FAILED: ${err.message} (code: ${err.code})`);
      console.warn("[📩 Email]: ── FIX STEPS ──────────────────────────────────────────────");
      console.warn("[📩 Email]: 1. Visit https://myaccount.google.com/security");
      console.warn("[📩 Email]: 2. Enable 2-Step Verification (required for App Passwords)");
      console.warn("[📩 Email]: 3. Visit https://myaccount.google.com/apppasswords");
      console.warn("[📩 Email]: 4. Create password → App: Mail, Device: Other → copy 16 chars");
      console.warn(`[📩 Email]: 5. Paste into .env as: EMAIL_PASS=xxxxxxxxxxxx (NO spaces/quotes)")`);
      console.warn(`[📩 Email]: Current EMAIL_USER: ${emailUser}`);
      console.warn(`[📩 Email]: Current EMAIL_PASS length: ${emailPass.length} (need exactly 16)`);
      console.warn("[📩 Email]: ⚠️  Falling back to Ethereal — OTPs appear in console only.");
    }
  } else {
    console.warn("[📩 Email]: EMAIL_USER / EMAIL_PASS not set — using Ethereal test fallback.");
  }

  // Ethereal fallback
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    isEthereal = true;
    latestEmailStatus = "ethereal_ready";
    console.log(`[📩 Email]: ⚠️  Ethereal fallback active. Preview URL will be generated.`);
    return transporter;
  } catch (err) {
    console.error("[📩 Email]: ❌ Could not create any transporter:", err.message);
    latestEmailStatus = "failed";
    return null;
  }
};

// =============================================================================
// CORE sendEmail — must be defined BEFORE functions that call it
// =============================================================================

/**
 * Core send function. All email helpers call this.
 */
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transport = await initializeTransporter();

    if (!transport) {
      console.error("[📩 Email]: No transporter available. Email not sent.");
      return false;
    }

    // Use sanitized email user if available
    const sanitizedUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim().replace(/["']/g, "") : null;
    const fromAddress = sanitizedUser
      ? `"FreshNest" <${sanitizedUser}>`
      : '"FreshNest" <no-reply@freshnest.test>';

    const mailOptions = {
      from: fromAddress,
      to,
      subject,
      text,
      html: html || generateEmailTemplate({
        mainContent: `<p style="white-space:pre-line;line-height:1.6;font-size:16px;color:#334155;margin:0">${text}</p>`,
      }),
    };

    const info = await transport.sendMail(mailOptions);

    if (isEthereal) {
      latestEmailStatus = "ethereal_sent";
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[📩 Ethereal]: Sent to ${to} | Preview: ${previewUrl}`);
    } else {
      latestEmailStatus = "gmail_sent";
      console.log(`[📩 Gmail]: ✅ SUCCESS! Real email delivered to ${to} | ID: ${info.messageId}`);
    }
    return true;
  } catch (err) {
    console.error("[📩 Email ERROR]:", err.message);
    if (err.code === "EAUTH") {
      transporter = null;
      latestEmailStatus = "gmail_failed_auth";
      console.error("[📩 Email]: Auth failed — check your Gmail App Password (must be 16 chars).");
    }
    return false;
  }
};

/**
 * Test email function for debugging
 */
export const testEmail = async (recipientEmail) => {
  console.log(`[📩 Email]: Sending test email to ${recipientEmail}...`);
  return await sendEmail(
    recipientEmail,
    "FreshNest Test Email",
    "This is a test email from the FreshNest backend service."
  );
};

// =============================================================================
// EMAIL TEMPLATE GENERATOR
// =============================================================================

const generateEmailTemplate = (content) => {
  const {
    title = "FreshNest",
    subtitle = "Premium Grocery Experience",
    greeting = "Hello!",
    mainContent = "",
    footerText = "Thank you for choosing FreshNest!",
    showFooter = true,
    customStyles = "",
  } = content;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; line-height: 1.6; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 30px; text-align: center; color: white; }
    .logo { font-size: 32px; margin-bottom: 10px; }
    .brand-name { font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.025em; }
    .brand-tagline { font-size: 14px; opacity: 0.9; margin-top: 4px; font-weight: 500; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
    .order-badge { display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }
    .order-details { background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .order-info { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; }
    .order-info:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .order-label { font-weight: 600; color: #64748b; font-size: 14px; }
    .order-value { font-weight: 700; color: #1e293b; font-size: 14px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .items-table th { background-color: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .items-table tr:last-child td { border-bottom: none; }
    .item-name { font-weight: 600; color: #1e293b; }
    .item-qty { color: #64748b; font-size: 12px; }
    .billing-summary { background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .billing-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .billing-row.total { border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px; font-size: 16px; font-weight: 700; color: #16a34a; }
    .billing-row.discount { color: #dc2626; }
    .address-section { background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #16a34a; }
    .address-title { font-weight: 700; color: #1e293b; margin-bottom: 10px; font-size: 16px; }
    .address-text { color: #64748b; line-height: 1.5; }
    .status-success { background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block; }
    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { color: #64748b; font-size: 14px; margin-bottom: 10px; }
    .footer-links { margin: 15px 0; }
    .footer-link { color: #16a34a; text-decoration: none; margin: 0 10px; font-size: 14px; font-weight: 500; }
    .copyright { color: #94a3b8; font-size: 12px; margin-top: 15px; }
    .social-links { margin: 15px 0; }
    .social-link { display: inline-block; margin: 0 5px; padding: 8px; background-color: #e2e8f0; border-radius: 50%; text-decoration: none; color: #64748b; }
    ${customStyles}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌱</div>
      <h1 class="brand-name">${title}</h1>
      <p class="brand-tagline">${subtitle}</p>
    </div>
    <div class="content">
      <h2 class="greeting">${greeting}</h2>
      ${mainContent}
    </div>
    ${showFooter ? `
    <div class="footer">
      <p class="footer-text">${footerText}</p>
      <div class="social-links">
        <a href="#" class="social-link">📘</a>
        <a href="#" class="social-link">🐦</a>
        <a href="#" class="social-link">📷</a>
      </div>
      <div class="footer-links">
        <a href="#" class="footer-link">Contact Us</a>
        <a href="#" class="footer-link">Help Center</a>
        <a href="#" class="footer-link">Privacy Policy</a>
      </div>
      <p class="copyright">© ${new Date().getFullYear()} FreshNest Mart. All rights reserved.</p>
    </div>` : ""}
  </div>
</body>
</html>`;
};

// =============================================================================
// EMAIL HELPERS
// =============================================================================

/**
 * Sends OTP email for login verification
 */
export const sendOTPEmail = async ({ email, otp, userName }) => {
  const mainContent = `
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:48px;margin-bottom:20px">🔐</div>
      <h3 style="color:#16a34a;margin-bottom:20px">Your Login OTP</h3>
      <p style="font-size:16px;color:#64748b;margin-bottom:30px">Use this code to complete your login to FreshNest.</p>
    </div>
    <div style="background-color:#f0fdf4;border-radius:12px;padding:25px;margin:20px 0;border-left:4px solid #16a34a">
      <h4 style="color:#166534;margin:0 0 15px 0;text-align:center">Your One-Time Password</h4>
      <div style="background-color:#ffffff;border:2px solid #16a34a;border-radius:8px;padding:20px;margin:15px 0;text-align:center">
        <div style="font-size:36px;font-weight:bold;color:#16a34a;letter-spacing:8px;font-family:'Courier New',monospace">${otp}</div>
      </div>
      <p style="color:#166534;margin:15px 0 0 0;text-align:center;font-size:14px">This code expires in <strong>10 minutes</strong>.</p>
    </div>
    <div style="background-color:#fef2f2;border-radius:8px;padding:15px;margin:20px 0;border:1px solid #fecaca">
      <p style="color:#dc2626;margin:0;font-size:14px;text-align:center">
        <strong>Security Notice:</strong> If you didn't request this OTP, please ignore this email.
      </p>
    </div>`;

  const subject = "🔐 Your FreshNest Login OTP";
  const html = generateEmailTemplate({
    greeting: `Hi ${userName},`,
    mainContent,
    footerText: "This is an automated security email. Please do not reply.",
  });

  return sendEmail(email, subject, `Your FreshNest OTP is: ${otp}`, html);
};

/**
 * Sends password reset verification code email
 */
export const sendPasswordResetEmail = async ({ email, resetCode, userName }) => {
  const mainContent = `
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:48px;margin-bottom:20px">🔐</div>
      <h3 style="color:#dc2626;margin-bottom:20px">Password Reset Request</h3>
      <p style="font-size:16px;color:#64748b;margin-bottom:30px">Use the code below to reset your FreshNest password.</p>
    </div>
    <div style="background-color:#fef2f2;border-radius:12px;padding:25px;margin:20px 0;border-left:4px solid #dc2626">
      <h4 style="color:#dc2626;margin:0 0 15px 0;text-align:center">Your Reset Code</h4>
      <div style="background-color:#ffffff;border:2px solid #dc2626;border-radius:8px;padding:20px;margin:15px 0;text-align:center">
        <div style="font-size:36px;font-weight:bold;color:#dc2626;letter-spacing:8px;font-family:'Courier New',monospace">${resetCode}</div>
      </div>
      <p style="color:#dc2626;margin:15px 0 0 0;text-align:center;font-size:14px">This code expires in <strong>15 minutes</strong>.</p>
    </div>
    <div style="background-color:#f8fafc;border-radius:8px;padding:15px;margin:20px 0;border:1px solid #e2e8f0">
      <p style="color:#64748b;margin:0;font-size:14px;text-align:center">
        <strong>Didn't request this?</strong> Ignore this email — your password will remain unchanged.
      </p>
    </div>`;

  const subject = "🔐 Reset Your FreshNest Password";
  const html = generateEmailTemplate({
    greeting: `Hi ${userName},`,
    mainContent,
    footerText: "If you have questions, contact our support team.",
  });

  return sendEmail(email, subject, `Your FreshNest password reset code is: ${resetCode}`, html);
};

/**
 * Sends welcome email on registration
 */
export const sendWelcomeEmail = async ({ name, email }) => {
  const mainContent = `
    <div style="text-align:center;margin:20px 0">
      <div style="font-size:48px;margin-bottom:20px">🎉</div>
      <h3 style="color:#16a34a;margin-bottom:20px">Welcome to FreshNest!</h3>
      <p style="font-size:16px;color:#64748b;margin-bottom:30px">We're thrilled to have you join our fresh community!</p>
    </div>
    <div style="background-color:#f0fdf4;border-radius:12px;padding:25px;margin:20px 0;border-left:4px solid #16a34a">
      <h4 style="color:#166534;margin:0 0 15px 0">🌱 What you can do now:</h4>
      <ul style="color:#166534;padding-left:20px;margin:0">
        <li style="margin-bottom:8px">Browse our wide selection of fresh groceries</li>
        <li style="margin-bottom:8px">Place orders with Cash on Delivery or online payment</li>
        <li style="margin-bottom:8px">Track your orders in real-time</li>
        <li style="margin-bottom:8px">Save your favourite delivery addresses</li>
        <li style="margin-bottom:8px">Use OTP login for passwordless access</li>
      </ul>
    </div>`;

  const subject = "🌱 Welcome to FreshNest — Your Fresh Grocery Partner!";
  const html = generateEmailTemplate({
    greeting: `Hello ${name}!`,
    mainContent,
    footerText: "Happy shopping with FreshNest! We're here to serve the freshest groceries.",
  });

  return sendEmail(email, subject, `Welcome to FreshNest, ${name}!`, html);
};

/**
 * Sends order confirmation email with full receipt
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  const { user, order, items, address, paymentType, subtotal, taxValue, platformFee, discount, totalAmount } = orderData;

  const orderIdShort = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const itemsHtml = items.map((item) => `
    <tr>
      <td><div class="item-name">${item.name}</div><div class="item-qty">Qty: ${item.quantity}</div></td>
      <td style="text-align:center">₹${Number(item.price).toFixed(2)}</td>
      <td style="text-align:right;font-weight:600">₹${Number(item.total).toFixed(2)}</td>
    </tr>`).join("");

  const billingHtml = `
    <div class="billing-row"><span>Subtotal</span><span>₹${Number(subtotal).toFixed(2)}</span></div>
    ${Number(discount?.discountAmount) > 0 ? `<div class="billing-row discount"><span>Discount (${discount.code})</span><span>-₹${Number(discount.discountAmount).toFixed(2)}</span></div>` : ""}
    <div class="billing-row"><span>Tax (5%)</span><span>₹${Number(taxValue).toFixed(2)}</span></div>
    <div class="billing-row"><span>Delivery Fee</span><span>₹${Number(platformFee).toFixed(2)}</span></div>
    <div class="billing-row total"><span>Total Amount</span><span>₹${Number(totalAmount).toFixed(2)}</span></div>`;

  const mainContent = `
    <div class="order-badge">Order Confirmed ✓</div>
    <div class="order-details">
      <div class="order-info"><span class="order-label">Order ID</span><span class="order-value">#${orderIdShort}</span></div>
      <div class="order-info"><span class="order-label">Order Date</span><span class="order-value">${orderDate}</span></div>
      <div class="order-info"><span class="order-label">Payment</span><span class="order-value">${paymentType === "COD" ? "Cash on Delivery" : "Online Payment"}</span></div>
      <div class="order-info"><span class="order-label">Status</span><span class="status-success">Order Placed</span></div>
    </div>
    <h3 style="color:#1e293b;margin:30px 0 15px 0;font-size:18px">📦 Order Items</h3>
    <table class="items-table">
      <thead><tr><th>Product</th><th style="text-align:center">Price</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <h3 style="color:#1e293b;margin:30px 0 15px 0;font-size:18px">💳 Billing Summary</h3>
    <div class="billing-summary">${billingHtml}</div>
    <h3 style="color:#1e293b;margin:30px 0 15px 0;font-size:18px">📍 Delivery Address</h3>
    <div class="address-section">
      <div class="address-title">${address.firstName} ${address.lastName}</div>
      <div class="address-text">${address.houseNo}, ${address.area}<br>${address.street}<br>${address.city}, ${address.state} - ${address.zipCode}<br>Phone: ${address.phone}</div>
    </div>
    <div style="background-color:#dcfce7;border:1px solid #bbf7d0;border-radius:8px;padding:15px;margin:20px 0">
      <h4 style="color:#166534;margin:0 0 10px 0;font-size:16px">🚚 Delivery Information</h4>
      <p style="color:#166534;margin:0;font-size:14px">Expected delivery: 2–3 business days</p>
    </div>`;

  const subject = `🎉 Order Confirmed — #${orderIdShort} | FreshNest`;
  const html = generateEmailTemplate({
    greeting: `Hi ${user.name}!`,
    mainContent,
    footerText: "Thank you for shopping with FreshNest! Fresh groceries are on their way.",
  });

  return sendEmail(user.email, subject, "Your FreshNest order has been confirmed!", html);
};

// =============================================================================
// SMS SERVICE - Twilio
// =============================================================================

// Guard: only create Twilio client when credentials exist
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

/**
 * Sends SMS via Twilio. Silently mocks if credentials are missing.
 */
export const sendSMS = async (to, message) => {
  try {
    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
      console.log(`[📱 SMS Mock]: To: ${to} | Message: ${message}`);
      return true;
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log(`[📱 SMS Sent]: To: ${to} | SID: ${result.sid}`);
    return true;
  } catch (err) {
    console.error("[📱 SMS ERROR]:", err.message);
    return false;
  }
};
