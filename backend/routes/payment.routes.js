import express from "express";
import {
  getPaymentStatus,
  createDummyOrder,
  verifyDummyPayment,
} from "../controller/payment.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();


// Dummy payment routes (Universal)
router.post("/dummy/create-order", authUser, createDummyOrder);
router.post("/dummy/verify", authUser, verifyDummyPayment);

// Payment status
router.get("/status/:orderId", authUser, getPaymentStatus);

export default router;
