import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-[#F7F7F8] overflow-hidden font-sans">
            {/* Sidebar Cố định bên trái */}
            <Sidebar />

            {/* Vùng Content chính */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header dính phía trên */}
                <Header />
                
                {/* Khu vực cuộn dành cho nội dung từng trang (Dashboard, Transactions, v.v) */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
