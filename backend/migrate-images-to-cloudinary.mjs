import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Config
const MONGO_URI = "mongodb://localhost:27017/grocery-app";
cloudinary.config({
  cloud_name: "db5lfdurt",
  api_key: "594495876973875",
  api_secret: "8xvKdDH-vSnyGBT1dFZ8F-kjXxc",
});

// Load mapping
const mapping = JSON.parse(fs.readFileSync("C:\\tmp\\cloudinary-mapping.json", "utf-8"));

// Build a lookup: filename (with or without ext) → Cloudinary URL
const lookup = {};
for (const [filename, url] of Object.entries(mapping)) {
  lookup[filename] = url;
  lookup[filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, "")] = url;
}

// Build Schema
const productSchema = new mongoose.Schema({ image: [String] }, { strict: false });
const Product = mongoose.model("Product", productSchema);

await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB\n");

const products = await Product.find({});
console.log(`Found ${products.length} products\n`);

let updated = 0;
for (const product of products) {
  const newImages = (product.image || []).map((img) => {
    if (img.startsWith("http")) return img; // already a URL
    const resolved = lookup[img] || lookup[img.replace(/\.(png|jpg|jpeg|webp|gif)$/i, "")];
    if (resolved) {
      console.log(`  ✅ ${img} → Cloudinary URL`);
      return resolved;
    }
    console.log(`  ⚠️  No mapping found for: ${img} (keeping as-is)`);
    return img;
  });

  if (JSON.stringify(newImages) !== JSON.stringify(product.image)) {
    await Product.updateOne({ _id: product._id }, { $set: { image: newImages } });
    updated++;
  }
}

console.log(`\n✅ Done! Updated ${updated} products with Cloudinary URLs.`);
await mongoose.disconnect();
