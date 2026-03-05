import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Wallet, ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';

const SummaryCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Tổng số dư - Turquoise */}
            <div className="rounded-[20px] p-6 flex flex-col justify-between h-[140px] shadow-[0_10px_40px_-15px_rgba(13,186,204,0.6)] bg-gradient-to-br from-[#0DBACC] to-[#B4F1F1] text-white hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
                <div className="flex items-center space-x-3 z-10">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-sm opacity-90 tracking-wide">Tổng số dư</span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight mt-2 z-10">
                    {formatCurrency(stats?.balance || 0)}
                </div>
                <div className="flex items-center text-xs mt-2 z-10 opacity-90">
                    <div className="bg-white/20 px-2 py-0.5 rounded-full flex items-center mr-2 font-medium">
                        ✦ Updated
                    </div>
                    <span>Dựa trên giao dịch</span>
                </div>
                {/* Decorative blob */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Tổng thu - Baby Blue */}
            <div className="rounded-[20px] p-6 flex flex-col justify-between h-[140px] shadow-[0_10px_40px_-15px_rgba(105,173,255,0.6)] bg-gradient-to-br from-[#69ADFF] to-[#C1DDFF] text-white hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
                <div className="flex items-center space-x-3 z-10">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <ArrowUpCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-sm opacity-90 tracking-wide">Tổng thu nhập</span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight mt-2 z-10">
                    {formatCurrency(stats?.totalIncome || 0)}
                </div>
                <div className="flex items-center text-xs mt-2 z-10 opacity-90">
                    <div className="bg-white/20 px-2 py-0.5 rounded-full flex items-center mr-2 font-medium">
                        ↑ Tích cực
                    </div>
                    <span>Tháng này</span>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Tổng chi phí - Cotton Candy */}
            <div className="rounded-[20px] p-6 flex flex-col justify-between h-[140px] shadow-[0_10px_40px_-15px_rgba(241,138,181,0.6)] bg-gradient-to-br from-[#F18AB5] to-[#FFC0DB] text-white hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
                <div className="flex items-center space-x-3 z-10">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <ArrowDownCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-sm opacity-90 tracking-wide">Tổng chi phí</span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight mt-2 z-10">
                    {formatCurrency(stats?.totalExpense || 0)}
                </div>
                <div className="flex items-center text-xs mt-2 z-10 opacity-90">
                    <div className="bg-white/20 px-2 py-0.5 rounded-full flex items-center mr-2 font-medium">
                        ↓ Cảnh báo
                    </div>
                    <span>Tháng này</span>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Tiết kiệm - Lavender */}
            <div className="rounded-[20px] p-6 flex flex-col justify-between h-[140px] shadow-[0_10px_40px_-15px_rgba(159,127,224,0.6)] bg-gradient-to-br from-[#9F7FE0] to-[#E3D6FF] text-white hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
                <div className="flex items-center space-x-3 z-10">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <PiggyBank className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-sm opacity-90 tracking-wide">Tổng tiết kiệm</span>
                </div>
                <div className="text-3xl font-extrabold tracking-tight mt-2 z-10">
                    {formatCurrency((stats?.totalIncome || 0) - (stats?.totalExpense || 0))}
                </div>
                <div className="flex items-center text-xs mt-2 z-10 opacity-90">
                    <div className="bg-white/20 px-2 py-0.5 rounded-full flex items-center mr-2 font-medium">
                        ★ Ước tính
                    </div>
                    <span>Dư dả tháng này</span>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
            </div>
        </div>
    );
};

export default SummaryCards;
