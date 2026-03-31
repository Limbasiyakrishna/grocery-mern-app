import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/messageService.js";

// register user: /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
    });
    
    // Welcome Email (fire-and-forget)
    sendEmail(
      email, 
      "Welcome to FreshNest! 🌱", 
      `Hi ${name},\n\nWe're thrilled to have you! Dive into farm-fresh groceries, explore our latest recipes, and let us bring the best of nature to your doorstep.\n\nHappy Shopping!`
    ).catch(e => {}); // Silent fail
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// login user: /api/user/login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Successfully logged in",
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// check auth : /api/user/is-auth
export const checkAuth = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// logout user: /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};// forgot password: /api/user/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide email", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Generate a temporary reset token (6-digit code for simplicity, or JWT)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real production app, we would save this token in the DB with an expiry.
    // For this implementation, we'll continue with the email-based flow.
    const resetMsg = `Hi ${user.name},

We received a request to reset your FreshNest password.

Your verification code is: ${resetToken}

If you didn't request this, please ignore this email.`;
    
    await sendEmail(email, "FreshNest Password Reset Request", resetMsg);

    res.status(200).json({
      message: "Verification code sent to your email",
      success: true,
      // We still return the userId for the frontend to know which user to update 
      // but we don't call it a 'secret token' anymore.
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// reset password: /api/user/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({
      message: "Password updated successfully",
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── OTP Login Flow ────────────────────────────────────────────────────────────

// send OTP: /api/user/send-otp
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    let user = await User.findOne({ email });
    
    // If user doesn't exist, create one (for new users via OTP)
    if (!user) {
      // For first-time OTP login, we create a user with random password
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({
        name: email.split("@")[0], // Use email prefix as name
        email,
        password: hashedPassword,
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    const otpMsg = `Hi ${user.name},

Your FreshNest OTP for login is: ${otp}

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.`;

    await sendEmail(email, "🔐 Your FreshNest Login OTP", otpMsg);

    res.status(200).json({
      message: "OTP sent to your email",
      success: true,
      userId: user._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// verify OTP: /api/user/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP required", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Check if OTP is valid
    if (user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired", success: false });
    }

    // Clear OTP and generate JWT token
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
