/**
 * Application Constants
 * ค่าคงที่ต่างๆ ที่ใช้ในแอพพลิเคชัน
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  TRAINERS: {
    LIST: '/trainers',
    DETAIL: '/trainers/:id',
    SEARCH: '/trainers/search',
    FEATURED: '/trainers/featured',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    AVATAR: '/users/avatar',
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    DETAIL: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
  },
  ARTICLES: {
    LIST: '/articles',
    DETAIL: '/articles/:id',
    CATEGORIES: '/articles/categories',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: '/events/:id',
    REGISTER: '/events/:id/register',
  },
  GYMS: {
    LIST: '/gyms',
    DETAIL: '/gyms/:id',
    SEARCH: '/gyms/search',
  }
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'FitConnect',
  VERSION: '1.0.0',
  DESCRIPTION: 'เชื่อมต่อคุณกับการออกกำลังกายที่ใช่',
  AUTHOR: 'FitConnect Team',
  HOMEPAGE: 'https://absolutdee.github.io/PTThaiPlus',
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#232956',
  SECONDARY: '#df2528',
  SUCCESS: '#28a745',
  WARNING: '#ffc107',
  DANGER: '#dc3545',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40',
  WHITE: '#ffffff',
  GOLD: '#ffd700',
};

// User Roles
export const USER_ROLES = {
  CLIENT: 'client',
  TRAINER: 'trainer',
  ADMIN: 'admin',
};

// Trainer Specialties
export const TRAINER_SPECIALTIES = {
  WEIGHT_TRAINING: 'weight_training',
  CARDIO: 'cardio',
  YOGA: 'yoga',
  PILATES: 'pilates',
  CROSSFIT: 'crossfit',
  BOXING: 'boxing',
  FUNCTIONAL: 'functional',
  NUTRITION: 'nutrition',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  CART: 'cart',
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DEBOUNCE_DELAY: 300,
  REQUEST_TIMEOUT: 10000,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
  UNAUTHORIZED: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
  FORBIDDEN: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
  NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  VALIDATION_ERROR: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
  SERVER_ERROR: 'เกิดข้อผิดพลาดในระบบ กรุณาติดต่อผู้ดูแลระบบ',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'เข้าสู่ระบบสำเร็จ',
  REGISTER_SUCCESS: 'สมัครสมาชิกสำเร็จ',
  UPDATE_SUCCESS: 'อัปเดตข้อมูลสำเร็จ',
  DELETE_SUCCESS: 'ลบข้อมูลสำเร็จ',
  BOOKING_SUCCESS: 'จองเซสชั่นสำเร็จ',
  PAYMENT_SUCCESS: 'ชำระเงินสำเร็จ',
};

const constants = {
  API_ENDPOINTS,
  APP_CONFIG,
  COLORS,
  USER_ROLES,
  TRAINER_SPECIALTIES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  STORAGE_KEYS,
  DEFAULTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};

export default constants;