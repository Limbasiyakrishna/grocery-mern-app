import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["Latest News", "Cooking Tips", "Health & Wellness"] 
  },
  image: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  ingredients: [{ type: String }], // Optional, used for Cooking Tips to add to cart
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
