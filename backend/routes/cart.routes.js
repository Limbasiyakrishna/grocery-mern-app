import express from "express";
import { 
  updateCart, 
  startCollaboration, 
  joinCollaboration, 
  leaveCollaboration,
  syncCart
} from "../controller/cart.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/update", authUser, updateCart);
router.get("/start", authUser, startCollaboration);
router.post("/join", authUser, joinCollaboration);
router.get("/leave", authUser, leaveCollaboration);
router.get("/sync", authUser, syncCart);

export default router;
