import express from "express";
import {
  checkAuth,
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resetPassword,
} from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/is-auth", authUser, checkAuth);
router.get("/logout", authUser, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
