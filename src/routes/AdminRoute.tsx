import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-800"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.isAdmin !== 1) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};