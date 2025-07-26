// src/utils/validators.js
export const validateRequired = (value, fieldName = 'ฟิลด์') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}จำเป็นต้องกรอก`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'อีเมลจำเป็นต้องกรอก';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'รูปแบบอีเมลไม่ถูกต้อง';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'รหัสผ่านจำเป็นต้องกรอก';
  
  if (password.length < 6) {
    return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
  }
  
  if (password.length > 128) {
    return 'รหัสผ่านต้องไม่เกิน 128 ตัวอักษร';
  }
  
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'กรุณายืนยันรหัสผ่าน';
  
  if (password !== confirmPassword) {
    return 'รหัสผ่านไม่ตรงกัน';
  }
  
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'เบอร์โทรศัพท์จำเป็นต้องกรอก';
  
  const phoneRegex = /^[0-9]{10}$/;
  const cleanPhone = phone.replace(/[-\s]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
  }
  
  return null;
};

export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) return null; // Optional field
  
  try {
    new URL(url);
    return null;
  } catch {
    return `${fieldName} ไม่ถูกต้อง`;
  }
};

export const validateNumber = (value, fieldName = 'ตัวเลข', min, max) => {
  if (!value && value !== 0) return `${fieldName}จำเป็นต้องกรอก`;
  
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName}ต้องเป็นตัวเลข`;
  }
  
  if (min !== undefined && num < min) {
    return `${fieldName}ต้องมากกว่าหรือเท่ากับ ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `${fieldName}ต้องน้อยกว่าหรือเท่ากับ ${max}`;
  }
  
  return null;
};

export const validateFileSize = (file, maxSizeInMB = 10) => {
  if (!file) return 'กรุณาเลือกไฟล์';
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return `ขนาดไฟล์ต้องไม่เกิน ${maxSizeInMB} MB`;
  }
  
  return null;
};

export const validateFileType = (file, allowedTypes = []) => {
  if (!file) return 'กรุณาเลือกไฟล์';
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `ประเภทไฟล์ไม่ถูกต้อง อนุญาตเฉพาะ: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'กรุณาเลือกวันที่';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) {
    return 'วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด';
  }
  
  return null;
};

export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const error = rule(value, field);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
