// src/services/upload.js
import ApiService from './api';

class UploadService {
  constructor() {
    this.API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  // Upload single file
  async uploadFile(file, options = {}) {
    const {
      onProgress = () => {},
      folder = 'general',
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    } = options;

    // Validate file
    this.validateFile(file, maxSize, allowedTypes);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await ApiService.post('/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      });

      return response;
    } catch (error) {
      throw new Error(error.message || 'การอัปโหลดไฟล์ล้มเหลว');
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, options = {}) {
    const uploads = Array.from(files).map(file => 
      this.uploadFile(file, options)
    );

    try {
      const results = await Promise.all(uploads);
      return results;
    } catch (error) {
      throw new Error(error.message || 'การอัปโหลดไฟล์หลายไฟล์ล้มเหลว');
    }
  }

  // Upload profile image
  async uploadProfileImage(file, userId) {
    return this.uploadFile(file, {
      folder: `profiles/${userId}`,
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
  }

  // Upload workout images
  async uploadWorkoutImages(files, trainerId) {
    return this.uploadMultipleFiles(files, {
      folder: `workouts/${trainerId}`,
      maxSize: 10 * 1024 * 1024, // 10MB per file
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
  }

  // Upload document
  async uploadDocument(file, folder = 'documents') {
    return this.uploadFile(file, {
      folder,
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
    });
  }

  // Delete file
  async deleteFile(fileId) {
    try {
      const response = await ApiService.delete(`/upload/file/${fileId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การลบไฟล์ล้มเหลว');
    }
  }

  // Get file info
  async getFileInfo(fileId) {
    try {
      const response = await ApiService.get(`/upload/file/${fileId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การดึงข้อมูลไฟล์ล้มเหลว');
    }
  }

  // Get user files
  async getUserFiles(userId, folder = null) {
    try {
      const params = folder ? `?folder=${folder}` : '';
      const response = await ApiService.get(`/upload/user/${userId}${params}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การดึงไฟล์ของผู้ใช้ล้มเหลว');
    }
  }

  // Validate file
  validateFile(file, maxSize, allowedTypes) {
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      throw new Error(`ขนาดไฟล์เกิน ${maxSizeMB} MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`ประเภทไฟล์ไม่ถูกต้อง อนุญาตเฉพาะ: ${allowedTypes.join(', ')}`);
    }
  }

  // Resize image client-side (optional utility)
  async resizeImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas size and draw image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(resolve, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const uploadService = new UploadService();
