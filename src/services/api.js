/**
 * Main API Service
 * บริการหลักสำหรับเชื่อมต่อ API
 */

import { API_ENDPOINTS, ERROR_MESSAGES, STORAGE_KEYS } from '../utils/constants';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10 seconds
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('token');
  }

  // Set auth token
  setAuthToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem('authToken', token); // For backward compatibility
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
    }
  }

  // Get request headers
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      data = null;
    }

    if (!response.ok) {
      // Handle different HTTP status codes
      switch (response.status) {
        case 401:
          this.setAuthToken(null); // Clear invalid token
          window.location.href = '/signin';
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        case 403:
          throw new Error(ERROR_MESSAGES.FORBIDDEN);
        case 404:
          throw new Error(ERROR_MESSAGES.NOT_FOUND);
        case 422:
          throw new Error(data?.message || ERROR_MESSAGES.VALIDATION_ERROR);
        case 500:
          throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        default:
          throw new Error(data?.message || `HTTP error! status: ${response.status}`);
      }
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const config = {
        headers: this.getHeaders(options.headers),
        signal: controller.signal,
        ...options,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - กรุณาลองใหม่อีกครั้ง');
      }
      
      if (!navigator.onLine) {
        throw new Error('ไม่มีการเชื่อมต่ออินเทอร์เน็ต');
      }
      
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional data to form
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        'Authorization': this.getHeaders()['Authorization'],
      },
    });
  }

  // Download file
  async downloadFile(endpoint, filename) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
}

// Create and export instance
const apiService = new ApiService();

// Export specific API methods
export const authAPI = {
  login: (credentials) => apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => apiService.post(API_ENDPOINTS.AUTH.LOGOUT),
  getProfile: () => apiService.get(API_ENDPOINTS.AUTH.PROFILE),
  refreshToken: () => apiService.post(API_ENDPOINTS.AUTH.REFRESH),
};

export const trainersAPI = {
  getList: (params) => apiService.get(API_ENDPOINTS.TRAINERS.LIST, params),
  getDetail: (id) => apiService.get(API_ENDPOINTS.TRAINERS.DETAIL.replace(':id', id)),
  search: (query) => apiService.get(API_ENDPOINTS.TRAINERS.SEARCH, query),
  getFeatured: () => apiService.get(API_ENDPOINTS.TRAINERS.FEATURED),
};

export const usersAPI = {
  getProfile: () => apiService.get(API_ENDPOINTS.USERS.PROFILE),
  updateProfile: (data) => apiService.put(API_ENDPOINTS.USERS.UPDATE, data),
  uploadAvatar: (file) => apiService.uploadFile(API_ENDPOINTS.USERS.AVATAR, file),
};

export const articlesAPI = {
  getList: (params) => apiService.get(API_ENDPOINTS.ARTICLES.LIST, params),
  getDetail: (id) => apiService.get(API_ENDPOINTS.ARTICLES.DETAIL.replace(':id', id)),
  getCategories: () => apiService.get(API_ENDPOINTS.ARTICLES.CATEGORIES),
};

export const eventsAPI = {
  getList: (params) => apiService.get(API_ENDPOINTS.EVENTS.LIST, params),
  getDetail: (id) => apiService.get(API_ENDPOINTS.EVENTS.DETAIL.replace(':id', id)),
  register: (id, data) => apiService.post(API_ENDPOINTS.EVENTS.REGISTER.replace(':id', id), data),
};

export const gymsAPI = {
  getList: (params) => apiService.get(API_ENDPOINTS.GYMS.LIST, params),
  getDetail: (id) => apiService.get(API_ENDPOINTS.GYMS.DETAIL.replace(':id', id)),
  search: (query) => apiService.get(API_ENDPOINTS.GYMS.SEARCH, query),
};

// Export main service
export default apiService;

// Export individual methods for convenience
export const { get, post, put, patch, delete: del } = apiService;