// contexts/TrainerContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import ApiService from '../services/api';

// Initial State
const initialState = {
  // Loading states
  loading: false,
  clientsLoading: false,
  scheduleLoading: false,
  error: null,
  
  // Dashboard data
  dashboard: null,
  stats: {
    totalClients: 0,
    todaySessions: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
    upcomingSessions: 0,
    activeClients: 0,
    completionRate: 0
  },
  todaySchedule: [],
  
  // Core data
  clients: [],
  schedule: [],
  revenue: {},
  reviews: [],
  coupons: [],
  activeCoupons: [],
  conversations: [],
  profile: null,
  packages: [],
  
  // Computed values
  unreadCount: 0,
  totalReviews: 0,
  averageRating: 0
};

// Action Types
const actionTypes = {
  // Loading actions
  SET_LOADING: 'SET_LOADING',
  SET_CLIENTS_LOADING: 'SET_CLIENTS_LOADING',
  SET_SCHEDULE_LOADING: 'SET_SCHEDULE_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Data actions
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_CLIENTS: 'SET_CLIENTS',
  ADD_CLIENT: 'ADD_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  REMOVE_CLIENT: 'REMOVE_CLIENT',
  SET_SCHEDULE: 'SET_SCHEDULE',
  SET_REVENUE: 'SET_REVENUE',
  SET_REVIEWS: 'SET_REVIEWS',
  SET_COUPONS: 'SET_COUPONS',
  SET_CONVERSATIONS: 'SET_CONVERSATIONS',
  SET_PROFILE: 'SET_PROFILE',
  SET_PACKAGES: 'SET_PACKAGES',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT'
};

// Reducer
const trainerReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case actionTypes.SET_CLIENTS_LOADING:
      return { ...state, clientsLoading: action.payload };
      
    case actionTypes.SET_SCHEDULE_LOADING:
      return { ...state, scheduleLoading: action.payload };
      
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
      
    case actionTypes.SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboard: action.payload.dashboard,
        stats: action.payload.stats,
        todaySchedule: action.payload.todaySchedule,
        loading: false
      };
      
    case actionTypes.SET_CLIENTS:
      return {
        ...state,
        clients: action.payload,
        clientsLoading: false,
        stats: {
          ...state.stats,
          totalClients: action.payload.length,
          activeClients: action.payload.filter(c => c.status === 'active').length
        }
      };
      
    case actionTypes.ADD_CLIENT:
      const newClients = [...state.clients, action.payload];
      return {
        ...state,
        clients: newClients,
        stats: {
          ...state.stats,
          totalClients: newClients.length,
          activeClients: newClients.filter(c => c.status === 'active').length
        }
      };
      
    case actionTypes.UPDATE_CLIENT:
      const updatedClients = state.clients.map(client =>
        client.id === action.payload.id ? action.payload : client
      );
      return {
        ...state,
        clients: updatedClients,
        stats: {
          ...state.stats,
          activeClients: updatedClients.filter(c => c.status === 'active').length
        }
      };
      
    case actionTypes.REMOVE_CLIENT:
      const filteredClients = state.clients.filter(client => client.id !== action.payload);
      return {
        ...state,
        clients: filteredClients,
        stats: {
          ...state.stats,
          totalClients: filteredClients.length,
          activeClients: filteredClients.filter(c => c.status === 'active').length
        }
      };
      
    case actionTypes.SET_SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
        scheduleLoading: false,
        stats: {
          ...state.stats,
          pendingBookings: action.payload.filter(s => s.status === 'pending').length
        }
      };
      
    case actionTypes.SET_REVENUE:
      return { ...state, revenue: action.payload };
      
    case actionTypes.SET_REVIEWS:
      const reviews = action.payload;
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      return {
        ...state,
        reviews,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10
      };
      
    case actionTypes.SET_COUPONS:
      const activeCoupons = action.payload.filter(coupon => coupon.isActive && coupon.isValid);
      return {
        ...state,
        coupons: action.payload,
        activeCoupons
      };
      
    case actionTypes.SET_CONVERSATIONS:
      const unreadCount = action.payload.reduce((count, conv) => 
        count + (conv.unreadCount || 0), 0
      );
      return {
        ...state,
        conversations: action.payload,
        unreadCount
      };
      
    case actionTypes.SET_PROFILE:
      return { ...state, profile: action.payload };
      
    case actionTypes.SET_PACKAGES:
      return { ...state, packages: action.payload };
      
    case actionTypes.UPDATE_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
      
    default:
      return state;
  }
};

