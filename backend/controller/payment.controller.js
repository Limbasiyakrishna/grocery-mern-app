import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import { sendEmail, sendSMS, sendOrderConfirmationEmail } from "../utils/messageService.js";

// Dummy payment module: accepts all payment methods, no external gateway

/**
 * Sends order confirmation notifications via email and SMS
 * @param {string} orderId - The ID of the order to notify about
 */
const sendOrderNotifications = async (orderId) => {
  try {
    // Fetch order details
    const order = await Order.findById(orderId);
    if (!order) return;

    // Fetch user and address details
    const userDoc = await User.findById(order.userId);
    const addressDoc = await Address.findById(order.address);
    if (!userDoc || !addressDoc) return;

    // Prepare product details for the email
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
      // Send professional HTML order confirmation email
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

    // Send SMS notification if phone number is available
    if (userDoc.phone) {
      const smsBody = `🎉 FreshNest Order Confirmed! Order #${orderIdShort} for ₹${order.amount} will be delivered to ${addressDoc.city} in 2-3 days. Invoice sent to email.`;
      sendSMS(userDoc.phone, smsBody).catch((e) => {}); // Silent fail on SMS error
    }
  } catch (err) {
    // Silent error handling to avoid disrupting payment flow
  }
};

/**
 * Retrieves the payment status of an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Return order payment details
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
 * Creates a dummy payment order that accepts any payment type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createDummyOrder = async (req, res) => {
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

    // Validate required fields
    if (!userId || !items || !addressId || !amount) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Normalize and validate payment type
    const normalizedPaymentType = (paymentType || "DUMMY").toString().trim().toUpperCase();
    const acceptedMethods = ["DUMMY", "COD", "CARD", "UPI", "NETBANKING", "WALLET", "BANKTRANSFER", "BHIM", "PAYTM"];
    const finalPaymentType = acceptedMethods.includes(normalizedPaymentType)
      ? normalizedPaymentType
      : "DUMMY";

    // Create order in database with pending payment status
    const order = new Order({
      userId,
      items,
      address: addressId,
      coupon: coupon || {},
      amount,
      subtotal,
      taxValue,
      platformFee,
      paymentType: finalPaymentType,
      isPaid: false,
      status: "Awaiting Payment",
    });

    await order.save();

    // Return success response with order details
    res.json({
      success: true,
      message: `Dummy order created with paymentType ${finalPaymentType}`,
      orderId: order._id,
      amount: order.amount,
      paymentType: finalPaymentType,
    });
  } catch (error) {
    console.error("Dummy order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Verifies and completes a dummy payment by updating order status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const verifyDummyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Validate order ID
    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    // Update order to paid and placed status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true, status: "Order Placed" },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Send order notifications asynchronously
    sendOrderNotifications(order._id);

    // Return success response
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
