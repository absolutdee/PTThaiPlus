// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // API call helper with error handling
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const token = localStorage.getItem('authToken');
      const defaultHeaders = {
        'Content-Type': 'application/json',
      };

      if (token && !options.skipAuth) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          ...options.headers
        },
        signal: controller.signal,
        ...options
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Token expired, logout user
        await logout();
        throw new Error('Session expired - please login again');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('authUser');
        const token = localStorage.getItem('authToken');

        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
          
          // Verify token with server
          try {
            await apiCall('/auth/verify');
          } catch (error) {
            console.warn('Token verification failed:', error.message);
            // Token invalid, clear auth data
            localStorage.removeItem('authUser');
            localStorage.removeItem('authToken');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('Authentication check failed');
        // Clear potentially corrupted data
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [apiCall]);

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ email, password })
      });

      if (response.success && response.user && response.token) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName || response.user.first_name,
          lastName: response.user.lastName || response.user.last_name,
          role: response.user.role,
          avatar: response.user.avatar,
          isVerified: response.user.isVerified || response.user.is_verified,
          createdAt: response.user.createdAt || response.user.created_at
        };

        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', response.token);

        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify(userData)
      });

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      // Call logout endpoint if token exists
      const token = localStorage.getItem('authToken');
      if (token) {
        await apiCall('/auth/logout', {
          method: 'POST'
        }).catch(err => {
          console.warn('Logout API call failed:', err.message);
          // Continue with local logout even if API fails
        });
      }
    } catch (error) {
      console.warn('Logout error:', error.message);
    } finally {
      // Clear local storage and state
      setUser(null);
      setError(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
      setLoading(false);
    }
  }, [apiCall]);

  // Update user profile
  const updateProfile = useCallback(async (updateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (response.success && response.user) {
        const updatedUser = { ...user, ...response.user };
        setUser(updatedUser);
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, apiCall]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall('/auth/forgot-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ email })
      });

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Reset password
  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall('/auth/reset-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ token, newPassword })
      });

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Context value
  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    hasRole,
    
    // Utils
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;