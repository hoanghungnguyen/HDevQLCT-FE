import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { goalService } from '../services/goalService';
import { Link } from 'react-router-dom';

const MyGoals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const data = await goalService.getAll();
                // Chỉ lấy 3 mục tiêu gần nhất để hiển thị ra Widget
                setGoals(data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load goals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    // Color palette cho các goals
    const colors = ['bg-[#69ADFF]', 'bg-[#00C48C]', 'bg-[#F18AB5]'];
    const textColors = ['text-[#69ADFF]', 'text-[#00C48C]', 'text-[#F18AB5]'];

    return (
        <div className="bg-white dark:bg-[#1E1E2D] p-6 rounded-[20px] shadow-sm dark:shadow-none border border-gray-50 dark:border-gray-800 flex flex-col col-span-1 min-h-[350px] transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#303150] dark:text-white">Mục tiêu của tôi</h3>
                <Link to="/goals" className="bg-[#69ADFF] hover:bg-[#5a9aeb] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                    Quản lý
                </Link>
            </div>

            <div className="flex flex-col space-y-8 flex-1 justify-center">
                {loading ? (
                    <div className="text-center text-sm text-gray-400">Đang tải mục tiêu...</div>
                ) : goals.length === 0 ? (
                    <div className="text-center text-sm text-gray-400">Chưa có mục tiêu nào.<br/><Link to="/goals" className="text-[#69ADFF] font-bold mt-2 inline-block">Tạo ngay</Link></div>
                ) : (
                    goals.map((goal, index) => {
                        const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                        const colorClass = colors[index % colors.length];
                        const textColorClass = textColors[index % textColors.length];
                        
                        return (
                            <div key={goal.id} className="flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-[#F7F7F8] dark:bg-[#2A2A3C] flex items-center justify-center mr-4 transition-colors">
                                            <Target className={`w-6 h-6 ${textColorClass}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[#303150] dark:text-white font-bold text-sm mb-1">{goal.name}</span>
                                            <span className="text-xs text-[#7E7F90] dark:text-gray-400 font-semibold">
                                                {formatCurrency(goal.currentAmount)} <span className="text-[#BDBDCB] dark:text-gray-600 font-medium mx-1">/</span> {formatCurrency(goal.targetAmount)}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[#303150] dark:text-white font-extrabold text-sm">{percent}%</span>
                                </div>
                                
                                <div className="w-full h-2.5 bg-[#F7F7F8] dark:bg-[#2A2A3C] rounded-full overflow-hidden flex shadow-inner transition-colors">
                                    <div 
                                        className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-in-out`} 
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyGoals;
