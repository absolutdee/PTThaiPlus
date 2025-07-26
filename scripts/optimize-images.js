const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const path = require('path');
const fs = require('fs').promises;

async function optimizeImages() {
  try {
    console.log('🖼️  Optimizing images...');
    
    const inputDir = path.join(__dirname, '../src/assets/images');
    const outputDir = path.join(__dirname, '../public/images/optimized');

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Check if input directory exists
    try {
      await fs.access(inputDir);
    } catch (error) {
      console.log('ℹ️  No images directory found, skipping optimization');
      return;
    }

    // Convert images to WebP
    const files = await imagemin([`${inputDir}/**/*.{jpg,jpeg,png}`], {
      destination: outputDir,
      plugins: [
        imageminWebp({
          quality: 80,
          method: 6
        })
      ]
    });

    console.log(`✅ Optimized ${files.length} images to WebP format`);
    
    // Also copy original files for fallback
    const originalFiles = await imagemin([`${inputDir}/**/*.{jpg,jpeg,png}`], {
      destination: outputDir,
      plugins: []
    });

    console.log(`✅ Copied ${originalFiles.length} original images`);
    console.log('🎉 Image optimization completed');
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error.message);
  }
}

if (require.main === module) {
  optimizeImages();
}

module.exports = optimizeImages;