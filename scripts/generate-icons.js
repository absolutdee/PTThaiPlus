const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputIcon = path.join(__dirname, '../public/logo512.png');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    console.log('🎨 Generating PWA icons...');
    
    // Create icons directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Check if input icon exists
    try {
      await fs.access(inputIcon);
    } catch (error) {
      console.error('❌ Source icon not found at:', inputIcon);
      console.log('Please make sure you have a logo512.png file in the public directory');
      return;
    }

    // Generate icons for each size
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputIcon)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated icon: ${size}x${size}`);
    }

    // Generate favicon
    const faviconPath = path.join(__dirname, '../public/favicon.ico');
    await sharp(inputIcon)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));

    console.log('✅ PWA icons generated successfully');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
  }
}

if (require.main === module) {
  generateIcons();
}

module.exports = generateIcons;
