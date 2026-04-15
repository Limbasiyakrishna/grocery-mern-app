import dotenv from "dotenv";
// Load env variables FIRST before anything else
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { getEmailTransportStatus, initializeTransporter, testEmail } from "./utils/messageService.js";

// -- Route Imports --
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import messageRoutes from "./routes/message.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

// Connect to external services (env already loaded above)
await connectDB();
await connectCloudinary();

// Initialize email service
await initializeTransporter();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// -- Middleware Configuration --
// Define allowed origins for CORS (Cross-Origin Resource Sharing)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  process.env.FRONTEND_URL || "",
].filter(Boolean);



// Enable CORS with credentials for secure cookie-based authentication
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse JSON bodies in requests
app.use(express.json());

// -- API Endpoints --
// Serve static images from uploads directory
app.use("/images", express.static("uploads"));

// Mount API routes
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payment", paymentRoutes);

// Email health endpoint
app.get("/api/email-status", (req, res) => {
  const status = getEmailTransportStatus();
  res.json({ success: true, status });
});

// Test email endpoint (development only)
app.post("/api/test-email", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });
  const sent = await testEmail(email);
  const status = getEmailTransportStatus();
  res.json({
    success: sent,
    message: sent ? `Test email sent to ${email}` : "Failed to send — check server console for details",
    transportStatus: status,
  });
});

// -- Global Error Handling --
app.use((err, req, res, next) => {
  console.error("Unhandled Exception:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on our end",
    success: false,
  });
});

// -- Server Startup --
app.listen(PORT, () => {
  console.log(`[🚀 Server running on port ${PORT}]`);
});
