# PTThaiPlus

## 📋 คำอธิบายโปรเจค

FitConnect เป็นแพลตฟอร์มครบวงจรสำหรับการเชื่อมต่อระหว่างเทรนเนอร์ออกกำลังกายมืออาชีพกับลูกค้าที่ต้องการออกกำลังกาย โดยมีฟีเจอร์ครบถ้วนตั้งแต่การค้นหาเทรนเนอร์ การจองเซสชั่น การติดตามความก้าวหน้า ไปจนถึงระบบการชำระเงินและการจัดการโภชนาการ

## 🌟 ฟีเจอร์หลัก

### เว็บไซต์หลัก
- 🏠 หน้าแรกพร้อม Hero Banner และเทรนเนอร์แนะนำ
- 🔍 ระบบค้นหาเทรนเนอร์ขั้นสูงพร้อมตัวกรอง
- 📍 ค้นหายิมและฟิตเนสจากแผนที่
- 📚 ระบบบทความและข่าวสาร
- 🎉 การจัดการอีเว้นท์และกิจกรรม
- 📞 หน้าติดต่อเราพร้อมฟอร์ม

### ระบบเทรนเนอร์
- 📊 แดชบอร์ดภาพรวมผลการดำเนินงาน
- 👥 จัดการข้อมูลลูกค้าและโปรไฟล์
- 📅 ระบบตารางการเทรนและนัดหมาย
- 🏋️ สร้างและจัดการแผนการออกกำลังกาย
- 🥗 ระบบจัดการโภชนาการและแผนอาหาร
- 📈 ติดตามความก้าวหน้าของลูกค้า
- 💬 ระบบแชทแบบเรียลไทม์
- 💰 แดshบอร์ดการเงินและรายได้
- ⚙️ การตั้งค่าโปรไฟล์และแพคเกจ
- 🎫 ระบบคูปองและส่วนลด

### ระบบลูกค้า
- 🏠 แดชบอร์ดส่วนตัวและภาพรวม
- 🏋️ แผนการเทรนและคำแนะนำ
- 📅 ตารางเซสชั่นและการนัดหมาย
- 📈 ติดตามความก้าวหน้าส่วนตัว
- 🥗 แผนโภชนาการและการนับแคลอรี่
- 💬 แชทกับเทรนเนอร์
- ⭐ ระบบรีวิวและให้คะแนน
- 🏆 ระบบความสำเร็จและเหรียญ
- 🔔 การแจ้งเตือน
- 💳 ประวัติการชำระเงินและแพคเกจ

### ระบบแอดมิน
- 📊 แดชบอร์ดภาพรวมระบบ
- 👥 จัดการสมาชิกและเทรนเนอร์
- 📝 จัดการเนื้อหาและบทความ
- 🎪 จัดการอีเว้นท์และกิจกรรม
- 🏢 จัดการยิมและพาร์ทเนอร์
- ⭐ จัดการรีวิวและความคิดเห็น
- 🖼️ จัดการสื่อและไฟล์
- 💰 ระบบการเงินและการเรียกเก็บเงิน
- 📋 จัดการเซสชั่นทั้งหมด
- 📊 ระบบรายงานและสถิติ
- 🎧 ระบบซัพพอร์ตลูกค้า
- ⚙️ การตั้งค่าระบบทั่วไป

## 🛠 เทคโนโลยีที่ใช้

### Frontend
- **React 18+** - Library หลักสำหรับสร้าง UI
- **React Router v6** - การจัดการ routing
- **Bootstrap 5** - CSS Framework
- **SCSS** - CSS Preprocessor
- **Lucide React** - Icon Library
- **Recharts** - Data Visualization

### State Management
- **React Context** - Global State Management
- **React Hooks** - Local State Management

### Build Tools
- **Create React App** - Build และ Development Tools
- **Webpack** - Module Bundler
- **Babel** - JavaScript Compiler

### PWA Support
- **Service Worker** - Offline Support
- **Web App Manifest** - PWA Configuration

## 🚀 การติดตั้งและรันโปรเจค

### ความต้องการของระบบ
- Node.js 16.0.0 หรือใหม่กว่า
- npm 8.0.0 หรือใหม่กว่า

### การติดตั้ง

1. **Clone Repository**
```bash
git clone https://github.com/your-username/fitconnect-frontend.git
cd fitconnect-frontend
```

2. **ติดตั้ง Dependencies**
```bash
npm install
```

3. **ตั้งค่า Environment Variables**
```bash
cp .env.example .env
```
แก้ไขไฟล์ `.env` ตามความต้องการ

4. **รันโปรเจค**
```bash
npm start
```

5. **เปิดเบราว์เซอร์**
ไปที่ `http://localhost:3000`

### Commands อื่นๆ

