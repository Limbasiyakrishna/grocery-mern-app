import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import { connectCloudinary } from "./config/cloudinary.js";

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize External Services
await connectCloudinary();

// -- Middelwares --
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "http://localhost:5175", 
  process.env.FRONTEND_URL || ""
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// -- API Endpoints --
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payment", paymentRoutes);

// -- Global Error Handling --
app.use((err, req, res, next) => {
  console.error("Unhandle Exception:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on our end",
    success: false
  });
});

// -- Server Startup --
app.listen(PORT, () => {
  connectDB();
  console.log(`[🚀 Server running on port ${PORT}]`);
});
