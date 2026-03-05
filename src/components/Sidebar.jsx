import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    TrendingUp, 
    ArrowLeftRight, 
    CreditCard, 
    BarChart2, 
    Settings, 
    LogOut, 
    Wallet,
    Target
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Tổng quan', path: '/', icon: LayoutDashboard },
        { name: 'Mục tiêu', path: '/goals', icon: Target },
        { name: 'Giao dịch', path: '/transactions', icon: ArrowLeftRight },
        { name: 'Thống kê', path: '/statistics', icon: BarChart2 },
    ];

    const bottomItems = [
        { name: 'Cài đặt', path: '/settings', icon: Settings }, // dummy route
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 h-screen bg-white flex flex-col border-r border-gray-100 flex-shrink-0">
            {/* Logo */}
            <div className="h-24 flex items-center px-8">
                <Wallet className="h-8 w-8 text-[#0DBACC] mr-3" />
                <span className="text-xl font-bold tracking-wider text-gray-800">QLCT APP</span>
            </div>

            {/* Menu chính */}
            <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-colors ${
                                isActive 
                                ? 'bg-[#F7F7F8] text-[#69ADFF] font-semibold' 
                                : 'text-[#BDBDCB] hover:bg-gray-50 hover:text-gray-600 font-medium'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-4" />
                        {item.name}
                    </NavLink>
                ))}
            </div>

            {/* Menu phụ (Bottom) */}
            <div className="p-4 border-t border-gray-50 space-y-1">
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-colors ${
                                isActive 
                                ? 'bg-[#F7F7F8] text-[#69ADFF] font-semibold' 
                                : 'text-[#BDBDCB] hover:bg-gray-50 hover:text-gray-600 font-medium'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 mr-4" />
                        {item.name}
                    </NavLink>
                ))}
                
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-[#BDBDCB] hover:bg-red-50 hover:text-red-500 font-medium transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-4" />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
