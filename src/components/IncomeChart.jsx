import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

const IncomeChart = ({ transactions = [] }) => {
    const { theme } = useTheme();
    // Calculate last 6 months of income
    const data = useMemo(() => {
        const result = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = `T${d.getMonth() + 1}`;
            
            // Sum income for this month
            const monthIncome = transactions.reduce((sum, tx) => {
                const txDate = new Date(tx.transactionDate);
                if (
                    tx.type === 'income' && 
                    txDate.getMonth() === d.getMonth() && 
                    txDate.getFullYear() === d.getFullYear()
                ) {
                    return sum + tx.amount;
                }
                return sum;
            }, 0);

            result.push({ name: monthStr, total: monthIncome });
        }
        return result;
    }, [transactions]);
    return (
        <div className="bg-white dark:bg-[#1E1E2D] p-6 rounded-[20px] shadow-sm dark:shadow-none border border-gray-50 dark:border-gray-800 flex flex-col col-span-1 lg:col-span-2 min-h-[350px] transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#303150] dark:text-white">Biểu đồ Dòng tiền (6 tháng)</h3>
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
                            tick={{ fill: theme === 'dark' ? '#6B7280' : '#BDBDCB', fontSize: 13 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: theme === 'dark' ? '#6B7280' : '#BDBDCB', fontSize: 13 }}
                            tickFormatter={(value) => formatCurrency(value)}
                            width={80}
                        />
                        <Tooltip 
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: theme === 'dark' ? '1px solid #374151' : 'none', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF'
                            }}
                            labelStyle={{ color: '#7E7F90', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ color: '#69ADFF', fontWeight: 'bold' }}
                        />
                        <CartesianGrid vertical={false} stroke={theme === 'dark' ? '#374151' : '#F7F7F8'} strokeDasharray="3 3"/>
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
