import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Missing chocolate product images to download
const chocolateProducts = [
  { name: 'toblerone_image', query: 'toblerone chocolate' },
  { name: 'dark_chocolate_image', query: 'dark chocolate bar 70 percent' },
];

const ASSETS_PATH = path.join(__dirname, 'src', 'assets');

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
  console.log('Fetching missing chocolate images...\n');
  
  let count = 0;
  for (const product of chocolateProducts) {
    try {
      const searchUrl = `https://source.unsplash.com/400x400/?${product.query.replace(/\s/g, ',')}`;
      await downloadImage(searchUrl, product.name);
      count++;
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`⚠️  Failed to download ${product.name}: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Successfully downloaded ${count} chocolate images!`);
}

fetchAndSaveImages().catch(console.error);
