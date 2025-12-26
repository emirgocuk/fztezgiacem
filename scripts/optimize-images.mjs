import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  // Convert main profile image to WebP
  const inputImage = join(publicDir, '2-pp.jpg');
  const outputWebP = join(publicDir, '2-pp.webp');

  try {
    // Generate WebP with high quality
    await sharp(inputImage)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputWebP);

    console.log('✅ Converted 2-pp.jpg to WebP format');

    // Generate responsive sizes for srcset
    const sizes = [
      { width: 512, suffix: '-512w' },
      { width: 768, suffix: '-768w' },
      { width: 1024, suffix: '-1024w' },
    ];

    for (const size of sizes) {
      const outputFile = join(publicDir, `2-pp${size.suffix}.webp`);
      await sharp(inputImage)
        .resize(size.width, size.width, { fit: 'cover' })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputFile);

      console.log(`✅ Created responsive image: 2-pp${size.suffix}.webp`);
    }

    // Get file size comparisons
    const fs = await import('fs');
    const originalSize = fs.statSync(inputImage).size;
    const webpSize = fs.statSync(outputWebP).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

    console.log(`\n📊 Optimization Results:`);
    console.log(`   Original JPG: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   WebP: ${(webpSize / 1024).toFixed(1)} KB`);
    console.log(`   Savings: ${savings}%\n`);

    console.log('✨ Image optimization complete!');
  } catch (error) {
    console.error('❌ Error during image optimization:', error);
    process.exit(1);
  }
}

optimizeImages();
