const fs = require('fs');
const path = require('path');

const createServerStructure = () => {
  console.log('🔧 Creating server directory structure...\n');

  const directories = [
    'server',
    'server/models',
    'server/routes', 
    'server/middleware',
    'server/controllers',
    'server/utils',
    'server/config',
    'uploads',
    'uploads/profiles',
    'uploads/trainers',
    'uploads/articles',
    'uploads/events',
    'logs'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } else {
      console.log(`⚪ Directory exists: ${dir}`);
    }
  });

  console.log('\n🎉 Server structure created successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Copy model and route files from artifacts');
  console.log('   2. Make sure .env is configured properly');
  console.log('   3. Run: npm run dev');
};

if (require.main === module) {
  createServerStructure();
}

module.exports = createServerStructure;