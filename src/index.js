import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; 

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Safe mounting
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
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    );

    console.log('✅ FitConnect app mounted successfully');

  } catch (error) {
    console.error('❌ Failed to mount React app:', error);
    
    // Fallback content
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

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}

export default mountApp;