import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Auth from "./pages/Auth";
import EditUser from "./pages/EditUser";
import EvaluationFeed from "./pages/EvaluationFeed";
import FlopFeed from "./pages/FlopFeed";
import Home from "./pages/Home";
import PhotoFeed from "./pages/PhotoFeed";

import { AuthProvider } from "./contexts/authContext";
import { UserProvider } from "./contexts/userContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// import AdminUsers from "./pages/admin/AdminUsers"; // exemplo de rota admin só pra fazer funcionar
function AdminUsers() {
  return <div>Admin Users</div>;
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Redirect root to auth */}
            <Route path="/" element={<Navigate to="/auth" replace />} />

            {/* Private Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editar"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flop-feed"
              element={
                <ProtectedRoute>
                  <FlopFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/photo-feed"
              element={
                <ProtectedRoute>
                  <PhotoFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/evaluation-feed"
              element={
                <ProtectedRoute>
                  <EvaluationFeed />
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

            {/* Catch all route - redirect to auth */}
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