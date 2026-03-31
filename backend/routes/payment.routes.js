import express from "express";
import {
  createCODOrder,
  getPaymentStatus,
  createDummyOrder,
  verifyDummyPayment,
} from "../controller/payment.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();


// Dummy payment routes (Testing)
router.post("/dummy/create-order", authUser, createDummyOrder);
router.post("/dummy/verify", authUser, verifyDummyPayment);

// COD route
router.post("/cod", authUser, createCODOrder);

// Payment status
router.get("/status/:orderId", authUser, getPaymentStatus);

export default router;
