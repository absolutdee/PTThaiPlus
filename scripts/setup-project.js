const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const setupProject = async () => {
  console.log('🚀 Setting up FitConnect project...\n');
  
  try {
    // 1. Create necessary directories
    console.log('📁 Creating project directories...');
    const directories = [
      'database',
      'server',
      'server/config',
      'server/models', 
      'server/routes',
      'server/middleware',
      'server/controllers',
      'server/utils',
      'uploads',
      'uploads/profiles',
      'uploads/trainers',
      'uploads/articles',
      'uploads/events',
      'logs',
      'scripts'
    ];
    
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  ✅ Created: ${dir}`);
      }
    });
    
    // 2. Create .env file if not exists
    if (!fs.existsSync('.env')) {
      console.log('\n📋 Creating .env file...');
      const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=fitconnect_db
DB_USERNAME=root
DB_PASSWORD=
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=fitconnect-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=development
PORT=3001

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
`;
      
      fs.writeFileSync('.env', envContent);
      console.log('  ✅ .env file created');
    }
    
    // 3. Check if package.json exists
    if (!fs.existsSync('package.json')) {
      console.log('\n📦 Initializing npm project...');
      execSync('npm init -y', { stdio: 'inherit' });
    }
    
    // 4. Install required dependencies
    console.log('\n📦 Installing dependencies...');
    const dependencies = [
      'express',
      'cors', 
      'dotenv',
      'mysql2',
      'sequelize',
      'bcryptjs',
      'jsonwebtoken',
      'express-validator',
      'multer',
      'moment'
    ];
    
    const devDependencies = [
      'nodemon'
    ];
    
    try {
      execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
      console.log('  ✅ Dependencies installed');
      
      execSync(`npm install -D ${devDependencies.join(' ')}`, { stdio: 'inherit' });
      console.log('  ✅ Dev dependencies installed');
    } catch (error) {
      console.log('  ⚠️  Failed to install some dependencies. You may need to install them manually.');
    }
    
    // 5. Update package.json scripts
    console.log('\n⚙️  Updating package.json scripts...');
    try {
      const packageJsonPath = 'package.json';
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      packageJson.scripts = {
        ...packageJson.scripts,
        "start": "node server/index.js",
        "dev": "nodemon server/index.js",
        "migrate": "node database/migrate.js",
        "seed": "node database/seed.js",
        "db:setup": "npm run migrate && npm run seed",
        "setup": "node scripts/setup-project.js"
      };
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('  ✅ Package.json scripts updated');
    } catch (error) {
      console.log('  ⚠️  Could not update package.json scripts');
    }
    
    console.log('\n🎉 Project setup completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure MySQL is running (XAMPP Control Panel)');
    console.log('   2. Run: npm run db:setup');
    console.log('   3. Run: npm run dev');
    console.log('   4. Visit: http://localhost:3001/api/health');
    
    console.log('\n🔑 Test accounts will be created:');
    console.log('   Admin: admin@fitconnect.com / admin123');
    console.log('   Trainer: john.trainer@fitconnect.com / admin123');
    console.log('   Customer: somchai@example.com / admin123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupProject();
}

module.exports = setupProject;