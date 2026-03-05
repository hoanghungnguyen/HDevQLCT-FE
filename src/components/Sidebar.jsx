import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Home,
    CreditCard, 
    PieChart, 
    Settings, 
    LogOut, 
    Wallet,
    Target,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { id: 'dashboard', icon: <Home className="w-5 h-5 mr-4" />, label: 'Tổng quan', path: '/dashboard' },
        { id: 'transactions', icon: <CreditCard className="w-5 h-5 mr-4" />, label: 'Giao dịch', path: '/transactions' },
        { id: 'goals', icon: <Target className="w-5 h-5 mr-4" />, label: 'Mục tiêu', path: '/goals' },
        { id: 'statistics', icon: <PieChart className="w-5 h-5 mr-4" />, label: 'Báo cáo', path: '/statistics' },
    ];

    const bottomItems = [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 h-screen bg-white dark:bg-[#1E1E2D] flex flex-col border-r border-gray-100 dark:border-gray-800 flex-shrink-0 transition-colors duration-300">
            {/* Logo */}
            <div className="h-24 flex items-center px-8">
                <Wallet className="h-8 w-8 text-[#0DBACC] dark:text-[#69ADFF] mr-3" />
                <span className="text-xl font-bold tracking-wider text-gray-800 dark:text-gray-100">QLCT APP</span>
            </div>

            <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-colors ${
                                isActive 
                                ? 'bg-[#F7F7F8] dark:bg-[#2A2A3C] text-[#69ADFF] dark:text-[#69ADFF] font-semibold' 
                                : 'text-[#BDBDCB] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A3C]/50 hover:text-gray-600 dark:hover:text-gray-200 font-medium'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </div>

            {/* Menu phụ (Bottom) */}
            <div className="p-4 border-t border-gray-50 dark:border-gray-800 space-y-1 transition-colors duration-300">
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-colors ${
                                isActive 
                                ? 'bg-[#F7F7F8] dark:bg-[#2A2A3C] text-[#69ADFF] dark:text-[#69ADFF] font-semibold' 
                                : 'text-[#BDBDCB] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A3C]/50 hover:text-gray-600 dark:hover:text-gray-200 font-medium'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-4" />
                        {item.name}
                    </NavLink>
                ))}
                
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-[#BDBDCB] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2A3C]/50 hover:text-gray-600 dark:hover:text-gray-200 font-medium transition-colors"
                >
                    {theme === 'dark' ? (
                        <>
                            <Sun className="h-5 w-5 mr-4 text-yellow-500" /> Sáng
                        </>
                    ) : (
                        <>
                            <Moon className="h-5 w-5 mr-4 text-[#69ADFF]" /> Tối
                        </>
                    )}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-[#BDBDCB] dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 font-medium transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-4" />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
