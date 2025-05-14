import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/Auth";
import EditUser from "./pages/EditUser";
import EvaluationFeed from "./pages/EvaluationFeed";
import FlopFeed from "./pages/FlopFeed";
import Home from "./pages/Home";
import PhotoFeed from "./pages/PhotoFeed";
import UserProfilePhotos from "./pages/UserProfilePhotos";
import UserProfileFlops from './pages/UserProfileFlops';
import { initializeAuth } from "./services/authService";

initializeAuth();

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/editar" element={<EditUser />} />
        <Route path="/" element={<Navigate replace to="/auth" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/flops" element={<FlopFeed />} />
        <Route path="/fotos" element={<PhotoFeed />} />
        <Route path="/avaliacoes" element={<EvaluationFeed />} />
        <Route path="/perfilFotos" element={<UserProfilePhotos />} />
        <Route path="/perfilFlops" element={<UserProfileFlops />} />
      </Routes>

      {/* Toast configuration */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

export default App;
