import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(username, email, password);
            setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.email || 'Đăng ký thất bại. Tên đăng nhập hoặc email có thể đã tồn tại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                    Đăng ký tài khoản
                </h2>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                        <p className="text-sm text-green-700">{success}</p>
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
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input 
                            type="password" 
                            required 
                            minLength={6}
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
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                    <div className="text-center text-sm">
                        Đã có tài khoản? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
