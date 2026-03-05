import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, ListFilter, TrendingUp } from 'lucide-react';

const Statistics = () => {
    // Filters Default: Current Month & Year
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    // Data State
    const [trendData, setTrendData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loadingTrend, setLoadingTrend] = useState(true);
    const [loadingCategory, setLoadingCategory] = useState(true);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    useEffect(() => {
        fetchTrendData();
    }, [selectedYear]);

    useEffect(() => {
        fetchCategoryData();
    }, [selectedMonth, selectedYear]);

    const fetchTrendData = async () => {
        setLoadingTrend(true);
        try {
            const data = await transactionService.getMonthlyTrend(selectedYear);
            // Transform data for Recharts exactly matching the DTO keys
            const formattedData = data.map(item => ({
                name: `Tháng ${item.month}`,
                'Thu nhập': item.income,
                'Chi tiêu': item.expense
            }));
            setTrendData(formattedData);
        } catch (error) {
            console.error("Failed to fetch trend data", error);
        } finally {
            setLoadingTrend(false);
        }
    };

    const fetchCategoryData = async () => {
        setLoadingCategory(true);
        try {
            const data = await transactionService.getCategoryExpense(selectedMonth, selectedYear);
            // Already sorted descending from backend
            setCategoryData(data);
        } catch (error) {
            console.error("Failed to fetch category data", error);
        } finally {
            setLoadingCategory(false);
        }
    };

    // Custom Tooltip for BarChart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 min-w-[200px]">
                    <p className="font-bold text-[#303150] mb-2 pb-2 border-b border-gray-50">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                            <span style={{ color: entry.color }} className="font-semibold text-sm mr-4">
                                {entry.name}:
                            </span>
                            <span className="font-bold text-[#303150]">
                                {formatCurrency(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê & Báo cáo</h1>
                    <p className="text-gray-500 font-medium">Theo dõi xu hướng dòng tiền và phân bổ chi tiêu chi tiết.</p>
                </div>
                
                {/* Global Filters */}
                <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100 gap-2">
                    <div className="flex items-center bg-[#F7F7F8] rounded-xl px-3 py-1.5">
                        <ListFilter className="w-4 h-4 text-gray-400 mr-2" />
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="bg-transparent border-none text-sm font-bold text-[#303150] focus:ring-0 cursor-pointer outline-none"
                        >
                            {months.map(m => (
                                <option key={m} value={m}>Tháng {m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center bg-[#F7F7F8] rounded-xl px-3 py-1.5">
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-transparent border-none text-sm font-bold text-[#303150] focus:ring-0 cursor-pointer outline-none pl-2 pr-6"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>Năm {y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Monthly Trend (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-50 flex flex-col h-[500px]">
                        <div className="flex items-center mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] flex items-center justify-center mr-4 text-[#69ADFF]">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#303150]">Xu hướng {selectedYear}</h3>
                                <p className="text-sm text-[#7E7F90] font-medium">Tổng thu & chi 12 tháng</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            {loadingTrend ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#69ADFF]"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={trendData}
                                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                                        barSize={12}
                                        barGap={4}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#BDBDCB', fontSize: 13, fontWeight: 600 }}
                                            dy={15}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#BDBDCB', fontSize: 13, fontWeight: 500 }}
                                            tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : value}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9fa' }} />
                                        <Legend 
                                            iconType="circle" 
                                            wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '14px', color: '#303150' }}
                                        />
                                        <Bar dataKey="Thu nhập" fill="#69ADFF" radius={[4, 4, 4, 4]} />
                                        <Bar dataKey="Chi tiêu" fill="#F18AB5" radius={[4, 4, 4, 4]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Top Categories Breakdown (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-50 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-2xl bg-[#FFF0f5] flex items-center justify-center mr-4 text-[#F18AB5]">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#303150]">Phân bổ chi tiêu</h3>
                                    <p className="text-xs text-[#7E7F90] font-medium">Tháng {selectedMonth}/{selectedYear}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {loadingCategory ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F18AB5]"></div>
                                </div>
                            ) : categoryData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <p className="text-gray-400 font-medium text-sm">Chưa có giao dịch tiêu dùng nào trong tháng này.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {categoryData.map((cat, index) => {
                                        // Colors mapping for top categories
                                        const colors = ['bg-[#0DBACC]', 'bg-[#F18AB5]', 'bg-[#FFB765]', 'bg-[#8E59FF]', 'bg-[#69ADFF]'];
                                        const color = colors[index % colors.length];
                                        
                                        return (
                                            <div key={index} className="flex flex-col">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="font-bold text-[#303150] text-sm truncate pr-2" title={cat.categoryName}>
                                                        {index + 1}. {cat.categoryName}
                                                    </span>
                                                    <div className="flex flex-col items-end shrink-0">
                                                        <span className="font-bold text-[#303150] text-sm">{formatCurrency(cat.totalAmount)}</span>
                                                        <span className="text-xs font-bold text-gray-400">{cat.percentage}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-[#F7F7F8] rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${color} rounded-full transition-all duration-1000`} 
                                                        style={{ width: `${cat.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Statistics;
