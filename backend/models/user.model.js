import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: { type: Object, default: {} },
    collaborativeCartId: { type: String, default: null },
    // OTP Fields for login
    otpCode: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    // Password reset fields
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
