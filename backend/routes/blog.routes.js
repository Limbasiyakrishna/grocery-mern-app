import express from "express";
import { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
} from "../controller/blog.controller.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

// Public routes
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);

// Protected routes (Only sellers/admins can manage)
router.post("/add", authSeller, createBlog);
router.put("/update/:id", authSeller, updateBlog);
router.delete("/delete/:id", authSeller, deleteBlog);

export default router;
