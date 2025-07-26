const fs = require('fs').promises;
const path = require('path');

async function postBuild() {
  try {
    console.log('🔧 Running post-build processing...');
    
    const buildDir = path.join(__dirname, '../build');
    
    // Check if build directory exists
    try {
      await fs.access(buildDir);
    } catch (error) {
      console.error('❌ Build directory not found');
      return;
    }

    // Generate service worker for PWA
    await generateServiceWorker();
    
    // Create robots.txt
    await createRobotsTxt();
    
    // Create sitemap.xml
    await createSitemap();
    
    console.log('✅ Post-build processing completed');
    
  } catch (error) {
    console.error('❌ Error in post-build processing:', error.message);
  }
}

async function generateServiceWorker() {
  const swContent = `
// FitConnect Service Worker
const CACHE_NAME = 'fitconnect-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      }
    )
  );
});
  `.trim();

  const swPath = path.join(__dirname, '../build/sw.js');
  await fs.writeFile(swPath, swContent);
  console.log('✅ Service worker generated');
}

async function createRobotsTxt() {
  const robotsContent = `
User-agent: *
Allow: /

Sitemap: ${process.env.REACT_APP_DOMAIN || 'https://fitconnect.com'}/sitemap.xml
  `.trim();

  const robotsPath = path.join(__dirname, '../build/robots.txt');
  await fs.writeFile(robotsPath, robotsContent);
  console.log('✅ robots.txt created');
}

async function createSitemap() {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.REACT_APP_DOMAIN || 'https://fitconnect.com'}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${process.env.REACT_APP_DOMAIN || 'https://fitconnect.com'}/trainers</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${process.env.REACT_APP_DOMAIN || 'https://fitconnect.com'}/articles</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  const sitemapPath = path.join(__dirname, '../build/sitemap.xml');
  await fs.writeFile(sitemapPath, sitemapContent);
  console.log('✅ sitemap.xml created');
}

if (require.main === module) {
  postBuild();
}

module.exports = postBuild;