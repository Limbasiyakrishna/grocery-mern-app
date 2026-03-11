import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product images to download from Unsplash
const products = [
  { name: 'potato_1', query: 'potato vegetable' },
  { name: 'tomato_image', query: 'tomato fresh' },
  { name: 'carrot_image', query: 'carrot vegetable' },
  { name: 'spinach', query: 'spinach green leafy' },
  { name: 'onion', query: 'fresh onion' },
  { name: 'apple_image', query: 'red apple fruit' },
  { name: 'orange_image', query: 'orange fruit citrus' },
  { name: 'banana', query: 'banana fruit yellow' },
  { name: 'mango', query: 'mango tropical fruit' },
  { name: 'grapes', query: 'purple grapes' },
  { name: 'amul_milk_image', query: 'milk bottle dairy' },
  { name: 'paneer_image', query: 'paneer cheese' },
  { name: 'eggs_image', query: 'brown eggs' },
  { name: 'cheese_image', query: 'cheddar cheese block' },
  { name: 'coca_cola_image', query: 'coca cola bottle' },
  { name: 'pepsi_image', query: 'pepsi bottle' },
  { name: 'sprite', query: 'sprite lemon bottle' },
  { name: 'fanta', query: 'orange fanta bottle' },
  { name: 'seven_up', query: 'seven up bottle' },
  { name: 'basmati_rice_image', query: 'basmati rice' },
  { name: 'wheat_flour_image', query: 'wheat flour bag' },
  { name: 'quinoa_image', query: 'quinoa grains' },
  { name: 'brown_rice_image', query: 'brown rice' },
  { name: 'barley_image', query: 'barley grains' },
  { name: 'brown_bread_image', query: 'brown bread loaf' },
  { name: 'butter_croissant_image', query: 'butter croissant pastry' },
  { name: 'chocolate_cake_image', query: 'chocolate cake' },
  { name: 'whole_wheat_bread_image', query: 'whole wheat bread' },
  { name: 'vanilla_muffins_image', query: 'vanilla muffin' },
  { name: 'maggi_image', query: 'instant noodles' },
  { name: 'top_ramen_image', query: 'ramen noodles' },
  { name: 'knorr_soup_image', query: 'instant soup cup' },
  { name: 'yippee_image', query: 'instant noodles asian' },
  { name: 'maggi_oats_image', query: 'oats breakfast cereal' },
];

const UNSPLASH_API_KEY = 'pLbxh0sI0g0VBFv4BfGvqaYvZoJYIKRXzaHljLCrxZI'; // Free tier API key (demo)
const ASSETS_PATH = path.join(__dirname, '..', 'src', 'assets');

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(ASSETS_PATH, `${filename}.png`);
    
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}.png`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filePath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function fetchAndSaveImages() {
  console.log('Starting to fetch product images from Unsplash...\n');
  
  let count = 0;
  for (const product of products) {
    try {
      // Using a simple approach with Unsplash
      const searchUrl = `https://source.unsplash.com/400x400/?${product.query.replace(/\s/g, ',')}`;
      
      await downloadImage(searchUrl, product.name);
      count++;
      
      // Rate limiting to avoid API issues
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`⚠️  Failed to download ${product.name}: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Successfully downloaded ${count} out of ${products.length} images!`);
  console.log('Images are ready to use in your grocery app.');
}

fetchAndSaveImages().catch(console.error);
