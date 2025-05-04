import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/Auth";
import BeachDetails from "./pages/FlopFeed";
import EditUser from "./pages/EditUser";
import Home from "./pages/Home";
import EvaluationFeed from "./pages/EvaluationFeed";
import PhotoFeed from "./pages/PhotoFeed";
import FlopFeed from "./pages/FlopFeed";

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
