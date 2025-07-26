// src/App.js
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PaymentProvider } from './contexts/PaymentContext';

// Common Components
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotificationToast from './components/common/NotificationToast';

// Utils
import { appInitializer } from './utils/app-initializer';
import { performanceMonitor } from './utils/performance';

// Styles
import './styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

// Main Website Layout
const MainWebsite = lazy(() => import('./components/main/MainWebsite'));

// Main Website Pages
const HomePage = lazy(() => import('./components/main/HomePage'));
const TrainerSearchPage = lazy(() => import('./components/main/TrainerSearchPage'));
const TrainerDetailPage = lazy(() => import('./components/main/TrainerDetailPage'));
const EventsPage = lazy(() => import('./components/main/EventsPage'));
const EventDetailPage = lazy(() => import('./components/main/EventDetailPage'));
const GymsPage = lazy(() => import('./components/main/GymsPage'));
const GymDetailPage = lazy(() => import('./components/main/GymDetailPage'));
const ArticlesPage = lazy(() => import('./components/main/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./components/main/ArticleDetailPage'));
const ContactPage = lazy(() => import('./components/main/ContactPage'));
const SignInPage = lazy(() => import('./components/main/SignInPage'));
const SignUpPage = lazy(() => import('./components/main/SignUpPage'));
const TrainerSignUpPage = lazy(() => import('./components/main/TrainerSignUpPage'));

// Trainer Dashboard
const TrainerMainDashboard = lazy(() => import('./components/trainer/TrainerMainDashboard'));

// Client Dashboard
const MainClientDashboard = lazy(() => import('./components/client/MainClientDashboard'));

// Admin Dashboard
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

// Error Pages
const ErrorPages = lazy(() => import('./components/common/ErrorPages'));

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const AppLoading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <LoadingSpinner size="large" color="#232956" />
    <div style={{
      fontSize: '1.1rem',
      color: '#232956',
      fontWeight: '500',
      fontFamily: 'Noto Sans Thai, sans-serif'
    }}>
      กำลังโหลด FitConnect...
    </div>
  </div>
);

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App = () => {
  // Initialize app performance monitoring
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.init();
    
    // Initialize app
    appInitializer.init().catch(error => {
      console.error('App initialization failed:', error);
    });

    // Log app start
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 FitConnect App Started');
      console.log('📱 Environment:', process.env.NODE_ENV);
      console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:3001/api');
    }

    // Cleanup function
    return () => {
      performanceMonitor.cleanup();
    };
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <PaymentProvider>
                <Router>
                  <div className="app" id="app">
                    {/* Global Notification Toast */}
                    <NotificationToast />
                    
                    {/* Main Routes */}
                    <Suspense fallback={<AppLoading />}>
                      <Routes>
                        {/* Main Website Routes */}
                        <Route path="/*" element={<MainWebsite />}>
                          <Route index element={<HomePage />} />
                          <Route path="search" element={<TrainerSearchPage />} />
                          <Route path="trainerdetail/:id" element={<TrainerDetailPage />} />
                          <Route path="events" element={<EventsPage />} />
                          <Route path="events/:id" element={<EventDetailPage />} />
                          <Route path="gyms" element={<GymsPage />} />
                          <Route path="gyms/:id" element={<GymDetailPage />} />
                          <Route path="articles" element={<ArticlesPage />} />
                          <Route path="articles/:id" element={<ArticleDetailPage />} />
                          <Route path="contact" element={<ContactPage />} />
                          <Route path="signin" element={<SignInPage />} />
                          <Route path="signup" element={<SignUpPage />} />
                          <Route path="trainer-signup" element={<TrainerSignUpPage />} />
                        </Route>

                        {/* Trainer Dashboard Routes */}
                        <Route 
                          path="/trainer/*" 
                          element={
                            <ProtectedRoute requiredRole="trainer">
                              <TrainerMainDashboard />
                            </ProtectedRoute>
                          } 
                        />

                        {/* Client Dashboard Routes */}
                        <Route 
                          path="/client/*" 
                          element={
                            <ProtectedRoute requiredRole="client">
                              <MainClientDashboard />
                            </ProtectedRoute>
                          } 
                        />

                        {/* Admin Dashboard Routes */}
                        <Route 
                          path="/admin/*" 
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <AdminLayout />
                            </ProtectedRoute>
                          } 
                        />

                        {/* Error Pages */}
                        <Route path="/404" element={<ErrorPages type="404" />} />
                        <Route path="/500" element={<ErrorPages type="500" />} />
                        <Route path="/maintenance" element={<ErrorPages type="maintenance" />} />

                        {/* Redirect old routes */}
                        <Route path="/home" element={<Navigate to="/" replace />} />
                        <Route path="/login" element={<Navigate to="/signin" replace />} />
                        <Route path="/register" element={<Navigate to="/signup" replace />} />

                        {/* Catch all - 404 */}
                        <Route path="*" element={<Navigate to="/404" replace />} />
                      </Routes>
                    </Suspense>
                  </div>
                </Router>
              </PaymentProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
