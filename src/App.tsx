import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/Auth";
import BeachDetails from "./pages/BeachDetails";
import EditUser from "./pages/EditUser";
import Home from "./pages/Home";
import EvaluationFeed from "./pages/EvaluationFeed";
import PhotoFeed from "./pages/PhotoFeed";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/editar" element={<EditUser />} />
        <Route path="/" element={<Navigate replace to="/auth" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/praia" element={<BeachDetails />} />
        <Route path="/feedfotos" element={<PhotoFeed />} />
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
