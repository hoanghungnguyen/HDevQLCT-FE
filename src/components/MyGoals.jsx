import React from 'react';
import { Plane, Car } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const MyGoals = () => {
    // Dummy Data
    const goals = [
        {
            id: 1,
            title: 'Du lịch (Travel)',
            icon: <Plane className="w-6 h-6 text-[#69ADFF]" />,
            current: 10000000,
            target: 20000000,
            color: 'bg-[#69ADFF]',
        },
        {
            id: 2,
            title: 'Mua ô tô (Car)',
            icon: <Car className="w-6 h-6 text-[#0DBACC]" />,
            current: 85000000,
            target: 425000000,
            color: 'bg-[#0DBACC]',
        }
    ];

    return (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50 flex flex-col col-span-1 min-h-[350px]">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#303150]">Mục tiêu của tôi</h3>
                <button className="bg-[#69ADFF] hover:bg-[#5a9aeb] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                    Sửa mục tiêu
                </button>
            </div>

            <div className="flex flex-col space-y-8 flex-1 justify-center">
                {goals.map((goal) => {
                    const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                    
                    return (
                        <div key={goal.id} className="flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F7F7F8] flex items-center justify-center mr-4">
                                        {goal.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#303150] font-bold text-sm mb-1">{goal.title}</span>
                                        <span className="text-xs text-[#7E7F90] font-semibold">
                                            {formatCurrency(goal.current)} <span className="text-[#BDBDCB] font-medium mx-1">/</span> {formatCurrency(goal.target)}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[#303150] font-extrabold text-sm">{percent}%</span>
                            </div>
                            
                            {/* Dotted/Dashed Progress Bar Simulation */}
                            <div className="w-full h-2.5 bg-[#F7F7F8] rounded-full overflow-hidden flex shadow-inner">
                                <div 
                                    className={`h-full ${goal.color} rounded-full transition-all duration-1000 ease-in-out`} 
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyGoals;
