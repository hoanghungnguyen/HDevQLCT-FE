import React from 'react';
import { Search, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user } = useAuth();
    
    // Tạm thời lấy tên cứng, sau này có thể bóc từ LocalStorage hoặc AuthContext
    const userName = user?.email ? user.email.split('@')[0] : "Người dùng";
    const initial = userName.substring(0, 2).toUpperCase();
    const today = new Date().toISOString(); 

    return (
        <header className="h-24 px-8 flex items-center justify-between bg-[#F7F7F8]">
            {/* Lời chào */}
            <div>
                <h2 className="text-xl font-bold text-[#303150]">Chào <span className="font-semibold">{userName}</span>,</h2>
                <p className="text-sm text-[#BDBDCB] mt-1">Chào mừng quay trở lại!</p>
            </div>

            {/* Vùng các công cụ */}
            <div className="flex items-center space-x-6">
                
                {/* Ngày tháng */}
                <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-xl shadow-sm text-sm text-[#7E7F90] font-medium border border-gray-50">
                    <CalendarIcon className="w-4 h-4 mr-2 text-[#BDBDCB]" />
                    {formatDate(today)}
                </div>

                {/* Thanh tìm kiếm */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-[#BDBDCB]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="bg-white border-none shadow-sm block w-64 pl-10 pr-3 py-2 rounded-xl text-sm placeholder-[#BDBDCB] focus:outline-none focus:ring-2 focus:ring-[#C1DDFF] text-[#303150]"
                    />
                </div>

                {/* Thông báo */}
                <button className="relative p-2 text-[#BDBDCB] hover:text-[#303150] transition-colors rounded-full bg-white shadow-sm border border-gray-50">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>

                {/* Avatar & Profile */}
                <div className="flex items-center cursor-pointer bg-white py-1.5 pl-1.5 pr-4 rounded-full shadow-sm border border-gray-50 hover:shadow transition-shadow">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#0DBACC] to-[#C1DDFF] flex items-center justify-center text-white font-bold text-xs mr-3">
                        {initial}
                    </div>
                    <span className="text-sm font-semibold text-[#303150]">{userName}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
