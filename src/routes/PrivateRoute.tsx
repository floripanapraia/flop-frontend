import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};
