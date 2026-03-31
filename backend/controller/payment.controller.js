import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import Coupon from "../models/coupon.model.js";
import crypto from "crypto";
import axios from "axios";
import QRCode from "qrcode";
import { sendEmail, sendSMS } from "../utils/messageService.js";

// PhonePe Configuration
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "MOCK_MERCHANT_ID";
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY || "MOCK_API_KEY";
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || "MOCK_SALT_KEY";
const PHONEPE_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://api.phonepe.com/apis/hermes"
  : "https://api-sandbox.phonepe.com/apis/hermes";

// Helper for sending order notifications
const sendOrderNotifications = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) return;

    const userDoc = await User.findById(order.userId);
    const addressDoc = await Address.findById(order.address);
    if (!userDoc || !addressDoc) return;

    const orderProducts = await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          name: product ? product.name : "Unknown Item",
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        };
      })
    );

    const orderIdShort = order._id.toString().slice(-6).toUpperCase();
    const TAX_RATE = 5; // Default 5%

    const itemsTable = orderProducts
      .map((item) => `${item.name}\n   Qty: ${item.quantity} × ₹${item.price} = ₹${item.total}`)
      .join("\n");

    const billEmail = `Hi ${userDoc.name},

🎉 Your FreshNest Order Confirmation & Invoice

Order Number: #${orderIdShort}
Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
Status: Order Placed ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 ITEMS ORDERED:
${itemsTable}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 BILLING SUMMARY:
Subtotal:           ₹${order.subtotal}
${order.coupon && order.coupon.discountAmount > 0 
  ? `Discount (${order.coupon.code}):     -₹${order.coupon.discountAmount}` 
  : "Discount:          ₹0"}
Tax (${TAX_RATE}%):                ₹${order.taxValue}
Platform Fee:       ₹${order.platformFee}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL AMOUNT:       ₹${order.amount}

Payment Method: ${order.paymentType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 DELIVERY ADDRESS:
${addressDoc.firstName} ${addressDoc.lastName}
${addressDoc.houseNo}, ${addressDoc.area}
${addressDoc.street}
${addressDoc.city}, ${addressDoc.state} - ${addressDoc.zipCode}
Phone: ${addressDoc.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚚 DELIVERY DETAILS:
Expected Delivery: 2-3 business days
Tracking: You will receive a tracking link via SMS

For any queries, contact us at support@freshnest.com

Thank you for your order! 🌱
The FreshNest Team`;

    // Send Detailed Email
    sendEmail(
      userDoc.email,
      `✅ Order Confirmed & Invoice #${orderIdShort}`,
      billEmail
    ).catch((e) => {}); // Silent fail

    // Send SMS
    if (userDoc.phone) {
      const smsBody = `🎉 FreshNest Order Confirmed! Order #${orderIdShort} for ₹${order.amount} will be delivered to ${addressDoc.city} in 2-3 days. Invoice sent to email.`;
      sendSMS(userDoc.phone, smsBody).catch((e) => {}); // Silent fail
    }
  } catch (err) {
    // Silent
  }
};

