// src/contexts/PaymentContext.js
import React, { createContext, useContext, useReducer } from 'react';
import { paymentService } from '../services/payment';

const PaymentContext = createContext();

// Payment Action Types
const PAYMENT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PAYMENT_INTENT: 'SET_PAYMENT_INTENT',
  SET_PAYMENT_METHODS: 'SET_PAYMENT_METHODS',
  SET_TRANSACTION_HISTORY: 'SET_TRANSACTION_HISTORY',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Payment Reducer
const paymentReducer = (state, action) => {
  switch (action.type) {
    case PAYMENT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case PAYMENT_ACTIONS.SET_PAYMENT_INTENT:
      return { ...state, paymentIntent: action.payload };
    
    case PAYMENT_ACTIONS.SET_PAYMENT_METHODS:
      return { ...state, paymentMethods: action.payload };
    
    case PAYMENT_ACTIONS.SET_TRANSACTION_HISTORY:
      return { ...state, transactionHistory: action.payload };
    
    case PAYMENT_ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactionHistory: [action.payload, ...state.transactionHistory]
      };
    
    case PAYMENT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case PAYMENT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  paymentIntent: null,
  paymentMethods: [],
  transactionHistory: [],
  isLoading: false,
  error: null
};

// Payment Provider
export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const createPaymentIntent = async (amount, currency = 'thb', metadata = {}) => {
    dispatch({ type: PAYMENT_ACTIONS.SET_LOADING, payload: true });
    try {
      const paymentIntent = await paymentService.createPaymentIntent({
        amount,
        currency,
        metadata
      });
      dispatch({
        type: PAYMENT_ACTIONS.SET_PAYMENT_INTENT,
        payload: paymentIntent
      });
      return paymentIntent;
    } catch (error) {
      dispatch({ type: PAYMENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: PAYMENT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const processPayment = async (paymentMethodId, paymentIntentId) => {
    dispatch({ type: PAYMENT_ACTIONS.SET_LOADING, payload: true });
    try {
      const result = await paymentService.confirmPayment({
        paymentMethodId,
        paymentIntentId
      });
      
      if (result.status === 'succeeded') {
        dispatch({
          type: PAYMENT_ACTIONS.ADD_TRANSACTION,
          payload: result.transaction
        });
      }
      
      return result;
    } catch (error) {
      dispatch({ type: PAYMENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: PAYMENT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const getTransactionHistory = async (userId) => {
    dispatch({ type: PAYMENT_ACTIONS.SET_LOADING, payload: true });
    try {
      const history = await paymentService.getTransactionHistory(userId);
      dispatch({
        type: PAYMENT_ACTIONS.SET_TRANSACTION_HISTORY,
        payload: history
      });
      return history;
    } catch (error) {
      dispatch({ type: PAYMENT_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: PAYMENT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: PAYMENT_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    createPaymentIntent,
    processPayment,
    getTransactionHistory,
    clearError
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
