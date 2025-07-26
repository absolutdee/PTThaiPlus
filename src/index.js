// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeApp } from './utils/app-initializer';
import { analyticsService } from './services/analytics';
import { performanceMonitor } from './utils/performance';

// Import global styles
import './styles/main.scss';

// Report web vitals
import reportWebVitals from './reportWebVitals';

// Initialize performance monitoring
performanceMonitor.startTiming('app-initialization');

const container = document.getElementById('root');
const root = createRoot(container);

// Initialize app
const initApp = async () => {
  try {
    // Initialize app services
    await initializeApp();
    
    // Initialize analytics
    analyticsService.init({
      trackingId: process.env.REACT_APP_GA_TRACKING_ID,
      debug: process.env.NODE_ENV === 'development'
    });

    // End performance timing
    performanceMonitor.endTiming('app-initialization');
    
    // Track app start
    analyticsService.trackEvent('app_start', {
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });

    // Render app
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Show error page
    root.render(
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <h1 className="text-danger">เกิดข้อผิดพลาด</h1>
          <p className="text-muted">ไม่สามารถเริ่มต้นแอปพลิเคชันได้</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            โหลดใหม่
          </button>
        </div>
      </div>
    );
  }
};

// Start app initialization
initApp();

// Report web vitals
reportWebVitals((metric) => {
  analyticsService.trackPerformance(metric.name, metric.value);
});

// Handle app errors
window.addEventListener('error', (event) => {
  analyticsService.trackError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  analyticsService.trackError(event.reason, {
    type: 'unhandled_promise_rejection'
  });
});
