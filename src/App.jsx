import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F7F7F8] dark:bg-[#12121A] transition-colors duration-300">
        <Toaster position="top-right" />
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Yêu cầu đăng nhập */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/statistics" element={<Statistics />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<div className="text-center py-20 text-xl font-bold text-gray-500">404 - Trang không tồn tại</div>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
