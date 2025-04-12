import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import EditarUsuario from './pages/EditarUsuario';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/editar" element={<EditarUsuario />} />
        <Route path="/" element={<Navigate replace to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;