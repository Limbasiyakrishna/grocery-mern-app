import User from "../models/user.model.js";
import SharedCart from "../models/sharedCart.model.js";
import mongoose from "mongoose";

// Helper to generate a unique room ID
const generateRoomId = () => Math.random().toString(36).substring(2, 9).toUpperCase();

/**
 * updateCart
 * Updates the cart. If the user is in a collaboration room, it updates the SharedCart.
 * Otherwise, it updates the User document.
 */
export const updateCart = async (req, res) => {
  try {
    const userId = req.user;
    const { cartItems } = req.body;

    const user = await User.findById(userId);
    if (user.collaborativeCartId) {
      // Update Shared Cart
      await SharedCart.findOneAndUpdate(
        { roomId: user.collaborativeCartId },
        { items: cartItems },
        { new: true }
      );
    } else {
      // Update individual user cart
      await User.findByIdAndUpdate(userId, { cartItems });
    }

    res.status(200).json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * startCollaboration
 * Sets up a room for the user.
 */
export const startCollaboration = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (user.collaborativeCartId) {
      return res.status(200).json({ 
        success: true, 
        roomId: user.collaborativeCartId,
        message: "Already in a room" 
      });
    }

    const roomId = generateRoomId();
    const newSharedCart = new SharedCart({
      roomId,
      items: user.cartItems || {},
      participants: [userId]
    });
    await newSharedCart.save();

    user.collaborativeCartId = roomId;
    await user.save();

    res.status(201).json({ success: true, roomId, message: "Room created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * joinCollaboration
 * Join a room via roomId.
 */
export const joinCollaboration = async (req, res) => {
  try {
    const userId = req.user;
    const { roomId } = req.body;

    const sharedCart = await SharedCart.findOne({ roomId: roomId.toUpperCase() });
    if (!sharedCart) {
      return res.status(404).json({ success: false, message: "Invalid Room ID" });
    }

    // Update user
    await User.findByIdAndUpdate(userId, { 
      collaborativeCartId: roomId.toUpperCase(),
      // Optionally merge current cart? For simplicity, we just adopt the shared one
      cartItems: sharedCart.items 
    });

    // Cast userId string to ObjectId for proper comparison with participants array
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const alreadyJoined = sharedCart.participants.some(
      (p) => p.toString() === userId
    );
    if (!alreadyJoined) {
      sharedCart.participants.push(userObjectId);
      await sharedCart.save();
    }

    res.status(200).json({ 
      success: true, 
      cartItems: sharedCart.items, 
      message: "Joined successfully",
      participantCount: sharedCart.participants.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * leaveCollaboration
 * Exit the shared room.
 */
export const leaveCollaboration = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    
    if (user.collaborativeCartId) {
      // Cast to ObjectId so $pull matches correctly against ObjectId array
      const userObjectId = new mongoose.Types.ObjectId(userId);
      await SharedCart.findOneAndUpdate(
        { roomId: user.collaborativeCartId },
        { $pull: { participants: userObjectId } }
      );
      user.collaborativeCartId = null;
      await user.save();
    }

    res.status(200).json({ success: true, message: "Left collaboration" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * syncCart
 * Fetches the latest shared items if the user is in a room.
 */
export const syncCart = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (user.collaborativeCartId) {
      const sharedCart = await SharedCart.findOne({ roomId: user.collaborativeCartId });
      if (sharedCart) {
        return res.status(200).json({ 
          success: true, 
          cartItems: sharedCart.items, 
          isShared: true,
          participantCount: sharedCart.participants.length
        });
      }
    }

    res.status(200).json({ success: true, cartItems: user.cartItems, isShared: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
