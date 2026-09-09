import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to user's role default dashboard
    const roleRoutes = {
      researcher: '/researcher/dashboard',
      reviewer: '/reviewer/dashboard',
      supervisor: '/supervisor/dashboard',
      institution: '/institution/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={roleRoutes[role] || '/researcher/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
