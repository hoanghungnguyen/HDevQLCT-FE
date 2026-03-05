import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo Context
const AuthContext = createContext();

// Provider bọc toàn app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Kiểm tra token khi ứng dụng vừa tải (F5 lại trang)
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                // TODO: Trong tương lai có thể gọi lên 1 API /api/users/me để verify lại token ngay khi load
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Hàm login thành công: Ghi token vào LocalStorage
    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    // Hàm logout: Xoá cmn token khỏi trình duyệt
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tuỳ chỉnh dùng nhanh Context
export const useAuth = () => {
    return useContext(AuthContext);
};
