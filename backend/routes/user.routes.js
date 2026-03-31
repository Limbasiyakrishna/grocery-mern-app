import express from "express";
import {
  checkAuth,
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// OTP Login Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
