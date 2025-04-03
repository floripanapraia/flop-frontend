import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import Help from './pages/Help';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/help" element={<Help />} />
        <Route path="/forgot-password" element={<div>Forgot Password Page (To be implemented)</div>} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;