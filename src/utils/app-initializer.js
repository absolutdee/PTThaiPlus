// src/utils/app-initializer.js
import { authService } from '../services/auth';
import { notificationService } from '../services/notification';

export const initializeApp = async () => {
  try {
    // Check if app is running in PWA mode
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.navigator.standalone ||
                  document.referrer.includes('android-app://');

    if (isPWA) {
      console.log('App running in PWA mode');
    }

    // Initialize theme
    initializeTheme();

    // Request notification permission
    if ('Notification' in window) {
      await notificationService.requestNotificationPermission();
    }

    // Initialize service worker for PWA
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful:', registration.scope);
      } catch (error) {
        console.log('ServiceWorker registration failed:', error);
      }
    }

    // Initialize error tracking
    initializeErrorTracking();

    console.log('App initialized successfully');
  } catch (error) {
    console.error('App initialization failed:', error);
    throw error;
  }
};

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(`theme-${savedTheme}`);
  
  // Apply theme colors to meta tags
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.content = savedTheme === 'dark' ? '#1e1e1e' : '#232956';
  }
};

const initializeErrorTracking = () => {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Here you can send errors to monitoring service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Here you can send errors to monitoring service
  });
};
