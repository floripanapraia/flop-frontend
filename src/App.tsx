import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { PrivateRoute } from "./routes/PrivateRoute";
import { AdminRoute } from "./routes/AdminRoute";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import EditUser from "./pages/EditUser";
import FlopFeed from "./pages/FlopFeed";
import PhotoFeed from "./pages/PhotoFeed";
import EvaluationFeed from "./pages/EvaluationFeed";
import { AuthProvider } from "./context/authContext";
// import AdminUsers from "./pages/admin/AdminUsers"; // exemplo de rota admin

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/auth" />} />
          <Route path="/auth" element={<Auth />} />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar"
            element={
              <PrivateRoute>
                <EditUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/flops"
            element={
              <PrivateRoute>
                <FlopFeed />
              </PrivateRoute>
            }
          />
          <Route
            path="/fotos"
            element={
              <PrivateRoute>
                <PhotoFeed />
              </PrivateRoute>
            }
          />
          <Route
            path="/avaliacoes"
            element={
              <PrivateRoute>
                <EvaluationFeed />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          /> */}
        </Routes>

        <ToastContainer position="top-right" autoClose={5000} />
      </Router>
    </AuthProvider>
  );
};

export default App;
