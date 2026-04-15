import express from "express";
import {
  getPaymentStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCodOrder,
} from "../controller/payment.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

// Razorpay payment routes
router.post("/razorpay/create-order", authUser, createRazorpayOrder);
router.post("/razorpay/verify", authUser, verifyRazorpayPayment);

// COD route
router.post("/cod/create-order", authUser, createCodOrder);

// Payment status
router.get("/status/:orderId", authUser, getPaymentStatus);

export default router;

