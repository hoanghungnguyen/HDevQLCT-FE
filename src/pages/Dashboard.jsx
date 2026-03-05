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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Số dư Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center text-gray-500 mb-2">
                        <Wallet className="w-5 h-5 mr-2 text-indigo-500" />
                        <span className="font-medium text-sm">Số dư hiện tại</span>
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900">
                        {formatCurrency(stats.balance)}
                    </div>
                </div>

                {/* Tổng Thu Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center text-gray-500 mb-2">
                        <ArrowUpCircle className="w-5 h-5 mr-2 text-green-500" />
                        <span className="font-medium text-sm">Tổng thu</span>
                    </div>
                    <div className="text-3xl font-extrabold text-green-600">
                        {formatCurrency(stats.totalIncome)}
                    </div>
                </div>

                {/* Tổng Chi Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center text-gray-500 mb-2">
                        <ArrowDownCircle className="w-5 h-5 mr-2 text-red-500" />
                        <span className="font-medium text-sm">Tổng chi</span>
                    </div>
                    <div className="text-3xl font-extrabold text-red-600">
                        {formatCurrency(stats.totalExpense)}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Dashboard;
