import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/formatters';

const data = [
  { name: 'Nhà cửa', value: 4500000, color: '#0DBACC' },
  { name: 'Ăn uống', value: 3200000, color: '#F18AB5' },
  { name: 'Môi giới', value: 1500000, color: '#9F7FE0' },
  { name: 'Sinh hoạt', value: 800000, color: '#69ADFF' },
];

const ActivityDonut = ({ stats }) => {
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
                    {data.map((item, index) => {
                        const percent = Math.round((item.value / totalSpent) * 100);
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-[#7E7F90] text-sm font-medium">{item.name}</span>
                                </div>
                                <span className="text-[#303150] text-sm font-bold">{percent}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ActivityDonut;
