// src/contexts/ThemeContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

// Theme Action Types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_COLORS: 'SET_COLORS'
};

// Theme Reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return { ...state, currentTheme: action.payload };
    
    case THEME_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        currentTheme: state.currentTheme === 'light' ? 'dark' : 'light'
      };
    
    case THEME_ACTIONS.SET_COLORS:
      return { ...state, colors: { ...state.colors, ...action.payload } };
    
    default:
      return state;
  }
};

// Theme Configuration
const themes = {
  light: {
    primary: '#232956',
    secondary: '#df2528',
    success: '#28a745',
    warning: '#ffc107',
    info: '#17a2b8',
    danger: '#dc3545',
    light: '#f8f9fa',
    dark: '#343a40',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    textMuted: '#999999',
    borderColor: '#e9ecef'
  },
  dark: {
    primary: '#4a6cf7',
    secondary: '#ff5722',
    success: '#4caf50',
    warning: '#ff9800',
    info: '#2196f3',
    danger: '#f44336',
    light: '#424242',
    dark: '#121212',
    bgPrimary: '#1e1e1e',
    bgSecondary: '#2d2d2d',
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
    textMuted: '#757575',
    borderColor: '#3d3d3d'
  }
};

// Initial State
const initialState = {
  currentTheme: localStorage.getItem('theme') || 'light',
  colors: themes.light
};

// Theme Provider
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = themes[state.currentTheme];
    const root = document.documentElement;

    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // Save to localStorage
    localStorage.setItem('theme', state.currentTheme);

    // Update body class for theme-specific styles
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${state.currentTheme}`);

    dispatch({
      type: THEME_ACTIONS.SET_COLORS,
      payload: theme
    });
  }, [state.currentTheme]);

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: themeName });
    }
  };

  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  const value = {
    ...state,
    setTheme,
    toggleTheme,
    availableThemes: Object.keys(themes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
  isMobile: window.innerWidth < 768,
  theme: 'default'
};
  }
  return context;
};
