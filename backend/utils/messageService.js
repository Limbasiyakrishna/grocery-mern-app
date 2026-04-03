import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// -- Nodemailer Transporter (with fallback to Ethereal for local development)
let transporter = null;
let isEthereal = false;
let latestEmailStatus = "uninitialized";

export const getEmailTransportStatus = () => ({
  mode: latestEmailStatus,
  isEthereal,
  provider: isEthereal ? "ethereal" : "gmail"
});

const initializeTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // sanitize app password: remove accidental spaces and line breaks
    const emailUser = process.env.EMAIL_USER.trim();
    const emailPass = process.env.EMAIL_PASS.replace(/\s+/g, "");

    if (process.env.EMAIL_PASS !== emailPass) {
      console.warn("[📩 Email Service]: EMAIL_PASS has spaces/newlines and has been sanitized for use.");
    }

    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
    });

    try {
      await transporter.verify();
      latestEmailStatus = "gmail_ready";
      console.log("[📩 Email Service]: Gmail transporter ready.");
      return transporter;
    } catch (error) {
      latestEmailStatus = "gmail_failed_auth";
      console.error("[📩 Email Service]: Gmail transporter verification failed:", error.message);
      console.error("[📩 Email Service]: Falling back to Ethereal test SMTP due to Gmail auth error.");
    }
  }

  console.warn("[📩 Email Service]: EMAIL_USER or EMAIL_PASS missing/invalid. Falling back to Ethereal test SMTP.");
  latestEmailStatus = "falling_back_to_ethereal";
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  isEthereal = true;

  console.log("[📩 Email Service]: Ethereal transporter ready. Preview URL will be shown when email is sent.");
  return transporter;
};

/**
 * Generates professional HTML email template
 * @param {Object} content - Email content object
 * @returns {string} HTML email template
 */