```bash
# Build สำหรับ Production
npm run build

# รัน Tests
npm test

# รัน Linting
npm run lint

# แก้ไข Linting Issues
npm run lint:fix

# Format Code
npm run format

# รัน Build และ Serve
npm run build:dev
```

## 📁 โครงสร้างโปรเจค

```
fitconnect-frontend/
├── public/                 # Static Files
│   ├── manifest.json      # PWA Manifest
│   ├── sw.js             # Service Worker
│   └── index.html        # HTML Template
├── src/
│   ├── components/       # React Components
│   │   ├── common/      # Common Components
│   │   ├── main/        # Main Website
│   │   ├── trainer/     # Trainer Dashboard
│   │   ├── client/      # Client Dashboard
│   │   ├── admin/       # Admin Dashboard
│   │   ├── payment/     # Payment Components
│   │   └── mobile/      # Mobile Components
│   ├── contexts/        # React Contexts
│   ├── hooks/           # Custom Hooks
│   ├── services/        # API Services
│   ├── utils/           # Utility Functions
│   ├── styles/          # SCSS Files
│   ├── assets/          # Images, Icons
│   ├── App.js          # Main App Component
│   └── index.js        # Entry Point
├── package.json        # Project Configuration
└── README.md          # Documentation
```

## 🎨 การใช้งานและฟีเจอร์

### สำหรับลูกค้า
1. **สมัครสมาชิก** - สร้างบัญชีใหม่
2. **ค้นหาเทรนเนอร์** - ใช้ตัวกรองหาเทรนเนอร์ที่เหมาะสม
3. **เลือกแพคเกจ** - เลือกแพคเกจที่ต้องการ
4. **ชำระเงิน** - ชำระผ่านบัตรเครดิตหรือ PromptPay
5. **เริ่มเทรน** - นัดหมายและเริ่มการออกกำลังกาย

### สำหรับเทรนเนอร์
1. **สมัครเป็นเทรนเนอร์** - ส่งใบสมัครและรอการอนุมัติ
2. **ตั้งค่าโปรไฟล์** - เพิ่มข้อมูล ประสบการณ์ และแพคเกจ
3. **จัดการลูกค้า** - รับลูกค้าและสร้างแผนการเทรน
4. **ติดตามผล** - บันทึกและติดตามความก้าวหน้า
5. **รับรายได้** - รับเงินจากการให้บริการ

### สำหรับแอดมิน
1. **จัดการระบบ** - ดูแลผู้ใช้และเทรนเนอร์
2. **อนุมัติเทรนเนอร์** - ตรวจสอบและอนุมัติเทรนเนอร์ใหม่
3. **จัดการเนื้อหา** - เพิ่มบทความและอีเว้นท์
4. **ดูรายงาน** - ติดตามสถิติและประสิทธิภาพ

## 🔧 การกำหนดค่า

### Environment Variables

สร้างไฟล์ `.env` ใน root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Payment Configuration
REACT_APP_STRIPE_PK=pk_test_your_stripe_public_key

# Maps Configuration
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Firebase Configuration (Optional)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

### Theme Configuration

ระบบรองรับ Dark Mode และ Light Mode โดยสามารถกำหนดสีได้ที่:

```scss
// src/styles/variables.scss
:root {
  --primary: #232956;
  --secondary: #df2528;
  // ... other colors
}
```

## 📱 Mobile Support

- ✅ Responsive Design สำหรับทุกขนาดหน้าจอ
- ✅ Mobile Navigation
- ✅ Touch Gestures (Swipe)
- ✅ Pull to Refresh
- ✅ PWA Support
- ✅ Offline Capabilities

## 🔐 Security Features

- JWT Authentication
- Role-based Access Control
- Input Validation
- XSS Protection
- CSRF Protection
- Secure Payment Processing

## 🧪 Testing

```bash
# รัน Unit Tests
npm test

# รัน Tests พร้อม Coverage
npm run test:coverage

# รัน E2E Tests (หากมี)
npm run test:e2e
```

## 📦 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Various Platforms

```bash
# Deploy to Netlify
netlify deploy --prod --dir=build

# Deploy to Vercel
vercel --prod

# Deploy to Firebase Hosting
firebase deploy
```

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📄 License

โปรเจคนี้อยู่ภายใต้ MIT License - ดู [LICENSE](LICENSE) สำหรับรายละเอียด

## 👥 ทีมพัฒนา

- **Frontend Developer** - [Your Name](https://github.com/yourusername)
- **Backend Developer** - [Team Member](https://github.com/teammember)
- **UI/UX Designer** - [Designer Name](https://github.com/designer)

## 📞 ติดต่อ

- **Email**: info@fitconnect.com
- **Website**: https://fitconnect.com
- **Facebook**: https://facebook.com/fitconnect
- **Instagram**: https://instagram.com/fitconnect

---

**FitConnect** - เชื่อมต่อคุณกับการออกกำลังกายที่ใช่ 💪
