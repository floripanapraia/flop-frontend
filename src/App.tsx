import React from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Auth from "./pages/Auth";
import EditUser from "./pages/EditUser";
import EvaluationFeed from "./pages/EvaluationFeed";
import Home from "./pages/Home";
import UserProfileFlops from "./pages/UserProfileFlops";
import UserProfilePhotos from "./pages/UserProfilePhotos";
import FlopFeed from "./pages/FlopFeed";
import PhotoFeed from "./pages/PhotoFeed";

import { AuthProvider } from "./contexts/authContext";
import { BeachProvider } from "./contexts/beachContext";
import { GeolocationProvider } from "./contexts/geolocationContext";
import { UserProvider } from "./contexts/userContext";
import AdminUsers from "./pages/admin/AdminUsers";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/auth" replace />} />

            {/* Routes that require BeachProvider + GeolocationProvider */}
            <Route
              element={
                <BeachProvider>
                  <GeolocationProvider>
                    <Outlet />
                  </GeolocationProvider>
                </BeachProvider>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/flops/:id" element={<FlopFeed />} />
              <Route path="/fotos/:id" element={<PhotoFeed />} />
              <Route path="/avaliacoes/:id" element={<EvaluationFeed />} />
            </Route>

            {/* Protected Routes */}
            <Route
              path="/editar"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfilFotos"
              element={
                <ProtectedRoute>
                  <UserProfilePhotos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfilFlops"
              element={
                <ProtectedRoute>
                  <UserProfileFlops />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
