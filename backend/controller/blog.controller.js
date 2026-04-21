import Blog from "../models/blog.model.js";

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, category, image, excerpt, content, ingredients } = req.body;
    
    if (!title || !category || !image || !excerpt || !content) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newBlog = new Blog({
      title,
      category,
      image,
      excerpt,
      content,
      ingredients: ingredients || []
    });

    await newBlog.save();
    res.status(201).json({ success: true, message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, image, excerpt, content, ingredients } = req.body;
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, category, image, excerpt, content, ingredients },
      { new: true }
    );
    
    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    res.status(200).json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
