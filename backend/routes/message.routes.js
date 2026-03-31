import express from "express";
import {
  sendMessage,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
} from "../controller/message.controller.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

// Public – anyone can send a contact message
router.post("/send", sendMessage);

// Protected – seller admin only
router.get("/all", authSeller, getAllMessages);
router.patch("/:id/status", authSeller, updateMessageStatus);
router.delete("/:id", authSeller, deleteMessage);

export default router;
