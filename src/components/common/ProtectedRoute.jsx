// src/components/common/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/signin',
  allowedRoles = []
}) => {
  const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        await checkAuthStatus();
      }
      setChecking(false);
    };

    verifyAuth();
  }, [isAuthenticated, isLoading, checkAuthStatus]);

  // Show loading while checking authentication
  if (isLoading || checking) {
    return <LoadingSpinner fullScreen text="กำลังตรวจสอบสิทธิ์..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Check if user role is in allowed roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return (
        <Navigate 
          to={getDefaultRouteForRole(user.role)} 
          replace 
        />
      );
    }
    
    // If specific role required and user doesn't have it
    if (allowedRoles.length === 0) {
      return (
        <Navigate 
          to={getDefaultRouteForRole(user.role)} 
          replace 
        />
      );
    }
  }

  // Render protected content
  return children;
};

// Helper function to get default route based on user role
const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'trainer':
      return '/trainer-dashboard';
    case 'client':
      return '/client-dashboard';
    default:
      return '/';
  }
};

export default ProtectedRoute;