// Create PhonePe Payment Order
export const createPhonePeOrder = async (req, res) => {
  try {
    const { userId, items, address, coupon, amount, subtotal, taxValue, platformFee } =
      req.body;

    if (!userId || !items || !address || !amount) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create order in database (pending payment)
    const order = new Order({
      userId,
      items,
      address,
      coupon: coupon || {},
      amount,
      subtotal,
      taxValue,
      platformFee,
      paymentType: "PHONEPE",
      isPaid: false,
      status: "Awaiting Payment",
    });

    await order.save();

    // Prepare PhonePe request
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: Math.round(amount * 100), // Convert to paise
      redirectUrl: `${process.env.FRONTEND_URL}/payment-callback?orderId=${order._id}&txnId=${transactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/callback`,
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAYMENT_LINK",
      },
    };

    // Create checksum
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const checksum = crypto
      .createHmac("sha256", PHONEPE_SALT_KEY)
      .update(payloadBase64 + "/pg/v1/pay" + PHONEPE_SALT_KEY)
      .digest("hex") + "###1";

    // Call PhonePe API
    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      {
        request: payloadBase64,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
        },
      }
    );

    if (response.data.success) {
      res.json({
        success: true,
        redirectUrl: response.data.data.instrumentResponse.redirectUrl,
        transactionId,
        orderId: order._id,
      });
    } else {
      res.json({
        success: false,
        message: response.data.message || "Failed to create payment",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// PhonePe Callback Handler
export const handlePhonePeCallback = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.json({ success: false, message: "Transaction ID missing" });
    }

    // Verify transaction status with PhonePe
    const checksum = crypto
      .createHmac("sha256", PHONEPE_SALT_KEY)
      .update(`/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}${PHONEPE_SALT_KEY}`)
      .digest("hex") + "###1";

    const response = await axios.get(
      `${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
        },
      }
    );

    if (response.data.success && response.data.data.responseCode === "PAYMENT_SUCCESS") {
      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify PhonePe Payment from Frontend
export const verifyPhonePePayment = async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;

    if (!orderId || !transactionId) {
      return res.json({ success: false, message: "Missing payment verification data" });
    }

    // Verify transaction status with PhonePe
    const checksum = crypto
      .createHmac("sha256", PHONEPE_SALT_KEY)
      .update(`/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}${PHONEPE_SALT_KEY}`)
      .digest("hex") + "###1";

    const response = await axios.get(
      `${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
        },
      }
    );

    if (response.data.success && response.data.data.responseCode === "PAYMENT_SUCCESS") {
      // Update order in database
      const order = await Order.findByIdAndUpdate(
        orderId,
        { isPaid: true, status: "Order Placed" },
        { new: true }
      );

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      // Trigger notification (non-blocking)
      sendOrderNotifications(order._id);

      res.json({
        success: true,
        message: "Payment verified successfully",
        orderId: order._id,
        amount: order.amount,
      });
    } else {
      res.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Generate UPI QR Code
export const generateUPIQRCode = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Format: upi://pay?pa=merchantUPI&pn=merchantName&am=amount&tn=description&tr=transactionRef
    const upiString = `upi://pay?pa=${process.env.UPI_ID}&pn=${encodeURIComponent(
      "FreshNest"
    )}&am=${amount}&tn=${encodeURIComponent(`Order ${orderId}`)}&tr=${orderId}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(upiString);

    res.json({
      success: true,
      qrCode,
      upiId: process.env.UPI_ID,
      amount,
      orderId,
    });
  } catch (error) {
    console.error("QR code generation error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Create UPI Payment Order
export const createUPIPaymentOrder = async (req, res) => {
  try {
    const { userId, items, addressId, coupon, amount, subtotal, taxValue, platformFee } =
      req.body;

    if (!userId || !items || !addressId || !amount) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Create order in database (pending payment)
    const order = new Order({
      userId,
      items,
      address: addressId,
      coupon: coupon || {},
      amount,
      subtotal,
      taxValue,
      platformFee,
      paymentType: "UPI",
      isPaid: false,
      status: "Awaiting Payment",
    });

    await order.save();

    res.json({
      success: true,
      orderId: order._id,
      amount: order.amount,
      message: "Please complete payment via UPI QR code",
    });
  } catch (error) {
    console.error("UPI order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Confirm UPI Payment (manual confirmation after scanning QR)
export const confirmUPIPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true, status: "Order Placed" },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Trigger notification (non-blocking)
    sendOrderNotifications(order._id);

    res.json({
      success: true,
      message: "Payment confirmed",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Create COD Order (Cash on Delivery)
export const createCODOrder = async (req, res) => {
  try {
    const { userId, items, addressId, coupon, amount, subtotal, taxValue, platformFee } =
      req.body;

    if (!userId || !items || !addressId || !amount) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const order = new Order({
      userId,
      items,
      address: addressId,
      coupon: coupon || {},
      amount,
      subtotal,
      taxValue,
      platformFee,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });

    await order.save();

    // Trigger notification (non-blocking)
    sendOrderNotifications(order._id);

    res.json({
      success: true,
      message: "Order placed successfully with COD",
      orderId: order._id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("COD order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get Payment Status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      orderId: order._id,
      paymentType: order.paymentType,
      isPaid: order.isPaid,
      amount: order.amount,
      status: order.status,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.json({ success: false, message: error.message });
  }
};
// Create Dummy Payment Order (For Testing)
export const createDummyOrder = async (req, res) => {
  try {
    const { userId, items, addressId, coupon, amount, subtotal, taxValue, platformFee } =
      req.body;

    if (!userId || !items || !addressId || !amount) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Create order in database (pending payment)
    const order = new Order({
      userId,
      items,
      address: addressId,
      coupon: coupon || {},
      amount,
      subtotal,
      taxValue,
      platformFee,
      paymentType: "DUMMY",
      isPaid: false,
      status: "Awaiting Payment",
    });

    await order.save();

    res.json({
      success: true,
      message: "Dummy payment processed successfully",
      orderId: order._id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Dummy order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Dummy Payment
export const verifyDummyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true, status: "Order Placed" },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Trigger notification (non-blocking)
    sendOrderNotifications(order._id);

    res.json({
      success: true,
      message: "Payment verified successfully (Dummy)",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Dummy payment verification error:", error);
    res.json({ success: false, message: error.message });
  }
};
