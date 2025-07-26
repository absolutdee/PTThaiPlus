const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateBuildInfo() {
  try {
    console.log('📋 Generating build info...');
    
    const buildInfo = {
      version: process.env.REACT_APP_VERSION || '1.0.0',
      buildTime: new Date().toISOString(),
      environment: process.env.REACT_APP_ENV || 'development',
      nodeVersion: process.version,
      commit: getGitCommit(),
      branch: getGitBranch(),
      buildNumber: process.env.BUILD_NUMBER || 'local'
    };

    const buildInfoPath = path.join(__dirname, '../public/build-info.json');
    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
    
    console.log('✅ Build info generated at public/build-info.json');
    console.log(`📦 Version: ${buildInfo.version}`);
    console.log(`🌟 Environment: ${buildInfo.environment}`);
    console.log(`📅 Build Time: ${buildInfo.buildTime}`);
    
  } catch (error) {
    console.error('❌ Error generating build info:', error.message);
  }
}

function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    return 'unknown';
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    return 'unknown';
  }
}

if (require.main === module) {
  generateBuildInfo();
}

module.exports = generateBuildInfo;