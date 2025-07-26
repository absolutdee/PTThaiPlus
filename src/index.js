import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import CSS safely
import 'bootstrap/dist/css/bootstrap.min.css';

// Performance monitoring (optional)
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(err => {
      console.warn('Web Vitals not available:', err);
    });
  }
};

// Error handling for the entire app
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
  // Send to analytics if needed
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: event.error.toString(),
      fatal: false
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Send to analytics if needed
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: event.reason.toString(),
      fatal: false
    });
  }
});

// Safe DOM mounting
function mountApp() {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Root element not found');
    return;
  }

  try {
    const root = createRoot(container);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Report performance metrics
    reportWebVitals(console.log);

  } catch (error) {
    console.error('Failed to mount React app:', error);
    
    // Fallback HTML content
    container.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: linear-gradient(135deg, #232956 0%, #df2528 100%);
        color: white;
        text-align: center;
      ">
        <div style="
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          max-width: 500px;
        ">
          <h1 style="margin-bottom: 20px; font-size: 3rem;">🏋️‍♂️</h1>
          <h2 style="margin-bottom: 20px;">FitConnect</h2>
          <p style="margin-bottom: 30px; opacity: 0.9;">
            ขออภัย เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: white;
              color: #232956;
              border: none;
              padding: 15px 30px;
              border-radius: 10px;
              font-weight: bold;
              cursor: pointer;
              font-size: 16px;
            "
          >
            🔄 โหลดหน้าใหม่
          </button>
        </div>
      </div>
    `;
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}

// Export for testing
export default mountApp;