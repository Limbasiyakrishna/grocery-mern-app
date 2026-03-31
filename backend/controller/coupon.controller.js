import Coupon from "../models/coupon.model.js";

// Validate and get coupon discount
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.user;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code required" });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: "This coupon is no longer active" });
    }

    // Check if coupon has expired
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: "This coupon has expired" });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit exceeded" });
    }

    // Check if user has already used this coupon
    const userUsage = coupon.usedBy.find((u) => u.userId === userId);
    if (userUsage) {
      return res.status(400).json({ success: false, message: "You have already used this coupon" });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount should be ₹${coupon.minOrderAmount}`,
      });
    }

    // Calculate discount
    let discountAmount = Math.floor((orderAmount * coupon.discountPercent) / 100);

    // Apply max discount limit if set
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discountPercent: coupon.discountPercent,
      discountAmount,
      code: coupon.code,
      description: coupon.description,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    res.status(500).json({ success: false, message: "Error validating coupon" });
  }
};

// Get all active coupons (for display)
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: new Date() },
    }).select("code discountPercent minOrderAmount maxDiscount description expiryDate");

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ success: false, message: "Error fetching coupons" });
  }
};
