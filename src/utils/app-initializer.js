export const performanceMonitor = {
  init: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Performance monitoring initialized');
    }
  },
  
  cleanup: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Performance monitoring cleaned up');
    }
  }
};

// App initializer
export const appInitializer = {
  init: async () => {
    try {
      // Initialize performance monitoring
      performanceMonitor.init();
      
      // Set up global error handlers
      window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
      });

      // Initialize app settings
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ App initialized successfully');
        console.log('📱 Environment:', process.env.NODE_ENV);
        console.log('🌐 API URL:', process.env.REACT_APP_API_URL);
      }

      return true;
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      throw error;
    }
  }
};

// Export for backwards compatibility
export const initializeApp = appInitializer.init;
export default appInitializer;