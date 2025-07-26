// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Import Bootstrap และ CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.scss';

// Import Contexts
import { AuthProvider } from './contexts/AuthContext';
import { TrainerProvider } from './contexts/TrainerContext';
import { ClientProvider } from './contexts/ClientContext';
import { AdminProvider } from './contexts/AdminContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import Components หลัก
import HomePage from './components/main/HomePage';
import TrainerSearchPage from './components/main/TrainerSearchPage';
import TrainerDetailPage from './components/main/TrainerDetailPage';
import EventsPage from './components/main/EventsPage';
import EventDetailPage from './components/main/EventDetailPage';
import GymsPage from './components/main/GymsPage';
import GymDetailPage from './components/main/GymDetailPage';
import ArticlesPage from './components/main/ArticlesPage';
import ArticleDetailPage from './components/main/ArticleDetailPage';
import ContactPage from './components/main/ContactPage';
import SignInPage from './components/main/SignInPage';
import SignUpPage from './components/main/SignUpPage';
import TrainerSignUpPage from './components/main/TrainerSignUpPage';

// Import Dashboard Components
import TrainerMainDashboard from './components/trainer/TrainerMainDashboard';
import MainClientDashboard from './components/client/MainClientDashboard';
import AdminLayout from './components/admin/AdminLayout';

// Import Common Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotificationToast from './components/common/NotificationToast';

// Import Services
import ApiService from './services/api';
import { authService } from './services/auth';

// Import Utils
import { initializeApp } from './utils/app-initializer';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize App
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        
        // Initialize app services
        await initializeApp();
        
        // Check authentication status
        await authService.checkAuthStatus();
        
        setIsInitialized(true);
      } catch (err) {
        console.error('App initialization failed:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <h3 className="text-danger mb-3">เกิดข้อผิดพลาด</h3>
          <p className="text-muted mb-3">{error}</p>
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

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <PaymentProvider>
              <Router>
                <Helmet>
                  <title>FitConnect - แพลตฟอร์มหาเทรนเนอร์ออกกำลังกาย</title>
                  <meta 
                    name="description" 
                    content="พบเทรนเนอร์ออกกำลังกายมืออาชีพ จองเซสชั่นได้ง่าย ราคาโปร่งใส มีแพคเกจให้เลือกหลากหลาย เหมาะกับทุกระดับและเป้าหมาย" 
                  />
                  <meta 
                    name="keywords" 
                    content="เทรนเนอร์, ออกกำลังกาย, ฟิตเนส, โยคะ, ลดน้ำหนัก, personal trainer, fitness, workout" 
                  />
                  <meta name="author" content="FitConnect Team" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  
                  {/* Open Graph Meta Tags */}
                  <meta property="og:title" content="FitConnect - แพลตฟอร์มหาเทรนเนอร์ออกกำลังกาย" />
                  <meta property="og:description" content="พบเทรนเนอร์ออกกำลังกายมืออาชีพ จองเซสชั่นได้ง่าย ราคาโปร่งใส" />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content={window.location.href} />
                  <meta property="og:image" content="/assets/images/og-image.jpg" />
                  
                  {/* PWA Meta Tags */}
                  <meta name="theme-color" content="#232956" />
                  <link rel="manifest" href="/manifest.json" />
                  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                </Helmet>

                <Routes>
                  {/* หน้าหลักเว็บไซต์ */}
                  <Route path="/" element={<HomePage />} />
                  
                  {/* Authentication Routes */}
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/signup-trainer" element={<TrainerSignUpPage />} />
                  
                  {/* Public Pages */}
                  <Route path="/search" element={<TrainerSearchPage />} />
                  <Route path="/trainer/:id" element={<TrainerDetailPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/event/:id" element={<EventDetailPage />} />
                  <Route path="/gyms" element={<GymsPage />} />
                  <Route path="/gym/:id" element={<GymDetailPage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/article/:id" element={<ArticleDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  {/* Protected Trainer Routes */}
                  <Route 
                    path="/trainer-dashboard/*" 
                    element={
                      <ProtectedRoute requiredRole="trainer">
                        <TrainerProvider>
                          <TrainerMainDashboard />
                        </TrainerProvider>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected Client Routes */}
                  <Route 
                    path="/client-dashboard/*" 
                    element={
                      <ProtectedRoute requiredRole="client">
                        <ClientProvider>
                          <MainClientDashboard />
                        </ClientProvider>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected Admin Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminProvider>
                          <AdminLayout />
                        </AdminProvider>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Redirect Routes */}
                  <Route path="/dashboard" element={<Navigate to="/client-dashboard" replace />} />
                  <Route path="/trainer" element={<Navigate to="/trainer-dashboard" replace />} />
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>

                {/* Global Components */}
                <NotificationToast />
              </Router>
            </PaymentProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// 404 Not Found Component
const NotFoundPage = () => (
  <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
    <div className="text-center">
      <h1 className="display-1 fw-bold" style={{ color: '#232956' }}>404</h1>
      <h2 className="mb-3">ไม่พบหน้าที่คุณต้องการ</h2>
      <p className="text-muted mb-4">หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือไม่มีอยู่</p>
      <div className="d-flex gap-3 justify-content-center flex-wrap">
        <button 
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          ย้อนกลับ
        </button>
        <a href="/" className="btn btn-outline-primary">
          กลับหน้าหลัก
        </a>
      </div>
    </div>
  </div>
);

export default App;
