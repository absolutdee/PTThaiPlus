// src/utils/constants.js
export const APP_CONFIG = {
  APP_NAME: 'PT Thailand Plus',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'แพลตฟอร์มหาเทรนเนอร์ออกกำลังกาย',
  
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  API_TIMEOUT: 30000,
  
  // Authentication
  TOKEN_KEY: 'authToken',
  USER_KEY: 'userData',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRE_TIME: 24 * 60 * 60 * 1000, // 24 hours
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Maps
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  
  // Payment
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PK,
  
  // Social Media
  SOCIAL_LINKS: {
    facebook: 'https://facebook.com/fitconnect',
    instagram: 'https://instagram.com/fitconnect',
    twitter: 'https://twitter.com/fitconnect',
    line: 'https://line.me/ti/p/@fitconnect'
  }
};

export const USER_ROLES = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  CLIENT: 'client'
};

export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

export const WORKOUT_CATEGORIES = [
  { id: 'strength', name: 'ฝึกความแข็งแรง', icon: 'fas fa-dumbbell' },
  { id: 'cardio', name: 'แอโรบิค', icon: 'fas fa-heartbeat' },
  { id: 'flexibility', name: 'ความยืดหยุ่น', icon: 'fas fa-leaf' },
  { id: 'yoga', name: 'โยคะ', icon: 'fas fa-om' },
  { id: 'pilates', name: 'พิลาทิส', icon: 'fas fa-user-circle' },
  { id: 'martial_arts', name: 'ศิลปะการต่อสู้', icon: 'fas fa-fist-raised' },
  { id: 'sports', name: 'กีฬา', icon: 'fas fa-running' },
  { id: 'dance', name: 'เต้นรำ', icon: 'fas fa-music' }
];

export const THAI_PROVINCES = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร',
  'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท',
  'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง',
  'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม',
  'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส',
  'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พังงา', 'พัทลุง',
  'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่',
  'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร',
  'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
  'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ',
  'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม',
  'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย',
  'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู',
  'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี',
  'อุบลราชธานี'
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่',
  SERVER_ERROR: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง',
  UNAUTHORIZED: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
  FORBIDDEN: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
  NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  VALIDATION_ERROR: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
  FILE_TOO_LARGE: 'ขนาดไฟล์เกินกำหนด',
  INVALID_FILE_TYPE: 'ประเภทไฟล์ไม่ถูกต้อง'
};

export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'บันทึกข้อมูลเรียบร้อยแล้ว',
  UPDATE_SUCCESS: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
  DELETE_SUCCESS: 'ลบข้อมูลเรียบร้อยแล้ว',
  UPLOAD_SUCCESS: 'อัปโหลดไฟล์เรียบร้อยแล้ว',
  EMAIL_SENT: 'ส่งอีเมลเรียบร้อยแล้ว',
  BOOKING_SUCCESS: 'จองเซสชั่นเรียบร้อยแล้ว',
  PAYMENT_SUCCESS: 'ชำระเงินเรียบร้อยแล้ว'
};
