// src/utils/lazyLoad.js
export const lazyLoadComponent = (importFunc) => {
  return React.lazy(() => 
    importFunc().catch(error => {
      console.error('Error loading component:', error);
      // Return a fallback component
      return {
        default: () => (
          <div className="text-center p-4">
            <p className="text-muted">ไม่สามารถโหลดส่วนประกอบได้</p>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => window.location.reload()}
            >
              โหลดใหม่
            </button>
          </div>
        )
      };
    })
  );
};

// Usage example:
// const TrainerDashboard = lazyLoadComponent(() => import('./TrainerDashboard'));
