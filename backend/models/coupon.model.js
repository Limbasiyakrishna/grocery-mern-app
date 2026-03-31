import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    minOrderAmount: {
      type: Number,
      default: 0, // Minimum order amount to apply coupon
    },
    maxDiscount: {
      type: Number,
      default: null, // Maximum discount amount in rupees
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        userId: String,
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
