import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Helper function to upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer data
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<string>} Secure URL of uploaded image
 */
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

/**
 * Adds a new product with images uploaded to Cloudinary
 * @param {Object} req - Express request object with product data and files
 * @param {Object} res - Express response object
 */
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;

    // Validate that images are provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    // Upload all images to Cloudinary in parallel
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    // Validate required fields
    if (!name || !price || !offerPrice || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    // Parse description - can be JSON array or comma-separated string
    let descriptionArray;
    try {
      const parsed = JSON.parse(description);
      descriptionArray = Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      // Fallback to splitting by comma or newline
      descriptionArray = String(description)
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Create new product
    const product = new Product({
      name,
      price: Number(price),
      offerPrice: Number(offerPrice),
      description: descriptionArray,
      category,
      image: imageUrls,   // Cloudinary CDN URLs
    });

    // Save to database
    const savedProduct = await product.save();

    // Return success response
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

/**
 * Retrieves all products from database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Retrieves a single product by ID
 * @param {Object} req - Express request object with product ID in params
 * @param {Object} res - Express response object
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Updates the stock status of a product
 * @param {Object} req - Express request object with product ID and stock status
 * @param {Object} res - Express response object
 */
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    // Update product stock status
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    // Return updated product
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
