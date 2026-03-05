import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/formatters';

const CHART_COLORS = ['#0DBACC', '#F18AB5', '#9F7FE0', '#69ADFF', '#FFAE4A'];

const ActivityDonut = ({ transactions = [] }) => {
    
    // Group expenses by category for the current month
    const data = useMemo(() => {
        const now = new Date();
        const categoryMap = {};

        transactions.forEach(tx => {
            const txDate = new Date(tx.transactionDate);
            if (
                tx.type === 'expense' && 
                txDate.getMonth() === now.getMonth() && 
                txDate.getFullYear() === now.getFullYear()
            ) {
                const catName = tx.categoryName || 'Khác';
                categoryMap[catName] = (categoryMap[catName] || 0) + tx.amount;
            }
        });

        // Convert map to array and sort by value desc
        const sortedData = Object.keys(categoryMap)
            .map(key => ({ name: key, value: categoryMap[key] }))
            .sort((a, b) => b.value - a.value);

        // Assign colors securely
        return sortedData.map((item, index) => ({
            ...item,
            color: CHART_COLORS[index % CHART_COLORS.length]
        }));
    }, [transactions]);

    // Tổng cộng để render giữa biểu đồ tròn
    const totalSpent = data.reduce((acc, current) => acc + current.value, 0);

    return (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50 flex flex-col col-span-1 min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#303150]">Phân bổ chi tiêu</h3>
                <select className="bg-gray-50 text-sm border-none text-[#7E7F90] px-3 py-1.5 rounded-lg font-medium cursor-pointer focus:ring-0">
                    <option>Tháng này</option>
                </select>
            </div>
            
            <div className="flex-1 flex flex-row items-center justify-between">
                
                {/* Vòng tròn bên trái */}
                <div className="w-1/2 relative flex justify-center items-center">
                    <div className="absolute text-center z-10 flex flex-col items-center justify-center">
                        <span className="text-[#303150] font-extrabold text-xl">{formatCurrency(totalSpent)}</span>
                        <span className="text-[#BDBDCB] text-xs font-semibold uppercase mt-1">Đã chi</span>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={75}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={8}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Legend list bên phải */}
                <div className="w-[45%] flex flex-col space-y-4">
                    {data.length > 0 ? data.slice(0, 4).map((item, index) => {
                        const percent = totalSpent > 0 ? Math.round((item.value / totalSpent) * 100) : 0;
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center truncate pr-2">
                                    <span className="w-2.5 h-2.5 rounded-full mr-3 shrink-0" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-[#7E7F90] text-sm font-medium truncate" title={item.name}>{item.name}</span>
                                </div>
                                <span className="text-[#303150] text-sm font-bold">{percent}%</span>
                            </div>
                        );
                    }) : (
                        <div className="text-sm text-gray-400">Không có dữ liệu chi tiêu tháng này</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityDonut;
