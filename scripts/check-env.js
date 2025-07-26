const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_NAME',
  'REACT_APP_VERSION'
];

const optionalEnvVars = [
  'REACT_APP_GOOGLE_MAPS_API_KEY',
  'REACT_APP_GOOGLE_ANALYTICS_ID'
];

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '../.env');
  const envLocalPath = path.join(__dirname, '../.env.local');
  
  if (!fs.existsSync(envPath) && !fs.existsSync(envLocalPath)) {
    console.warn('⚠️  No .env file found. Creating from .env.example...');
    
    const envExamplePath = path.join(__dirname, '../.env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Created .env file from .env.example');
    } else {
      console.error('❌ .env.example file not found');
      process.exit(1);
    }
  }

  // Check required environment variables
  const missingVars = [];
  const warningVars = [];

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      warningVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease add these variables to your .env file');
    process.exit(1);
  }

  if (warningVars.length > 0) {
    console.warn('⚠️  Optional environment variables not set:');
    warningVars.forEach(varName => {
      console.warn(`   - ${varName}`);
    });
  }

  console.log('✅ Environment variables check passed');
}

checkEnvironmentVariables();
