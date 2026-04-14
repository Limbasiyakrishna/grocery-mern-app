import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail, sendPasswordResetEmail, sendOTPEmail } from "../utils/messageService.js";

/**
 * Registers a new user with email, name, and password
 * @param {Object} req - Express request object containing user data
 * @param {Object} res - Express response object
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
    });

    // Send welcome email asynchronously (fire-and-forget)
    sendWelcomeEmail({
      name,
      email
    }).catch(e => {}); // Silent fail to avoid blocking response

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cartItems: user.cartItems,
        collaborativeCartId: user.collaborativeCartId,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Authenticates a user with email and password
 * @param {Object} req - Express request object containing login credentials
 * @param {Object} res - Express response object
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set authentication cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return success response
    res.status(200).json({
      message: "Successfully logged in",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cartItems: user.cartItems,
        collaborativeCartId: user.collaborativeCartId,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Verifies user authentication status using JWT token
 * @param {Object} req - Express request object with authenticated user ID
 * @param {Object} res - Express response object
 */
export const checkAuth = async (req, res) => {
  try {
    const userId = req.user;

    // Find user and exclude password from response
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Return user data
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Logs out user by clearing authentication cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logout = async (req, res) => {
  try {
    // Clear authentication cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });

    // Return success response
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Initiates password reset by sending verification code to email
 * @param {Object} req - Express request object containing email
 * @param {Object} res - Express response object
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Please provide email", success: false });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store reset code in user document
    user.resetToken = resetCode; // Reusing resetToken field for simplicity in migration
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send password reset email with code
    await sendPasswordResetEmail({
      email,
      resetCode,
      userName: user.name
    });

    // Log code to console for development
    console.log(`[🔑 Reset Service]: Reset code for ${email} is ${resetCode}`);

    // Return success with user ID for frontend
    res.status(200).json({
      message: "Verification code sent to your email",
      success: true,
      userId: user._id
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Resets user password using verification code
 * @param {Object} req - Express request object containing userId and new password
 * @param {Object} res - Express response object
 */
export const resetPassword = async (req, res) => {
  try {
    const { userId, code, newPassword } = req.body;

    // Validate required fields
    if (!userId || !code || !newPassword) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Master Reset Code for development
    const isMasterCode = process.env.NODE_ENV !== "production" && code === "123456";

    // Check if token matches and hasn't expired
    if (!isMasterCode && (user.resetToken !== code || user.resetTokenExpiry < Date.now())) {
      return res.status(400).json({ message: "Invalid or expired verification code", success: false });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    // Return success response
    res.status(200).json({
      message: "Password updated successfully",
      success: true
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Sends OTP (One-Time Password) to user email for login
 * @param {Object} req - Express request object containing email
 * @param {Object} res - Express response object
 */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    // Find or create user for OTP login
    let user = await User.findOne({ email });

    // If user doesn't exist, create one with random password
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({
        name: email.split("@")[0], // Use email prefix as name
        email,
        password: hashedPassword,
      });
    }

    // Generate 6-digit OTP with 10-minute expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.otpCode = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail({
      email,
      otp,
      userName: user.name
    });

    // Log OTP to console for development convenience
    console.log(`[🔑 OTP Service]: Code for ${email} is ${otp}`);

    // Return success with user ID
    res.status(200).json({
      message: "OTP sent to your email",
      success: true,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Verifies OTP and logs in user
 * @param {Object} req - Express request object containing userId and OTP
 * @param {Object} res - Express response object
 */
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // Validate required fields
    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP required", success: false });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Master OTP for development
    const isMasterOtp = process.env.NODE_ENV !== "production" && otp === "123456";

    // Verify OTP code
    if (!isMasterOtp && user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    // Check OTP expiry
    if (!isMasterOtp && new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired", success: false });
    }

    // Clear OTP and generate JWT token
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set authentication cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return success response
    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cartItems: user.cartItems,
        collaborativeCartId: user.collaborativeCartId,
      },
      token,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
