const { body, param, query, validationResult } = require('express-validator');

// Handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Common validation rules
const validateEmail = body('email')
  .isEmail()
  .withMessage('รูปแบบอีเมลไม่ถูกต้อง')
  .normalizeEmail();

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');

const validatePhone = body('phone')
  .optional()
  .isMobilePhone('th-TH')
  .withMessage('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');

const validateRequired = (fieldName, message) => 
  body(fieldName)
    .notEmpty()
    .withMessage(message || `${fieldName} is required`);

// Validation rules for different endpoints
const validateRegister = [
  validateRequired('firstName', 'กรุณากรอกชื่อ'),
  validateRequired('lastName', 'กรุณากรอกนามสกุล'),
  validateEmail,
  validatePassword,
  validatePhone,
  handleValidationErrors
];

const validateLogin = [
  validateEmail,
  validateRequired('password', 'กรุณากรอกรหัสผ่าน'),
  handleValidationErrors
];

const validateTrainerProfile = [
  validateRequired('bio', 'กรุณากรอกประวัติส่วนตัว'),
  body('specialties')
    .isArray({ min: 1 })
    .withMessage('กรุณาเลือกความเชี่ยวชาญอย่างน้อย 1 อย่าง'),
  body('hourlyRate')
    .isNumeric()
    .withMessage('กรุณากรอกอัตราค่าบริการเป็นตัวเลข'),
  handleValidationErrors
];

const validateId = param('id')
  .isNumeric()
  .withMessage('ID must be numeric');

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateTrainerProfile,
  validateId,
  validatePagination,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired
};