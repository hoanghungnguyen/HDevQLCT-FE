import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy URL bị chặn trước đó để redirect bù lại (hoặc mặc định về /)
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login(username, password);
            if (data.token) {
                login(data.token);
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                    Đăng nhập
                </h2>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên đăng nhập / Mật danh</label>
                        <input 
                            type="text" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                    <div className="text-center text-sm">
                        Chưa có tài khoản? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Đăng ký ngay</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
