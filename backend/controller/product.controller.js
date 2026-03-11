import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

// Helper: upload a buffer to Cloudinary and return the secure URL
const uploadToCloudinary = (buffer, folder = "grocery-mern-app/products") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    // Upload every image buffer to Cloudinary in parallel
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    if (!name || !price || !offerPrice || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    // Description may arrive as a JSON array string OR a plain comma-separated string
    let descriptionArray;
    try {
      const parsed = JSON.parse(description);
      descriptionArray = Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      descriptionArray = String(description)
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const product = new Product({
      name,
      price: Number(price),
      offerPrice: Number(offerPrice),
      description: descriptionArray,
      category,
      image: imageUrls,   // ← Cloudinary CDN URLs
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({ success: false, message: "Server error while adding product" });
  }
};

// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// change stock  :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
