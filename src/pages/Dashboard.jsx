import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';

import SummaryCards from '../components/SummaryCards';
import IncomeChart from '../components/IncomeChart';
import ActivityDonut from '../components/ActivityDonut';
import TransactionHistory from '../components/TransactionHistory';
import MyGoals from '../components/MyGoals';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await transactionService.getStats();
                setStats(statsData);
                
                // Fetch recent transactions (Current Month)
                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();
                const txData = await transactionService.getFiltered(currentMonth, currentYear);
                setTransactions(txData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu tổng quan...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-2">
            
            {/* Top 4 Summary Cards */}
            <SummaryCards stats={stats} />
            
            {/* Middle Section: Income Chart & Donut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <IncomeChart />
                <ActivityDonut stats={stats} />
            </div>

            {/* Bottom Section: Transactions History & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TransactionHistory transactions={transactions} />
                <MyGoals />
            </div>
            
        </div>
    );
};

export default Dashboard;
