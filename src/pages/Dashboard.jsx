import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await transactionService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch statistics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu tổng quan...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Tổng quan tháng này</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Số dư Card - Turquoise */}
                <div className="rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform bg-gradient-to-br from-[#0DBACC] to-[#B4F1F1] text-white cursor-default">
                    <div className="flex items-center mb-4 opacity-90">
                        <Wallet className="w-6 h-6 mr-2" />
                        <span className="font-semibold text-sm">Tổng số dư</span>
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight">
                        {formatCurrency(stats.balance)}
                    </div>
                </div>

                {/* Tổng Thu Card - Baby Blue */}
                <div className="rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform bg-gradient-to-br from-[#74ACEF] to-[#C1DDFF] text-white cursor-default">
                    <div className="flex items-center mb-4 opacity-90">
                        <ArrowUpCircle className="w-6 h-6 mr-2" />
                        <span className="font-semibold text-sm">Tổng thu</span>
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight">
                        {formatCurrency(stats.totalIncome)}
                    </div>
                </div>

                {/* Tổng Chi Card - Cotton Candy */}
                <div className="rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform bg-gradient-to-br from-[#F18AB5] to-[#FFC0DB] text-white cursor-default">
                    <div className="flex items-center mb-4 opacity-90">
                        <ArrowDownCircle className="w-6 h-6 mr-2" />
                        <span className="font-semibold text-sm">Tổng chi phí</span>
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight">
                        {formatCurrency(stats.totalExpense)}
                    </div>
                </div>

                {/* Tổng Tiết kiệm Card - Lavender */}
                <div className="rounded-2xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform bg-gradient-to-br from-[#9F7FE0] to-[#E3D6FF] text-white cursor-default">
                    <div className="flex items-center mb-4 opacity-90">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-semibold text-sm">Tổng tiết kiệm</span>
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight">
                        {formatCurrency(stats.totalIncome - stats.totalExpense)}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Dashboard;
