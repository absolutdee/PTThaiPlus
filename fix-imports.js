/**
 * Script to fix image import paths
 * รันไฟล์นี้เพื่อแก้ไข import paths ทั้งหมด
 */

const fs = require('fs');
const path = require('path');

// Files to fix and their corrections
const fixes = [
  {
    file: 'src/components/main/MainWebsite.js',
    find: [
      "import logo from '../../images/logo-new2020.png';",
      "import logowhite from '../../images/logo-new2020-white.png';"
    ],
    replace: [
      "import { logo } from '../../assets/images';",
      "import { logoWhite as logowhite } from '../../assets/images';"
    ]
  },
  {
    file: 'src/components/main/SignInPage.js',
    find: ["import logo from '../../assets/images/logo.png';"],
    replace: ["import { logo } from '../../assets/images';"]
  },
  {
    file: 'src/components/main/SignUpPage.js',
    find: ["import logo from '../../assets/images/logo.png';"],
    replace: ["import { logo } from '../../assets/images';"]
  },
  {
    file: 'src/components/trainer/TrainerMainDashboard.jsx',
    find: ["import logo from '../../assets/images/logo.png';"],
    replace: ["import { logo } from '../../assets/images';"]
  },
  {
    file: 'src/components/client/MainClientDashboard.jsx',
    find: ["import logo from '../../assets/images/logo.png';"],
    replace: ["import { logo } from '../../assets/images';"]
  },
  {
    file: 'src/components/admin/AdminLayout.jsx',
    find: ["import logo from '../../assets/images/logo.png';"],
    replace: ["import { logo } from '../../assets/images';"]
  }
];

function fixFile(filePath, findTexts, replaceTexts) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    findTexts.forEach((findText, index) => {
      if (content.includes(findText)) {
        content = content.replace(findText, replaceTexts[index]);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Apply all fixes
console.log('🔧 Fixing import paths...\n');

fixes.forEach(fix => {
  fixFile(fix.file, fix.find, fix.replace);
});

console.log('\n✅ Import path fixes completed!');