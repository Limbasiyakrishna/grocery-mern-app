import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Price at time of order
      },
    ],
    subtotal: { type: Number, required: true }, // Amount before tax and discount
    taxAmount: { type: Number, default: 5 }, // Tax percentage (currently 5%)
    taxValue: { type: Number, default: 0 }, // Actual tax amount in rupees
    platformFee: { type: Number, default: 5 }, // Platform fee in rupees
    coupon: {
      code: { type: String, default: null },
      discountPercent: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
    },
    amount: { type: Number, required: true }, // Final amount after all calculations
    address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Address" },
    status: { type: String, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },

  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;