const generateEmailTemplate = (content) => {
  const {
    title = "FreshNest",
    subtitle = "Premium Grocery Experience",
    greeting = "Hello!",
    mainContent = "",
    footerText = "Thank you for choosing FreshNest!",
    showFooter = true,
    customStyles = ""
  } = content;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
          color: #1e293b;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 32px;
          margin-bottom: 10px;
        }
        .brand-name {
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.025em;
        }
        .brand-tagline {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 4px;
          font-weight: 500;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }
        .order-badge {
          display: inline-block;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }
        .order-details {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid #e2e8f0;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .order-info:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .order-label {
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }
        .order-value {
          font-weight: 700;
          color: #1e293b;
          font-size: 14px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .items-table th {
          background-color: #f1f5f9;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }
        .items-table tr:last-child td {
          border-bottom: none;
        }
        .item-name {
          font-weight: 600;
          color: #1e293b;
        }
        .item-qty {
          color: #64748b;
          font-size: 12px;
        }
        .billing-summary {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        .billing-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .billing-row.total {
          border-top: 2px solid #e2e8f0;
          padding-top: 12px;
          margin-top: 12px;
          font-size: 16px;
          font-weight: 700;
          color: #16a34a;
        }
        .billing-row.discount {
          color: #dc2626;
        }
        .address-section {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #16a34a;
        }
        .address-title {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .address-text {
          color: #64748b;
          line-height: 1.5;
        }
        .status-success {
          background-color: #dcfce7;
          color: #166534;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .footer-links {
          margin: 15px 0;
        }
        .footer-link {
          color: #16a34a;
          text-decoration: none;
          margin: 0 10px;
          font-size: 14px;
          font-weight: 500;
        }
        .copyright {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 15px;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-link {
          display: inline-block;
          margin: 0 5px;
          padding: 8px;
          background-color: #e2e8f0;
          border-radius: 50%;
          text-decoration: none;
          color: #64748b;
        }
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
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};

/**
 * Sends order confirmation email with professional receipt
 * @param {Object} orderData - Complete order information
 * @returns {Promise<boolean>}
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  const {
    user,
    order,
    items,
    address,
    paymentType,
    subtotal,
    taxValue,
    platformFee,
    discount,
    totalAmount
  } = orderData;

  const orderIdShort = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Build items table
  const itemsHtml = items.map(item => `
    <tr>
      <td>
        <div class="item-name">${item.name}</div>
        <div class="item-qty">Qty: ${item.quantity}</div>
      </td>
      <td style="text-align: center;">₹${item.price.toFixed(2)}</td>
      <td style="text-align: right; font-weight: 600;">₹${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  // Build billing summary
  const billingHtml = `
    <div class="billing-row">
      <span>Subtotal</span>
      <span>₹${subtotal.toFixed(2)}</span>
    </div>
    ${discount.discountAmount > 0 ? `
    <div class="billing-row discount">
      <span>Discount (${discount.code})</span>
      <span>-₹${discount.discountAmount.toFixed(2)}</span>
    </div>
    ` : ''}
    <div class="billing-row">
      <span>Tax (5%)</span>
      <span>₹${taxValue.toFixed(2)}</span>
    </div>
    <div class="billing-row">
      <span>Delivery Fee</span>
      <span>₹${platformFee.toFixed(2)}</span>
    </div>
    <div class="billing-row total">
      <span>Total Amount</span>
      <span>₹${totalAmount.toFixed(2)}</span>
    </div>
  `;

  const mainContent = `
    <div class="order-badge">Order Confirmed ✓</div>

    <div class="order-details">
      <div class="order-info">
        <span class="order-label">Order ID</span>
        <span class="order-value">#${orderIdShort}</span>
      </div>
      <div class="order-info">
        <span class="order-label">Order Date</span>
        <span class="order-value">${orderDate}</span>
      </div>
      <div class="order-info">
        <span class="order-label">Payment Method</span>
        <span class="order-value">${paymentType === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
      </div>
      <div class="order-info">
        <span class="order-label">Status</span>
        <span class="status-success">Order Placed</span>
      </div>
    </div>

    <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 18px;">📦 Order Items</h3>
    <table class="items-table">
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align: center;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 18px;">💳 Billing Summary</h3>
    <div class="billing-summary">
      ${billingHtml}
    </div>

    <h3 style="color: #1e293b; margin: 30px 0 15px 0; font-size: 18px;">📍 Delivery Address</h3>
    <div class="address-section">
      <div class="address-title">${address.firstName} ${address.lastName}</div>
      <div class="address-text">
        ${address.houseNo}, ${address.area}<br>
        ${address.street}<br>
        ${address.city}, ${address.state} - ${address.zipCode}<br>
        Phone: ${address.phone}
      </div>
    </div>

    <div style="background-color: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">🚚 Delivery Information</h4>
      <p style="color: #166534; margin: 0; font-size: 14px;">
        Expected delivery: 2-3 business days<br>
        You will receive SMS updates on your order status
      </p>
    </div>
  `;

  const subject = `🎉 Order Confirmed - #${orderIdShort} | FreshNest`;
  const htmlContent = generateEmailTemplate({
    greeting: `Hi ${user.name}!`,
    mainContent,
    footerText: "Thank you for shopping with FreshNest! We're excited to deliver fresh groceries to your doorstep."
  });

  return await sendEmail(user.email, subject, "Your order has been confirmed!", htmlContent);
};

/**
 * Sends welcome email for new user registration
 * @param {Object} userData - User information
 * @returns {Promise<boolean>}
 */
export const sendWelcomeEmail = async (userData) => {
  const { name, email } = userData;

  const mainContent = `
    <div style="text-align: center; margin: 20px 0;">
      <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
      <h3 style="color: #16a34a; margin-bottom: 20px;">Welcome to FreshNest!</h3>
      <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">
        We're thrilled to have you join our community of fresh food lovers!
      </p>
    </div>

    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #16a34a;">
      <h4 style="color: #166534; margin: 0 0 15px 0;">🌱 What you can do now:</h4>
      <ul style="color: #166534; padding-left: 20px; margin: 0;">
        <li style="margin-bottom: 8px;">Browse our wide selection of fresh groceries</li>
        <li style="margin-bottom: 8px;">Place orders with cash on delivery</li>
        <li style="margin-bottom: 8px;">Track your orders in real-time</li>
        <li style="margin-bottom: 8px;">Save your favorite delivery addresses</li>
        <li style="margin-bottom: 8px;">Earn rewards on every purchase</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="#" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
        Start Shopping Now
      </a>
    </div>
  `;

  const subject = "🌱 Welcome to FreshNest - Your Fresh Grocery Partner!";
  const htmlContent = generateEmailTemplate({
    greeting: `Hello ${name}!`,
    mainContent,
    footerText: "Happy shopping with FreshNest! We're here to serve you the freshest groceries."
  });

  return await sendEmail(email, subject, `Welcome to FreshNest, ${name}!`, htmlContent);
};

/**
 * Sends password reset email with secure reset link
 * @param {Object} resetData - Reset information
 * @returns {Promise<boolean>}
 */
export const sendPasswordResetEmail = async (resetData) => {
  const { email, resetToken, userName } = resetData;

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const mainContent = `
    <div style="text-align: center; margin: 20px 0;">
      <div style="font-size: 48px; margin-bottom: 20px;">🔐</div>
      <h3 style="color: #dc2626; margin-bottom: 20px;">Password Reset Request</h3>
      <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">
        We received a request to reset your FreshNest password.
      </p>
    </div>

    <div style="background-color: #fef2f2; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #dc2626;">
      <h4 style="color: #dc2626; margin: 0 0 15px 0;">⚠️ Security Notice:</h4>
      <p style="color: #dc2626; margin: 0 0 15px 0;">
        This password reset link will expire in 15 minutes for your security.
      </p>
      <p style="color: #dc2626; margin: 0;">
        If you didn't request this password reset, please ignore this email.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
        Reset Your Password
      </a>
    </div>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <p style="color: #64748b; margin: 0; font-size: 14px;">
        <strong>Can't click the button?</strong><br>
        Copy and paste this link into your browser:<br>
        <span style="word-break: break-all; color: #16a34a;">${resetLink}</span>
      </p>
    </div>
  `;

  const subject = "🔐 Reset Your FreshNest Password";
  const htmlContent = generateEmailTemplate({
    greeting: `Hi ${userName},`,
    mainContent,
    footerText: "If you have any questions, please contact our support team."
  });

  return await sendEmail(email, subject, "Password reset instructions for FreshNest", htmlContent);
};

/**
 * Sends OTP email for login verification
 * @param {Object} otpData - OTP information
 * @returns {Promise<boolean>}
 */
export const sendOTPEmail = async (otpData) => {
  const { email, otp, userName } = otpData;

  const mainContent = `
    <div style="text-align: center; margin: 20px 0;">
      <div style="font-size: 48px; margin-bottom: 20px;">🔐</div>
      <h3 style="color: #16a34a; margin-bottom: 20px;">Your Login OTP</h3>
      <p style="font-size: 16px; color: #64748b; margin-bottom: 30px;">
        Use this code to complete your login to FreshNest.
      </p>
    </div>

    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #16a34a;">
      <h4 style="color: #166534; margin: 0 0 15px 0; text-align: center;">Your One-Time Password</h4>
      <div style="background-color: #ffffff; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 15px 0; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #16a34a; letter-spacing: 4px; font-family: 'Courier New', monospace;">
          ${otp}
        </div>
      </div>
      <p style="color: #166534; margin: 15px 0 0 0; text-align: center; font-size: 14px;">
        This code will expire in 10 minutes for your security.
      </p>
    </div>

    <div style="background-color: #fef2f2; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #fecaca;">
      <p style="color: #dc2626; margin: 0; font-size: 14px; text-align: center;">
        <strong>Security Notice:</strong> If you didn't request this login, please ignore this email and contact our support team.
      </p>
    </div>
  `;

  const subject = "🔐 Your FreshNest Login OTP";
  const htmlContent = generateEmailTemplate({
    greeting: `Hi ${userName},`,
    mainContent,
    footerText: "This is an automated security email. Please do not reply."
  });

  return await sendEmail(email, subject, `Your FreshNest OTP is: ${otp}`, htmlContent);
};
export const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transport = await initializeTransporter();

    const mailOptions = {
      from: `"FreshNest Support" <${process.env.EMAIL_USER || "no-reply@freshnest.test"}>`,
      to,
      subject,
      text,
      html: html || generateEmailTemplate({
        mainContent: `<p style="white-space: pre-line; line-height: 1.6; font-size: 16px; color: #334155; margin: 0;">${text}</p>`
      }),
    };

    const info = await transport.sendMail(mailOptions);

    if (isEthereal) {
      latestEmailStatus = "ethereal_sent";
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[📩 Ethereal Email Sent]: To: ${to} | ID: ${info.messageId} | Preview: ${previewUrl}`);
    } else {
      latestEmailStatus = "gmail_sent";
      console.log(`[📩 Email Sent Success]: To: ${to} | ID: ${info.messageId}`);
    }

    return true;
  } catch (error) {
    console.error(`[📩 Email Service ERROR]:`, error);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Please verify EMAIL_USER and EMAIL_PASS (Gmail App Password).");
    }
    if (error.response) {
      console.error("SMTP response:", error.response);
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

// Export the initializeTransporter function
export { initializeTransporter };