// Context
const TrainerContext = createContext();

// Provider Component
export const TrainerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(trainerReducer, initialState);

  // Helper function to handle errors
  const handleError = useCallback((error, customMessage) => {
    console.error(customMessage || 'An error occurred:', error);
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: customMessage || error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
    });
  }, []);

  // Actions
  const actions = {
    // Clear error
    clearError: useCallback(() => {
      dispatch({ type: actionTypes.CLEAR_ERROR });
    }, []),

    // Load dashboard data
    loadDashboardData: useCallback(async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      try {
        const data = await ApiService.getDashboardData();
        dispatch({ type: actionTypes.SET_DASHBOARD_DATA, payload: data });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดข้อมูล Dashboard ได้');
      }
    }, [handleError]),

    // Load clients
    loadClients: useCallback(async () => {
      dispatch({ type: actionTypes.SET_CLIENTS_LOADING, payload: true });
      try {
        const clients = await ApiService.getClients();
        dispatch({ type: actionTypes.SET_CLIENTS, payload: clients });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดข้อมูลลูกค้าได้');
        dispatch({ type: actionTypes.SET_CLIENTS_LOADING, payload: false });
      }
    }, [handleError]),

    // Add client
    addClient: useCallback(async (clientData) => {
      try {
        const newClient = await ApiService.addClient(clientData);
        dispatch({ type: actionTypes.ADD_CLIENT, payload: newClient });
        return newClient;
      } catch (error) {
        handleError(error, 'ไม่สามารถเพิ่มลูกค้าได้');
        throw error;
      }
    }, [handleError]),

    // Update client
    updateClient: useCallback(async (clientId, clientData) => {
      try {
        const updatedClient = await ApiService.updateClient(clientId, clientData);
        dispatch({ type: actionTypes.UPDATE_CLIENT, payload: updatedClient });
        return updatedClient;
      } catch (error) {
        handleError(error, 'ไม่สามารถอัพเดทข้อมูลลูกค้าได้');
        throw error;
      }
    }, [handleError]),

    // Remove client
    removeClient: useCallback(async (clientId) => {
      try {
        await ApiService.removeClient(clientId);
        dispatch({ type: actionTypes.REMOVE_CLIENT, payload: clientId });
      } catch (error) {
        handleError(error, 'ไม่สามารถลบลูกค้าได้');
        throw error;
      }
    }, [handleError]),

    // Load schedule
    loadSchedule: useCallback(async (date) => {
      dispatch({ type: actionTypes.SET_SCHEDULE_LOADING, payload: true });
      try {
        const schedule = await ApiService.getSchedule(date);
        dispatch({ type: actionTypes.SET_SCHEDULE, payload: schedule });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดตารางเทรนได้');
        dispatch({ type: actionTypes.SET_SCHEDULE_LOADING, payload: false });
      }
    }, [handleError]),

    // Create session
    createSession: useCallback(async (sessionData) => {
      try {
        const newSession = await ApiService.createSession(sessionData);
        // Reload schedule after creating session
        const date = new Date(sessionData.date).toISOString().split('T')[0];
        await actions.loadSchedule(date);
        return newSession;
      } catch (error) {
        handleError(error, 'ไม่สามารถสร้างเซสชันได้');
        throw error;
      }
    }, [handleError]),

    // Update session
    updateSession: useCallback(async (sessionId, sessionData) => {
      try {
        const updatedSession = await ApiService.updateSession(sessionId, sessionData);
        // Reload schedule after updating session
        const date = new Date(sessionData.date).toISOString().split('T')[0];
        await actions.loadSchedule(date);
        return updatedSession;
      } catch (error) {
        handleError(error, 'ไม่สามารถอัพเดทเซสชันได้');
        throw error;
      }
    }, [handleError]),

    // Load revenue
    loadRevenue: useCallback(async () => {
      try {
        const revenue = await ApiService.getRevenue();
        dispatch({ type: actionTypes.SET_REVENUE, payload: revenue });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดข้อมูลรายได้ได้');
      }
    }, [handleError]),

    // Load reviews
    loadReviews: useCallback(async () => {
      try {
        const reviews = await ApiService.getReviews();
        dispatch({ type: actionTypes.SET_REVIEWS, payload: reviews });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดรีวิวได้');
      }
    }, [handleError]),

    // Respond to review
    respondToReview: useCallback(async (reviewId, response) => {
      try {
        await ApiService.respondToReview(reviewId, response);
        // Reload reviews after responding
        await actions.loadReviews();
      } catch (error) {
        handleError(error, 'ไม่สามารถตอบกลับรีวิวได้');
        throw error;
      }
    }, [handleError]),

    // Load coupons
    loadCoupons: useCallback(async () => {
      try {
        const coupons = await ApiService.getCoupons();
        dispatch({ type: actionTypes.SET_COUPONS, payload: coupons });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดคูปองได้');
      }
    }, [handleError]),

    // Create coupon
    createCoupon: useCallback(async (couponData) => {
      try {
        await ApiService.createCoupon(couponData);
        // Reload coupons after creating
        await actions.loadCoupons();
      } catch (error) {
        handleError(error, 'ไม่สามารถสร้างคูปองได้');
        throw error;
      }
    }, [handleError]),

    // Update coupon
    updateCoupon: useCallback(async (couponId, couponData) => {
      try {
        await ApiService.updateCoupon(couponId, couponData);
        // Reload coupons after updating
        await actions.loadCoupons();
      } catch (error) {
        handleError(error, 'ไม่สามารถอัพเดทคูปองได้');
        throw error;
      }
    }, [handleError]),

    // Delete coupon
    deleteCoupon: useCallback(async (couponId) => {
      try {
        await ApiService.deleteCoupon(couponId);
        // Reload coupons after deleting
        await actions.loadCoupons();
      } catch (error) {
        handleError(error, 'ไม่สามารถลบคูปองได้');
        throw error;
      }
    }, [handleError]),

    // Toggle coupon
    toggleCoupon: useCallback(async (couponId, isActive) => {
      try {
        await ApiService.toggleCoupon(couponId, isActive);
        // Reload coupons after toggling
        await actions.loadCoupons();
      } catch (error) {
        handleError(error, 'ไม่สามารถเปลี่ยนสถานะคูปองได้');
        throw error;
      }
    }, [handleError]),

    // Load conversations
    loadConversations: useCallback(async () => {
      try {
        const conversations = await ApiService.getConversations();
        dispatch({ type: actionTypes.SET_CONVERSATIONS, payload: conversations });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดข้อความได้');
      }
    }, [handleError]),

    // Update unread count
    updateUnreadCount: useCallback(async () => {
      try {
        const count = await ApiService.updateUnreadCount();
        dispatch({ type: actionTypes.UPDATE_UNREAD_COUNT, payload: count });
      } catch (error) {
        console.warn('Failed to update unread count:', error);
      }
    }, []),

    // Load profile
    loadProfile: useCallback(async () => {
      try {
        const profile = await ApiService.getProfile();
        dispatch({ type: actionTypes.SET_PROFILE, payload: profile });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
      }
    }, [handleError]),

    // Update profile
    updateProfile: useCallback(async (profileData) => {
      try {
        const updatedProfile = await ApiService.updateProfile(profileData);
        dispatch({ type: actionTypes.SET_PROFILE, payload: updatedProfile });
        return updatedProfile;
      } catch (error) {
        handleError(error, 'ไม่สามารถอัพเดทโปรไฟล์ได้');
        throw error;
      }
    }, [handleError]),

    // Load packages
    loadPackages: useCallback(async () => {
      try {
        const packages = await ApiService.getPackages();
        dispatch({ type: actionTypes.SET_PACKAGES, payload: packages });
      } catch (error) {
        handleError(error, 'ไม่สามารถโหลดข้อมูลแพคเกจได้');
      }
    }, [handleError]),

    // Refresh all dashboard data
    refreshDashboard: useCallback(async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      try {
        const data = await ApiService.refreshDashboard();
        
        // Update all relevant state
        dispatch({ type: actionTypes.SET_DASHBOARD_DATA, payload: data });
        dispatch({ type: actionTypes.SET_CLIENTS, payload: data.clients });
        dispatch({ type: actionTypes.SET_SCHEDULE, payload: data.schedule });
        dispatch({ type: actionTypes.SET_REVENUE, payload: data.revenue });
        
      } catch (error) {
        handleError(error, 'ไม่สามารถรีเฟรชข้อมูลได้');
      }
    }, [handleError])
  };

  const value = { state, actions };

  return (
    <TrainerContext.Provider value={value}>
      {children}
    </TrainerContext.Provider>
  );
};

// Hook to use the context
export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainer must be used within a TrainerProvider');
  }
  return context;
};

export default TrainerContext;