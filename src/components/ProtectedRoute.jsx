import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from './MainLayout';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Trong lúc vừa F5 hoặc đang chờ đọc Token từ LocalStorage...
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500 bg-[#F7F7F8]">Đang kiểm tra bảo mật...</div>;
    }

    // Nếu không có quyền, đá văng ra Login, lưu lại vị trí cũ để đăng nhập xong quay lại
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu ok thì cho pass qua render Layout chính (Sidebar + Header + Content)
    return <MainLayout />;
};

export default ProtectedRoute;
