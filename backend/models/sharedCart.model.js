import mongoose from "mongoose";

const sharedCartSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: Object,
      default: {},
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { minimize: false, timestamps: true }
);

const SharedCart = mongoose.model("SharedCart", sharedCartSchema);
export default SharedCart;
