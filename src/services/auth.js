// src/services/auth.js
import ApiService from './api';

class AuthService {
  constructor() {
    this.API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  // Login user
  async login(credentials) {
    try {
      const response = await ApiService.post('/auth/login', credentials);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userRole', response.user.role);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'การเข้าสู่ระบบล้มเหลว');
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await ApiService.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การสมัครสมาชิกล้มเหลว');
    }
  }

  // Register trainer
  async registerTrainer(trainerData) {
    try {
      const response = await ApiService.post('/auth/register-trainer', trainerData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การสมัครเป็นเทรนเนอร์ล้มเหลว');
    }
  }

  // Logout user
  async logout() {
    try {
      await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    }
  }

  // Validate token
  async validateToken(token) {
    try {
      const response = await ApiService.get('/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.user;
    } catch (error) {
      throw new Error('Token ไม่ถูกต้องหรือหมดอายุ');
    }
  }

  // Check authentication status
  async checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    try {
      const user = await this.validateToken(token);
      return user;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      return null;
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const response = await ApiService.post('/auth/reset-password', { email });
      return response;
    } catch (error) {
      throw new Error(error.message || 'การรีเซ็ตรหัสผ่านล้มเหลว');
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await ApiService.put('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การเปลี่ยนรหัสผ่านล้มเหลว');
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await ApiService.post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      throw new Error(error.message || 'การยืนยันอีเมลล้มเหลว');
    }
  }

  // Get current user
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    return token ? { token, userId, userRole } : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Get user role
  getUserRole() {
    return localStorage.getItem('userRole');
  }
}

export const authService = new AuthService();
