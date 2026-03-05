import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F7F7F8]">
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Yêu cầu đăng nhập */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<div className="text-center py-20 text-xl font-bold text-gray-500">404 - Trang không tồn tại</div>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
