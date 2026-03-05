import axios from 'axios';

// Get base URL from env, or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm Interceptor để tự động đính kèm Token vào Header của các API gửi đi
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Bắt lỗi 401 Unauthorized (hoặc Token hết hạn) để văng ra màn đăng nhập
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Xoá token khỏi trình duyệt
            localStorage.removeItem('token');
            // Đá người dùng về trang Đăng nhập
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
