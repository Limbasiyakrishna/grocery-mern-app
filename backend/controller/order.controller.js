import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import Coupon from "../models/coupon.model.js";
import { sendEmail, sendSMS } from "../utils/messageService.js";

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, couponCode } = req.body;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    // Calculate subtotal
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

    // Tax Calculation (5%)
    const TAX_RATE = 5;
    const taxValue = Math.floor((subtotal * TAX_RATE) / 100);
    const platformFee = 5;

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

      // Calculate discount
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

    // Create order
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

    // Send Notifications & Bill (Non-blocking)
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
          const orderIdShort = newOrder._id
            .toString()
            .slice(-6)
            .toUpperCase();

          // Build detailed bill email
          const itemsTable = orderProducts
            .map(
              (item) =>
                `${item.name}
   Qty: ${item.quantity} × ₹${item.price} = ₹${item.total}`
            )
            .join("\n");

          const billEmail = `Hi ${userDoc.name},

🎉 Your FreshNest Order Confirmation & Invoice

Order Number: #${orderIdShort}
Order Date: ${new Date().toLocaleDateString("en-IN", {
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
Subtotal:           ₹${subtotal}
${couponDiscount.discountAmount > 0 ? `Discount (${couponDiscount.code}):     -₹${couponDiscount.discountAmount}` : "Discount:          ₹0"}
Tax (${TAX_RATE}%):                ₹${taxValue}
Platform Fee:       ₹${platformFee}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL AMOUNT:       ₹${finalAmount}

Payment Method: Cash on Delivery (COD)

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
FreshNest Team`;

          // Send detailed bill email
          sendEmail(
            userDoc.email,
            `✅ Order Confirmed & Invoice #${orderIdShort}`,
            billEmail
          ).catch((e) => {}); // Silent fail

          // Send SMS notification
          if (userDoc.phone) {
            const smsBody = `🎉 FreshNest Order Confirmed! Order #${orderIdShort} for ₹${finalAmount} will be delivered to ${addressDoc.city} in 2-3 days. Invoice sent to email.`;
            sendSMS(userDoc.phone, smsBody).catch((e) => {}); // Silent fail
          }
        }
      } catch (notifErr) {
        // Silent
      }
    })();

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

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
