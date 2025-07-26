// src/contexts/ClientContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import ApiService from '../services/api';

const ClientContext = createContext();

// Client Action Types
const CLIENT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PROFILE: 'SET_PROFILE',
  SET_WORKOUTS: 'SET_WORKOUTS',
  SET_SCHEDULE: 'SET_SCHEDULE',
  SET_PROGRESS: 'SET_PROGRESS',
  SET_NUTRITION: 'SET_NUTRITION',
  SET_TRAINER: 'SET_TRAINER',
  SET_PACKAGE: 'SET_PACKAGE',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  ADD_WORKOUT: 'ADD_WORKOUT',
  UPDATE_WORKOUT: 'UPDATE_WORKOUT',
  ADD_PROGRESS_ENTRY: 'ADD_PROGRESS_ENTRY'
};

// Client Reducer
const clientReducer = (state, action) => {
  switch (action.type) {
    case CLIENT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case CLIENT_ACTIONS.SET_PROFILE:
      return { ...state, profile: action.payload, isLoading: false };
    
    case CLIENT_ACTIONS.SET_WORKOUTS:
      return { ...state, workouts: action.payload };
    
    case CLIENT_ACTIONS.SET_SCHEDULE:
      return { ...state, schedule: action.payload };
    
    case CLIENT_ACTIONS.SET_PROGRESS:
      return { ...state, progress: action.payload };
    
    case CLIENT_ACTIONS.SET_NUTRITION:
      return { ...state, nutrition: action.payload };
    
    case CLIENT_ACTIONS.SET_TRAINER:
      return { ...state, trainer: action.payload };
    
    case CLIENT_ACTIONS.SET_PACKAGE:
      return { ...state, currentPackage: action.payload };
    
    case CLIENT_ACTIONS.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    
    case CLIENT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case CLIENT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case CLIENT_ACTIONS.UPDATE_PROFILE:
      return { 
        ...state, 
        profile: { ...state.profile, ...action.payload } 
      };
    
    case CLIENT_ACTIONS.ADD_WORKOUT:
      return {
        ...state,
        workouts: [...state.workouts, action.payload]
      };
    
    case CLIENT_ACTIONS.UPDATE_WORKOUT:
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout.id === action.payload.id ? action.payload : workout
        )
      };
    
    case CLIENT_ACTIONS.ADD_PROGRESS_ENTRY:
      return {
        ...state,
        progress: [...state.progress, action.payload]
      };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  profile: null,
  workouts: [],
  schedule: [],
  progress: [],
  nutrition: null,
  trainer: null,
  currentPackage: null,
  notifications: [],
  isLoading: false,
  error: null
};

// Client Provider
export const ClientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientReducer, initialState);

  // API Functions
  const fetchProfile = async (userId) => {
    dispatch({ type: CLIENT_ACTIONS.SET_LOADING, payload: true });
    try {
      const profile = await ApiService.get(`/client/profile/${userId}`);
      dispatch({ type: CLIENT_ACTIONS.SET_PROFILE, payload: profile });
      return profile;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateProfile = async (userId, profileData) => {
    try {
      const updatedProfile = await ApiService.put(`/client/profile/${userId}`, profileData);
      dispatch({ type: CLIENT_ACTIONS.UPDATE_PROFILE, payload: updatedProfile });
      return updatedProfile;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchWorkouts = async (userId) => {
    try {
      const workouts = await ApiService.get(`/client/${userId}/workouts`);
      dispatch({ type: CLIENT_ACTIONS.SET_WORKOUTS, payload: workouts });
      return workouts;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchSchedule = async (userId, params = {}) => {
    try {
      const schedule = await ApiService.get(`/client/${userId}/schedule`, { params });
      dispatch({ type: CLIENT_ACTIONS.SET_SCHEDULE, payload: schedule });
      return schedule;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchProgress = async (userId, params = {}) => {
    try {
      const progress = await ApiService.get(`/client/${userId}/progress`, { params });
      dispatch({ type: CLIENT_ACTIONS.SET_PROGRESS, payload: progress });
      return progress;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const addProgressEntry = async (userId, progressData) => {
    try {
      const newEntry = await ApiService.post(`/client/${userId}/progress`, progressData);
      dispatch({ type: CLIENT_ACTIONS.ADD_PROGRESS_ENTRY, payload: newEntry });
      return newEntry;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchNutrition = async (userId) => {
    try {
      const nutrition = await ApiService.get(`/client/${userId}/nutrition`);
      dispatch({ type: CLIENT_ACTIONS.SET_NUTRITION, payload: nutrition });
      return nutrition;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchTrainer = async (trainerId) => {
    try {
      const trainer = await ApiService.get(`/trainers/${trainerId}`);
      dispatch({ type: CLIENT_ACTIONS.SET_TRAINER, payload: trainer });
      return trainer;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchCurrentPackage = async (userId) => {
    try {
      const currentPackage = await ApiService.get(`/client/${userId}/package`);
      dispatch({ type: CLIENT_ACTIONS.SET_PACKAGE, payload: currentPackage });
      return currentPackage;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const bookSession = async (sessionData) => {
    try {
      const booking = await ApiService.post('/client/sessions/book', sessionData);
      // Refresh schedule after booking
      if (state.profile?.id) {
        await fetchSchedule(state.profile.id);
      }
      return booking;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const cancelSession = async (sessionId) => {
    try {
      const result = await ApiService.delete(`/client/sessions/${sessionId}`);
      // Refresh schedule after cancellation
      if (state.profile?.id) {
        await fetchSchedule(state.profile.id);
      }
      return result;
    } catch (error) {
      dispatch({ type: CLIENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: CLIENT_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    fetchProfile,
    updateProfile,
    fetchWorkouts,
    fetchSchedule,
    fetchProgress,
    addProgressEntry,
    fetchNutrition,
    fetchTrainer,
    fetchCurrentPackage,
    bookSession,
    cancelSession,
    clearError
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
