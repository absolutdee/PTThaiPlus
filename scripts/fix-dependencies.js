const { execSync } = require('child_process');
const fs = require('fs');

const fixDependencies = () => {
  console.log('🔧 Fixing dependency issues...\n');
  
  try {
    // Remove node_modules and package-lock
    console.log('🗑️  Removing node_modules...');
    if (fs.existsSync('node_modules')) {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    }
    
    if (fs.existsSync('package-lock.json')) {
      fs.unlinkSync('package-lock.json');
      console.log('🗑️  Removed package-lock.json');
    }
    
    // Clear npm cache
    console.log('🧹 Clearing npm cache...');
    execSync('npm cache clean --force', { stdio: 'inherit' });
    
    // Install specific versions
    console.log('📦 Installing dependencies...');
    const dependencies = [
      'express@4.18.2',
      'cors@2.8.5', 
      'dotenv@16.0.3',
      'mysql2@3.6.0',
      'bcryptjs@2.4.3',
      'jsonwebtoken@9.0.0'
    ];
    
    execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
    
    // Install dev dependencies
    execSync('npm install -D nodemon@3.0.1', { stdio: 'inherit' });
    
    console.log('\n✅ Dependencies fixed successfully!');
    console.log('💡 Now try: npm run dev');
    
  } catch (error) {
    console.error('❌ Failed to fix dependencies:', error.message);
    console.log('\n🛠️  Manual fix:');
    console.log('1. Delete node_modules folder');
    console.log('2. Delete package-lock.json');
    console.log('3. Run: npm install express cors dotenv mysql2 bcryptjs jsonwebtoken');
    console.log('4. Run: npm install -D nodemon');
  }
};

if (require.main === module) {
  fixDependencies();
}

module.exports = fixDependencies;