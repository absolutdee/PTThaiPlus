/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Thai phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid Thai phone number
 */
const isValidThaiPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Thai mobile numbers: 08x-xxx-xxxx or 09x-xxx-xxxx
  const mobileRegex = /^0[689]\d{8}$/;
  
  // Thai landline numbers: 02-xxx-xxxx, 03x-xxx-xxxx, etc.
  const landlineRegex = /^0[2-7]\d{7,8}$/;
  
  return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      message: 'กรุณากรอกรหัสผ่าน'
    };
  }
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  // Calculate score
  if (checks.length) score += 2;
  if (checks.lowercase) score += 1;
  if (checks.uppercase) score += 1;
  if (checks.number) score += 1;
  if (checks.special) score += 1;
  
  let message = '';
  let isValid = score >= 4;
  
  if (score < 2) {
    message = 'รหัสผ่านอ่อนแอมาก';
  } else if (score < 4) {
    message = 'รหัสผ่านอ่อนแอ';
  } else if (score < 5) {
    message = 'รหัสผ่านปานกลาง';
  } else {
    message = 'รหัสผ่านแข็งแรง';
  }
  
  return {
    isValid,
    score,
    message,
    checks
  };
};

/**
 * Validate Thai ID card number
 * @param {string} idCard - ID card number to validate
 * @returns {boolean} Is valid Thai ID card
 */
const isValidThaiIdCard = (idCard) => {
  if (!idCard || typeof idCard !== 'string') return false;
  
  // Remove all non-digit characters
  const cleaned = idCard.replace(/\D/g, '');
  
  // Must be 13 digits
  if (cleaned.length !== 13) return false;
  
  // Check digit algorithm
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * (13 - i);
  }
  
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(cleaned.charAt(12));
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate age range
 * @param {string|Date} birthDate - Birth date
 * @param {number} minAge - Minimum age
 * @param {number} maxAge - Maximum age
 * @returns {object} Validation result
 */
const validateAge = (birthDate, minAge = 13, maxAge = 100) => {
  if (!birthDate) {
    return {
      isValid: false,
      message: 'กรุณาระบุวันเกิด'
    };
  }
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  if (birth > today) {
    return {
      isValid: false,
      message: 'วันเกิดไม่สามารถเป็นวันในอนาคต'
    };
  }
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return {
      isValid: false,
      message: `อายุต้องไม่น้อยกว่า ${minAge} ปี`
    };
  }
  
  if (age > maxAge) {
    return {
      isValid: false,
      message: `อายุต้องไม่เกิน ${maxAge} ปี`
    };
  }
  
  return {
    isValid: true,
    age
  };
};

/**
 * Validate price range
 * @param {number} price - Price to validate
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @returns {object} Validation result
 */
const validatePrice = (price, min = 0, max = 1000000) => {
  if (!price && price !== 0) {
    return {
      isValid: false,
      message: 'กรุณาระบุราคา'
    };
  }
  
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return {
      isValid: false,
      message: 'ราคาต้องเป็นตัวเลข'
    };
  }
  
  if (numPrice < min) {
    return {
      isValid: false,
      message: `ราคาต้องไม่น้อยกว่า ${min} บาท`
    };
  }
  
  if (numPrice > max) {
    return {
      isValid: false,
      message: `ราคาต้องไม่เกิน ${max} บาท`
    };
  }
  
  return {
    isValid: true,
    price: numPrice
  };
};

/**
 * Validate file upload
 * @param {object} file - File object
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;
  
  if (!file) {
    return {
      isValid: false,
      message: 'กรุณาเลือกไฟล์'
    };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      message: `ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${Math.round(maxSize / 1024 / 1024)}MB)`
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      message: 'ประเภทไฟล์ไม่ได้รับอนุญาต'
    };
  }
  
  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      isValid: false,
      message: 'นามสกุลไฟล์ไม่ได้รับอนุญาต'
    };
  }
  
  return {
    isValid: true
  };
};

/**
 * Sanitize input string
 * @param {string} input - Input string to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input, options = {}) => {
  if (!input || typeof input !== 'string') return '';
  
  const {
    allowHtml = false,
    maxLength = 1000,
    trim = true
  } = options;
  
  let sanitized = input;
  
  if (trim) {
    sanitized = sanitized.trim();
  }
  
  if (!allowHtml) {
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    sanitized = sanitized
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

module.exports = {
  isValidEmail,
  isValidThaiPhone,
  validatePassword,
  isValidThaiIdCard,
  isValidUrl,
  validateAge,
  validatePrice,
  validateFileUpload,
  sanitizeInput
};