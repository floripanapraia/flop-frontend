import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/Auth";
import EditUser from "./pages/EditUser";
import EvaluationFeed from "./pages/EvaluationFeed";
import FlopFeed from "./pages/FlopFeed";
import Home from "./pages/Home";
import PhotoFeed from "./pages/PhotoFeed";
import UserProfilePhotos from "./pages/UserProfilePhotos";
import UserProfileFlops from "./pages/UserProfileFlops";
import { GeolocationProvider } from "./contexts/GeolocationContext";
import { BeachProvider } from "./contexts/BeachContext";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/editar" element={<EditUser />} />
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/perfilFotos" element={<UserProfilePhotos />} />
        <Route path="/perfilFlops" element={<UserProfileFlops />} />

        {/* Home com apenas o contexto da praia */}
        <Route
          path="/home"
          element={
            <BeachProvider>
              <Home />
            </BeachProvider>
          }
        />

        {/* Avaliação, Flops e Fotos com contexto de praia + geolocalização */}
        <Route
          element={
            <BeachProvider>
              <GeolocationProvider>
                <Outlet />
              </GeolocationProvider>
            </BeachProvider>
          }
        >
          <Route path="/avaliacoes/:id" element={<EvaluationFeed />} />
          <Route path="/flops/:id" element={<FlopFeed />} />
          <Route path="/fotos/:id" element={<PhotoFeed />} />
        </Route>
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
