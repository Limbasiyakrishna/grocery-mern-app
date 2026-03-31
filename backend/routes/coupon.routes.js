import express from "express";
import { validateCoupon, getActiveCoupons } from "../controller/coupon.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

// Public route - get all active coupons
router.get("/list", getActiveCoupons);

// Protected route - validate coupon for a specific order
router.post("/validate", authUser, validateCoupon);

export default router;
