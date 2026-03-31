import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: false, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    channel: { type: String, enum: ["email", "sms", "both"], default: "email" },
    status: { type: String, enum: ["unread", "read", "replied"], default: "unread" },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
