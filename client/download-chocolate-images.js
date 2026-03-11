
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chocolate product images to download
const chocolateProducts = [
  { name: 'dairy_milk_image', query: 'dairy milk chocolate bar' },
  { name: 'ferrero_rocher_image', query: 'ferrero rocher chocolate' },
  { name: 'lindt_truffle_image', query: 'lindt truffle chocolate' },
  { name: 'toblerone_image', query: 'toblerone chocolate' },
  { name: 'dark_chocolate_image', query: 'dark chocolate bar' },
];

const UNSPLASH_API_KEY = 'pLbxh0sI0g0VBFv4BfGvqaYvZoJYIKRXzaHljLCrxZI';
const ASSETS_PATH = path.join(__dirname, 'src', 'assets');

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(ASSETS_PATH, `${filename}.png`);
    
    // Ensure directory exists
    if (!fs.existsSync(ASSETS_PATH)) {
      fs.mkdirSync(ASSETS_PATH, { recursive: true });
    }
    
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
  console.log('Starting to fetch chocolate product images...\n');
  
  let count = 0;
  for (const product of chocolateProducts) {
    try {
      const searchUrl = `https://source.unsplash.com/400x400/?${product.query.replace(/\s/g, ',')}`;
      
      await downloadImage(searchUrl, product.name);
      count++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`⚠️  Failed to download ${product.name}: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Successfully downloaded ${count} out of ${chocolateProducts.length} chocolate images!`);
}

fetchAndSaveImages().catch(console.error);

