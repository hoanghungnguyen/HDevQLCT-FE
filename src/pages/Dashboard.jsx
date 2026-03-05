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
                
                // Fetch all transactions for history and charts
                const txData = await transactionService.getAll();
                // Sort descending by date
                txData.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
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
        return (
            <div className="max-w-7xl mx-auto py-2 animate-pulse">
                {/* Skeleton for SummaryCards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                    {[1, 2, 3, 4].map(n => <div key={n} className="h-[140px] bg-gray-200 rounded-[20px]"></div>)}
                </div>
                {/* Skeleton for Middle Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="col-span-1 lg:col-span-2 h-[350px] bg-gray-200 rounded-[20px]"></div>
                    <div className="h-[350px] bg-gray-200 rounded-[20px]"></div>
                </div>
                {/* Skeleton for Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 lg:col-span-2 h-[350px] bg-gray-200 rounded-[20px]"></div>
                    <div className="h-[350px] bg-gray-200 rounded-[20px]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-2">
            
            {/* Top 4 Summary Cards */}
            <SummaryCards stats={stats} />
            
            {/* Middle Section: Income Chart & Donut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <IncomeChart transactions={transactions} />
                <ActivityDonut transactions={transactions} />
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
