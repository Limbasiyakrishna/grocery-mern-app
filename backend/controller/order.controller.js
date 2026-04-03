import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import Coupon from "../models/coupon.model.js";
import { sendEmail, sendSMS, sendOrderConfirmationEmail } from "../utils/messageService.js";

/**
 * Places a Cash on Delivery (COD) order for the authenticated user
 * @param {Object} req - Express request object with order items, address, and optional coupon
 * @param {Object} res - Express response object
 */
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, couponCode } = req.body;

    // Validate required fields
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    // Calculate subtotal and validate products
    let subtotal = 0;
    const itemsWithPrice = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }
      const itemTotal = product.offerPrice * item.quantity;
      subtotal += itemTotal;
      itemsWithPrice.push({
        product: item.product,
        quantity: item.quantity,
        price: product.offerPrice,
      });
    }

    // Calculate tax (5%) and platform fee
    const TAX_RATE = 5;
    const taxValue = Math.floor((subtotal * TAX_RATE) / 100);
    const platformFee = 5;

    // Initialize coupon discount
    let couponDiscount = {
      code: null,
      discountPercent: 0,
      discountAmount: 0,
    };

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (!coupon) {
        return res
          .status(400)
          .json({ message: "Invalid or expired coupon", success: false });
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res
          .status(400)
          .json({ message: "Coupon usage limit exceeded", success: false });
      }

      // Check if user already used this coupon
      const userUsage = coupon.usedBy.find((u) => u.userId === userId);
      if (userUsage) {
        return res.status(400).json({
          message: "You have already used this coupon",
          success: false,
        });
      }

      // Check minimum order amount
      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          message: `Minimum order amount should be ₹${coupon.minOrderAmount}`,
          success: false,
        });
      }

      // Calculate discount amount
      let discountAmount = Math.floor((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }

      couponDiscount = {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
      };

      // Update coupon usage
      await Coupon.findByIdAndUpdate(coupon._id, {
        $inc: { usedCount: 1 },
        $push: { usedBy: { userId, appliedAt: new Date() } },
      });
    }

    // Calculate final amount
    const finalAmount =
      subtotal +
      taxValue +
      platformFee -
      couponDiscount.discountAmount;

    // Create order in database
    const newOrder = await Order.create({
      userId,
      items: itemsWithPrice,
      subtotal,
      taxAmount: TAX_RATE,
      taxValue,
      platformFee,
      coupon: couponDiscount,
      amount: finalAmount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    // Send order confirmation notifications asynchronously (non-blocking)
    (async () => {
      try {
        const userDoc = await User.findById(userId);
        const addressDoc = await Address.findById(address);
        const orderProducts = await Promise.all(
          itemsWithPrice.map(async (item) => {
            const product = await Product.findById(item.product);
            return {
              name: product.name,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            };
          })
        );

        if (userDoc && addressDoc) {
          // Send professional HTML order confirmation email
          await sendOrderConfirmationEmail({
            user: userDoc,
            order: newOrder,
            items: orderProducts,
            address: addressDoc,
            paymentType: "COD",
            subtotal,
            taxValue,
            platformFee,
            discount: couponDiscount,
            totalAmount: finalAmount
          }).catch((e) => {}); // Silent fail

          // Send SMS notification
          if (userDoc.phone) {
            const orderIdShort = newOrder._id.toString().slice(-6).toUpperCase();
            const smsBody = `🎉 FreshNest Order Confirmed! Order #${orderIdShort} for ₹${finalAmount} will be delivered to ${addressDoc.city} in 2-3 days. Invoice sent to email.`;
            sendSMS(userDoc.phone, smsBody).catch((e) => {}); // Silent fail
          }
        }
      } catch (notifErr) {
        // Silent error handling for notifications
      }
    })();

    // Return success response
    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error", success: false });
  }
};

/**
 * Retrieves all orders for the authenticated user
 * @param {Object} req - Express request object with authenticated user ID
 * @param {Object} res - Express response object
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;

    // Find orders that are either COD or paid
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address") // Populate product and address details
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Retrieves all orders for admin view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllOrders = async (req, res) => {
  try {
    // Find all orders that are either COD or paid
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address") // Populate product and address details
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
