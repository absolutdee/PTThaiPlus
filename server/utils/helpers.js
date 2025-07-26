const crypto = require('crypto');
const path = require('path');

/**
 * Generate random string
 * @param {number} length - Length of random string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format Thai phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
const formatThaiPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Thai mobile numbers
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  // Format Thai landline numbers
  if (cleaned.length === 9 && cleaned.startsWith('02')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
};

/**
 * Calculate age from birth date
 * @param {string|Date} birthDate - Birth date
 * @returns {number} Age in years
 */
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format currency in Thai Baht
 * @param {number} amount - Amount in THB
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '฿0';
  
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date to Thai format
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
const formatThaiDate = (date, options = {}) => {
  const {
    includeTime = false,
    short = false
  } = options;

  const d = new Date(date);
  
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const thaiMonthsShort = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const day = d.getDate();
  const month = short ? thaiMonthsShort[d.getMonth()] : thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543; // Buddhist Era

  let formatted = `${day} ${month} ${year}`;

  if (includeTime) {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    formatted += ` ${hours}:${minutes} น.`;
  }

  return formatted;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Slugify string for URLs
 * @param {string} text - Text to slugify
 * @returns {string} Slugified string
 */
const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace Thai characters
    .replace(/[ก-๙]/g, (match) => {
      const thaiToEng = {
        'ก': 'g', 'ข': 'k', 'ค': 'k', 'ง': 'ng',
        'จ': 'j', 'ฉ': 'ch', 'ช': 'ch', 'ซ': 's', 'ฌ': 'ch', 'ญ': 'y',
        'ด': 'd', 'ต': 't', 'ถ': 't', 'ท': 't', 'ธ': 't', 'น': 'n',
        'บ': 'b', 'ป': 'p', 'ผ': 'p', 'ฝ': 'f', 'พ': 'p', 'ฟ': 'f', 'ภ': 'p', 'ม': 'm',
        'ย': 'y', 'ร': 'r', 'ล': 'l', 'ว': 'w',
        'ศ': 's', 'ษ': 's', 'ส': 's', 'ห': 'h',
        'อ': 'o', 'ฮ': 'h'
      };
      return thaiToEng[match] || match;
    })
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Paginate array
 * @param {Array} array - Array to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {object} Pagination result
 */
const paginate = (array, page = 1, limit = 10) => {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = array.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      current: parseInt(page),
      pages: totalPages,
      total: totalItems,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

/**
 * Deep clone object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(deepClone);
  
  const cloned = {};
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key]);
  });
  
  return cloned;
};

/**
 * Escape HTML characters
 * @param {string} unsafe - Unsafe HTML string
 * @returns {string} Safe HTML string
 */
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generate file URL
 * @param {string} filename - File name
 * @param {string} folder - Folder name
 * @returns {string} Full file URL
 */
const generateFileUrl = (filename, folder = 'misc') => {
  if (!filename) return '';
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

/**
 * Check if file is image
 * @param {string} filename - File name
 * @returns {boolean} Is image file
 */
const isImageFile = (filename) => {
  if (!filename) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const ext = path.extname(filename).toLowerCase();
  
  return imageExtensions.includes(ext);
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
const truncate = (text, length = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.substring(0, length).trim() + suffix;
};

module.exports = {
  generateRandomString,
  generateUniqueId,
  formatThaiPhone,
  calculateAge,
  formatCurrency,
  formatThaiDate,
  calculateDistance,
  slugify,
  paginate,
  deepClone,
  escapeHtml,
  generateFileUrl,
  isImageFile,
  formatFileSize,
  capitalize,
  truncate
};