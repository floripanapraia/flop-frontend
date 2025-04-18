import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import EditarUsuario from './pages/EditarUsuario';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import BeachDetails from './pages/BeachDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/editar" element={<EditarUsuario />} />
        <Route path="/" element={<Navigate replace to="/auth" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/praia" element={<BeachDetails />} />
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