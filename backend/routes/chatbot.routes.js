import express from "express";
import { chatWithChef } from "../controller/chatbot.controller.js";

const router = express.Router();

router.post("/", chatWithChef);

export default router;
