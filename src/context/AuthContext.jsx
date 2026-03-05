import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Tạo Context
const AuthContext = createContext();

// Provider bọc toàn app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra token khi ứng dụng vừa tải (F5 lại trang)
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Check if token expired
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setIsAuthenticated(true);
                        setUser({ email: decoded.sub }); // Lấy subject (email) làm name hiển thị tạm
                    }
                } catch (error) {
                    logout();
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Hàm login thành công: Ghi token vào LocalStorage
    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const decoded = jwtDecode(token);
            setUser({ email: decoded.sub });
        } catch(error) {
            console.error("Invalid token", error);
        }
        setIsAuthenticated(true);
    };

    // Hàm logout: Xoá cmn token khỏi trình duyệt
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tuỳ chỉnh dùng nhanh Context
export const useAuth = () => {
    return useContext(AuthContext);
};
