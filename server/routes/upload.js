const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { uploadMiddleware, handleUploadError, deleteFile, deleteFiles } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all upload routes
router.use(authenticateToken);

// @route   POST /api/upload/profile
// @desc    Upload profile image
// @access  Private
router.post('/profile', uploadMiddleware.single, handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    
    // In real app, save file info to database
    const fileInfo = {
      id: Date.now(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'อัปโหลดรูปโปรไฟล์สำเร็จ',
      data: fileInfo
    });

  } catch (error) {
    console.error('Upload profile error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    });
  }
});

// @route   POST /api/upload/gallery
// @desc    Upload gallery images
// @access  Private
router.post('/gallery', uploadMiddleware.gallery, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/gallery/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: `อัปโหลดรูปภาพสำเร็จ ${req.files.length} ไฟล์`,
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    });
  }
});

// @route   POST /api/upload/certificates
// @desc    Upload certificate images
// @access  Private (Trainer)
router.post('/certificates', uploadMiddleware.certificates, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์ใบรับรอง'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/certificates/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString(),
      verified: false // Admin needs to verify certificates
    }));

    res.json({
      success: true,
      message: `อัปโหลดใบรับรองสำเร็จ ${req.files.length} ไฟล์`,
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    });
  }
});

// @route   POST /api/upload/articles
// @desc    Upload article images
// @access  Private (Admin/Editor)
router.post('/articles', uploadMiddleware.articles, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/articles/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: `อัปโหลดรูปภาพบทความสำเร็จ ${req.files.length} ไฟล์`,
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload articles error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    });
  }
});

// @route   POST /api/upload/events
// @desc    Upload event images
// @access  Private (Admin)
router.post('/events', uploadMiddleware.events, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/events/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: `อัปโหลดรูปภาพอีเว้นท์สำเร็จ ${req.files.length} ไฟล์`,
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload events error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    });
  }
});

// @route   POST /api/upload/gyms
// @desc    Upload gym images
// @access  Private (Admin/Gym Owner)
router.post('/gyms', uploadMiddleware.gyms, handleUploadError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาเลือกไฟล์รูปภาพ'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/gyms/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user.userId,
      uploadedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: `อัปโหลดรูปภาพยิมสำเร็จ ${req.files.length} ไฟล์`,
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload gyms error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    });
  }
});

// @route   POST /api/upload/mixed
// @desc    Upload mixed file types
// @access  Private
router.post('/mixed', uploadMiddleware.mixed, handleUploadError, (req, res) => {
  try {
    const uploadedFiles = {};

    // Process different file types
    Object.keys(req.files).forEach(fieldname => {
      uploadedFiles[fieldname] = req.files[fieldname].map(file => ({
        id: Date.now() + Math.random(),
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        url: `/uploads/${file.path.split('/')[1]}/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
        uploadedBy: req.user.userId,
        uploadedAt: new Date().toISOString()
      }));
    });

    const totalFiles = Object.values(uploadedFiles).reduce((sum, files) => sum + files.length, 0);

    res.json({
      success: true,
      message: `อัปโหลดไฟล์สำเร็จ ${totalFiles} ไฟล์`,
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload mixed error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
    });
  }
});

// @route   DELETE /api/upload/file/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/file/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const { folder = 'misc' } = req.query;

    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อไฟล์ไม่ถูกต้อง'
      });
    }

    const filePath = path.join(__dirname, '../uploads', folder, filename);

    // Check if file exists and belongs to user (in real app)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบไฟล์ที่ระบุ'
      });
    }

    const deleted = deleteFile(filePath);

    if (deleted) {
      res.json({
        success: true,
        message: 'ลบไฟล์สำเร็จ'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบไฟล์'
      });
    }

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบไฟล์'
    });
  }
});

// @route   DELETE /api/upload/files
// @desc    Delete multiple files
// @access  Private
router.delete('/files', (req, res) => {
  try {
    const { filenames, folder = 'misc' } = req.body;

    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุรายชื่อไฟล์ที่ต้องการลบ'
      });
    }

    // Validate all filenames
    for (const filename of filenames) {
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({
          success: false,
          message: 'ชื่อไฟล์ไม่ถูกต้อง'
        });
      }
    }

    const filePaths = filenames.map(filename => 
      path.join(__dirname, '../uploads', folder, filename)
    );

    const results = deleteFiles(filePaths);
    const deletedCount = results.filter(r => r.deleted).length;

    res.json({
      success: true,
      message: `ลบไฟล์สำเร็จ ${deletedCount} จาก ${filenames.length} ไฟล์`,
      data: results
    });

  } catch (error) {
    console.error('Delete files error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบไฟล์'
    });
  }
});

// @route   GET /api/upload/files
// @desc    Get user's uploaded files
// @access  Private
router.get('/files', (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      folder,
      search
    } = req.query;

    // In real app, get files from database based on user
    const mockFiles = [
      {
        id: 1,
        originalName: 'profile-photo.jpg',
        filename: 'profileImage-1234567890-123456789.jpg',
        url: '/uploads/profiles/profileImage-1234567890-123456789.jpg',
        size: 256789,
        mimetype: 'image/jpeg',
        folder: 'profiles',
        uploadedAt: '2024-07-26T10:00:00Z'
      },
      {
        id: 2,
        originalName: 'gym-photo1.jpg',
        filename: 'galleryImages-1234567891-123456789.jpg',
        url: '/uploads/gallery/galleryImages-1234567891-123456789.jpg',
        size: 512345,
        mimetype: 'image/jpeg',
        folder: 'gallery',
        uploadedAt: '2024-07-25T15:30:00Z'
      }
    ];

    let filteredFiles = [...mockFiles];

    if (folder) {
      filteredFiles = filteredFiles.filter(f => f.folder === folder);
    }

    if (search) {
      filteredFiles = filteredFiles.filter(f => 
        f.originalName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedFiles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredFiles.length / parseInt(limit)),
        total: filteredFiles.length
      }
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์'
    });
  }
});

module.exports = router;