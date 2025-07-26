const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Organize uploads by type
    switch (file.fieldname) {
      case 'profileImage':
      case 'avatar':
        uploadPath += 'profiles/';
        break;
      case 'galleryImages':
      case 'portfolioImages':
        uploadPath += 'gallery/';
        break;
      case 'certificateImages':
        uploadPath += 'certificates/';
        break;
      case 'articleImages':
        uploadPath += 'articles/';
        break;
      case 'eventImages':
        uploadPath += 'events/';
        break;
      case 'gymImages':
        uploadPath += 'gyms/';
        break;
      default:
        uploadPath += 'misc/';
    }
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น (JPG, JPEG, PNG, GIF, WebP, SVG)'));
  }
};

// Create multer instances for different use cases
const createMulterConfig = (options = {}) => {
  return multer({
    storage: storage,
    limits: {
      fileSize: options.maxSize || 5 * 1024 * 1024, // 5MB default
      files: options.maxFiles || 12 // 12 files default
    },
    fileFilter: fileFilter
  });
};

// Pre-configured upload middlewares
const uploadMiddleware = {
  // Single profile image
  single: createMulterConfig({ maxSize: 5 * 1024 * 1024, maxFiles: 1 }).single('profileImage'),
  
  // Multiple gallery images (max 12)
  gallery: createMulterConfig({ maxSize: 5 * 1024 * 1024, maxFiles: 12 }).array('galleryImages', 12),
  
  // Multiple certificate images (max 5)
  certificates: createMulterConfig({ maxSize: 10 * 1024 * 1024, maxFiles: 5 }).array('certificateImages', 5),
  
  // Article images
  articles: createMulterConfig({ maxSize: 3 * 1024 * 1024, maxFiles: 10 }).array('articleImages', 10),
  
  // Event images
  events: createMulterConfig({ maxSize: 5 * 1024 * 1024, maxFiles: 5 }).array('eventImages', 5),
  
  // Gym images
  gyms: createMulterConfig({ maxSize: 5 * 1024 * 1024, maxFiles: 10 }).array('gymImages', 10),
  
  // Mixed fields upload
  mixed: createMulterConfig({ maxSize: 5 * 1024 * 1024, maxFiles: 20 }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 12 },
    { name: 'certificateImages', maxCount: 5 }
  ])
};

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'จำนวนไฟล์เกินขีดจำกัด'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'ชื่อฟิลด์ไฟล์ไม่ถูกต้อง'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
        });
    }
  }
  
  if (err.message.includes('เฉพาะไฟล์รูปภาพ')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

// Utility function to delete files
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Utility function to delete multiple files
const deleteFiles = (filePaths) => {
  const results = [];
  filePaths.forEach(filePath => {
    results.push({
      path: filePath,
      deleted: deleteFile(filePath)
    });
  });
  return results;
};

module.exports = {
  uploadMiddleware,
  handleUploadError,
  deleteFile,
  deleteFiles,
  createMulterConfig
};