import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import EditarUsuario from './pages/EditarUsuario';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editar" element={<EditarUsuario />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;