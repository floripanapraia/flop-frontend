import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" replace />;
  if (user.isAdmin !== 1) return <Navigate to="/home" replace />;

  return <>{children}</>;
};
