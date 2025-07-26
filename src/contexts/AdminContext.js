// src/contexts/AdminContext.js
import React, { createContext, useContext, useReducer } from 'react';
import ApiService from '../services/api';

const AdminContext = createContext();

// Admin Action Types
const ADMIN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_STATS: 'SET_STATS',
  SET_USERS: 'SET_USERS',
  SET_TRAINERS: 'SET_TRAINERS',
  SET_SESSIONS: 'SET_SESSIONS',
  SET_PAYMENTS: 'SET_PAYMENTS',
  SET_CONTENT: 'SET_CONTENT',
  SET_REPORTS: 'SET_REPORTS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_TRAINER: 'UPDATE_TRAINER',
  ADD_CONTENT: 'ADD_CONTENT',
  UPDATE_CONTENT: 'UPDATE_CONTENT',
  DELETE_CONTENT: 'DELETE_CONTENT'
};

// Admin Reducer
const adminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ADMIN_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    
    case ADMIN_ACTIONS.SET_USERS:
      return { ...state, users: action.payload };
    
    case ADMIN_ACTIONS.SET_TRAINERS:
      return { ...state, trainers: action.payload };
    
    case ADMIN_ACTIONS.SET_SESSIONS:
      return { ...state, sessions: action.payload };
    
    case ADMIN_ACTIONS.SET_PAYMENTS:
      return { ...state, payments: action.payload };
    
    case ADMIN_ACTIONS.SET_CONTENT:
      return { ...state, content: action.payload };
    
    case ADMIN_ACTIONS.SET_REPORTS:
      return { ...state, reports: action.payload };
    
    case ADMIN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ADMIN_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ADMIN_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    
    case ADMIN_ACTIONS.UPDATE_TRAINER:
      return {
        ...state,
        trainers: state.trainers.map(trainer =>
          trainer.id === action.payload.id ? action.payload : trainer
        )
      };
    
    case ADMIN_ACTIONS.ADD_CONTENT:
      return {
        ...state,
        content: [...state.content, action.payload]
      };
    
    case ADMIN_ACTIONS.UPDATE_CONTENT:
      return {
        ...state,
        content: state.content.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case ADMIN_ACTIONS.DELETE_CONTENT:
      return {
        ...state,
        content: state.content.filter(item => item.id !== action.payload)
      };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  stats: {},
  users: [],
  trainers: [],
  sessions: [],
  payments: [],
  content: [],
  reports: [],
  isLoading: false,
  error: null
};

// Admin Provider
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Stats Functions
  const fetchStats = async () => {
    dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
    try {
      const stats = await ApiService.get('/admin/stats');
      dispatch({ type: ADMIN_ACTIONS.SET_STATS, payload: stats });
      return stats;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // User Management Functions
  const fetchUsers = async (params = {}) => {
    try {
      const users = await ApiService.get('/admin/users', { params });
      dispatch({ type: ADMIN_ACTIONS.SET_USERS, payload: users });
      return users;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const updatedUser = await ApiService.put(`/admin/users/${userId}`, userData);
      dispatch({ type: ADMIN_ACTIONS.UPDATE_USER, payload: updatedUser });
      return updatedUser;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const suspendUser = async (userId, reason) => {
    try {
      const result = await ApiService.post(`/admin/users/${userId}/suspend`, { reason });
      await fetchUsers(); // Refresh users list
      return result;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Trainer Management Functions
  const fetchTrainers = async (params = {}) => {
    try {
      const trainers = await ApiService.get('/admin/trainers', { params });
      dispatch({ type: ADMIN_ACTIONS.SET_TRAINERS, payload: trainers });
      return trainers;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const approveTrainer = async (trainerId) => {
    try {
      const result = await ApiService.post(`/admin/trainers/${trainerId}/approve`);
      await fetchTrainers(); // Refresh trainers list
      return result;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const rejectTrainer = async (trainerId, reason) => {
    try {
      const result = await ApiService.post(`/admin/trainers/${trainerId}/reject`, { reason });
      await fetchTrainers(); // Refresh trainers list
      return result;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Session Management Functions
  const fetchSessions = async (params = {}) => {
    try {
      const sessions = await ApiService.get('/admin/sessions', { params });
      dispatch({ type: ADMIN_ACTIONS.SET_SESSIONS, payload: sessions });
      return sessions;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Payment Management Functions
  const fetchPayments = async (params = {}) => {
    try {
      const payments = await ApiService.get('/admin/payments', { params });
      dispatch({ type: ADMIN_ACTIONS.SET_PAYMENTS, payload: payments });
      return payments;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const processRefund = async (paymentId, amount, reason) => {
    try {
      const result = await ApiService.post(`/admin/payments/${paymentId}/refund`, {
        amount,
        reason
      });
      await fetchPayments(); // Refresh payments list
      return result;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Content Management Functions
  const fetchContent = async (type = 'all', params = {}) => {
    try {
      const content = await ApiService.get(`/admin/content/${type}`, { params });
      dispatch({ type: ADMIN_ACTIONS.SET_CONTENT, payload: content });
      return content;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const createContent = async (contentData) => {
    try {
      const newContent = await ApiService.post('/admin/content', contentData);
      dispatch({ type: ADMIN_ACTIONS.ADD_CONTENT, payload: newContent });
      return newContent;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateContent = async (contentId, contentData) => {
    try {
      const updatedContent = await ApiService.put(`/admin/content/${contentId}`, contentData);
      dispatch({ type: ADMIN_ACTIONS.UPDATE_CONTENT, payload: updatedContent });
      return updatedContent;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteContent = async (contentId) => {
    try {
      await ApiService.delete(`/admin/content/${contentId}`);
      dispatch({ type: ADMIN_ACTIONS.DELETE_CONTENT, payload: contentId });
      return true;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Reports Functions
  const generateReport = async (reportType, params = {}) => {
    try {
      const report = await ApiService.post('/admin/reports/generate', {
        type: reportType,
        ...params
      });
      return report;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchReports = async () => {
    try {
      const reports = await ApiService.get('/admin/reports');
      dispatch({ type: ADMIN_ACTIONS.SET_REPORTS, payload: reports });
      return reports;
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchStats,
    fetchUsers,
    updateUser,
    suspendUser,
    fetchTrainers,
    approveTrainer,
    rejectTrainer,
    fetchSessions,
    fetchPayments,
    processRefund,
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
    generateReport,
    fetchReports,
    clearError
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
