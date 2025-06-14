import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import AdminLayout from '../layouts/AdminLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-800"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && user.isAdmin !== 1) {
    return <Navigate to="/home" replace />;
  }

  // Se for uma rota de admin, automaticamente envolve com AdminLayout
  if (adminOnly || location.pathname.startsWith('/admin')) {
    return (
      <AdminLayout>
        {children}
      </AdminLayout>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;