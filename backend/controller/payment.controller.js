import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import { sendEmail, sendSMS, sendOrderConfirmationEmail } from "../utils/messageService.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Sends order confirmation notifications via email and SMS
 * @param {string} orderId - The ID of the order to notify about
 */
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

    if (userDoc && addressDoc) {
      await sendOrderConfirmationEmail({
        user: userDoc,
        order: order,
        items: orderProducts,
        address: addressDoc,
        paymentType: order.paymentType,
        subtotal: order.subtotal,
        taxValue: order.taxValue,
        platformFee: order.platformFee,
        discount: order.coupon,
        totalAmount: order.amount
      }).catch((e) => {
         console.error(`[📩 Email ERROR]: Failed to send invoice for order ${orderIdShort}: ${e.message}`);
      });
    }

    if (userDoc.phone) {
      const smsBody = `🎉 FreshNest Order Confirmed! Order #${orderIdShort} for ₹${order.amount} will be delivered to ${addressDoc.city} in 2-3 days. Invoice sent to email.`;
      sendSMS(userDoc.phone, smsBody).catch((e) => {});
    }
  } catch (err) {
    console.error("Notification error:", err);
  }
};

/**
 * Retrieves the payment status of an order
 */
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

/**
 * Creates a Razorpay order
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      addressId,
      coupon,
      amount,
      subtotal,
      taxValue,
      platformFee,
      paymentType,
    } = req.body;

    if (!userId || !items || !addressId || !amount) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Razorpay amount is in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res.json({ success: false, message: "Failed to create Razorpay order" });
    }

    // Create record in our database
    const order = new Order({
      userId,
      items,
      address: addressId,
      coupon: coupon || {},
      amount,
      subtotal,
      taxValue,
      platformFee,
      paymentType: paymentType || "RAZORPAY",
      razorpayOrderId: razorpayOrder.id,
      isPaid: false,
      status: "Awaiting Payment",
    });

    await order.save();

    res.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Verifies Razorpay payment signature
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      const order = await Order.findByIdAndUpdate(
        orderId,
        { 
          isPaid: true, 
          status: "Order Placed",
          razorpayPaymentId: razorpay_payment_id
        },
        { new: true }
      );

      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      sendOrderNotifications(order._id);

      res.json({
        success: true,
        message: "Payment verified successfully",
        orderId: order._id,
      });
    } else {
      res.json({ success: false, message: "Invalid signature, payment verification failed" });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Handles Cash on Delivery order creation
 */
export const createCodOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      addressId,
      coupon,
      amount,
      subtotal,
      taxValue,
      platformFee,
    } = req.body;

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
    
    sendOrderNotifications(order._id);

    res.json({
      success: true,
      message: "COD order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("COD order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};

