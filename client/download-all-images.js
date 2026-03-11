import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Images to download
const imagesToDownload = [
  // Products with query
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

  // Chocolates with direct URLs
  { name: 'dairy_milk_image', url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop' },
  { name: 'ferrero_rocher_image', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop' },
  { name: 'lindt_truffle_image', url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop' },
  { name: 'toblerone_image', url: 'https://images.unsplash.com/photo-1551529005-1758a69c0f54?w=400&h=400&fit=crop' },
  { name: 'dark_chocolate_image', url: 'https://images.unsplash.com/photo-1614357196744-5eb73f282849?w=400&h=400&fit=crop' },
  { name: 'kitkat_image', url: 'https://images.unsplash.com/photo-1580955542485-993d1a33c2d4?w=400&h=400&fit=crop' },
  { name: 'snickers_image', url: 'https://images.unsplash.com/photo-1610476145158-0396551a9b6c?w=400&h=400&fit=crop' },
  { name: 'mms_image', url: 'https://images.unsplash.com/photo-1534534605612-123c3b4a46a8?w=400&h=400&fit=crop' },
  { name: 'hersheys_image', url: 'https://images.unsplash.com/photo-1593558919619-93b41794c963?w=400&h=400&fit=crop' },
  { name: 'twix_image', url: 'https://images.unsplash.com/photo-1605793256911-05a43ce16b4a?w=400&h=400&fit=crop' },
];

const ASSETS_PATH = path.join(__dirname, 'src', 'assets');

function downloadImage(url, filename) {
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
  console.log('Starting to fetch product images...\n');
  
  let count = 0;
  for (const imageItem of imagesToDownload) {
    try {
      let imageUrl;
      if (imageItem.url) {
        imageUrl = imageItem.url;
      } else if (imageItem.query) {
        // Using a simple approach with Unsplash source
        imageUrl = `https://source.unsplash.com/400x400/?${imageItem.query.replace(/\s/g, ',')}`;
      } else {
        console.log(`⚠️  Skipping ${imageItem.name}: No URL or query provided.`);
        continue;
      }
      
      await downloadImage(imageUrl, imageItem.name);
      count++;
      
      // Rate limiting to avoid API issues
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`⚠️  Failed to download ${imageItem.name}: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Successfully downloaded ${count} out of ${imagesToDownload.length} images!`);
  console.log('Images are ready to use in your grocery app.');
}

fetchAndSaveImages().catch(console.error);