import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: "db5lfdurt",
  api_key: "594495876973875",
  api_secret: "8xvKdDH-vSnyGBT1dFZ8F-kjXxc",
});

const uploadsDir = "C:\\Users\\admin\\Downloads\\grocery-mern-app-main\\backend\\uploads";
const files = fs.readdirSync(uploadsDir).filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));

console.log(`📦 Found ${files.length} images to upload...\n`);

const results = {};

for (const file of files) {
  const filePath = path.join(uploadsDir, file);
  const publicId = path.basename(file, path.extname(file));
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "grocery-mern-app/products",
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    results[file] = result.secure_url;
    console.log(`✅ ${file}`);
    console.log(`   → ${result.secure_url}`);
  } catch (err) {
    console.error(`❌ Failed: ${file} → ${err.message}`);
  }
}

console.log("\n\n📋 All done! Saving mapping...");
fs.writeFileSync("C:\\tmp\\cloudinary-mapping.json", JSON.stringify(results, null, 2));
console.log("✅ Mapping saved to C:\\tmp\\cloudinary-mapping.json");
