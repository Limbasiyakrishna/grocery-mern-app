import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { getEmailTransportStatus, initializeTransporter } from "./utils/messageService.js";

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

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to external services
await connectCloudinary();

// Initialize email service
await initializeTransporter();

// -- Middleware Configuration --
// Define allowed origins for CORS (Cross-Origin Resource Sharing)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL || ""
].filter(Boolean); // Filter out empty strings

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

// -- Global Error Handling --
// Catch-all middleware for unhandled errors
app.use((err, req, res, next) => {
  console.error("Unhandled Exception:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on our end",
    success: false
  });
});

// -- Server Startup --
// Start the server and connect to the database
app.listen(PORT, () => {
  connectDB();
  console.log(`[🚀 Server running on port ${PORT}]`);
});
