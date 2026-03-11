import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Verify credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary credentials are missing in environment variables");
    }

    console.log("Cloudinary configured successfully");
  } catch (error) {
    console.error("⚠️ Cloudinary configuration error:", error.message);
    console.log("NOTE: Cloudinary will be needed for image uploads. Please verify your credentials.");
  }
};

export default cloudinary;
