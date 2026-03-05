import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T1', total: 2000 },
  { name: 'T2', total: 3200 },
  { name: 'T3', total: 2800 },
  { name: 'T4', total: 4653 },
  { name: 'T5', total: 3800 },
  { name: 'T6', total: 4200 },
];

const IncomeChart = () => {
    return (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50 flex flex-col col-span-1 lg:col-span-2 min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#303150]">Biểu đồ Dòng tiền</h3>
                <select className="bg-gray-50 text-sm border-none text-[#7E7F90] px-3 py-1.5 rounded-lg font-medium cursor-pointer focus:ring-0">
                    <option>6 tháng qua</option>
                    <option>Năm nay</option>
                </select>
            </div>
            
            <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" minHeight={250}>
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#69ADFF" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#69ADFF" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#BDBDCB', fontSize: 13 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#BDBDCB', fontSize: 13 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                            labelStyle={{ color: '#7E7F90', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ color: '#69ADFF', fontWeight: 'bold' }}
                        />
                        <CartesianGrid vertical={false} stroke="#F7F7F8" strokeDasharray="3 3"/>
                        <Area 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#69ADFF" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorTotal)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeChart;
