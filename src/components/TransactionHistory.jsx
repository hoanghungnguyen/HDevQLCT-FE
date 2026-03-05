import React from 'react';
import { ShoppingBag, Coffee, Car } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionHistory = ({ transactions }) => {
    // Helper to pick random icon if category is empty
    const getIcon = (note) => {
        const str = (note || '').toLowerCase();
        if (str.includes('cà phê') || str.includes('cafe') || str.includes('coffee')) return <Coffee className="w-5 h-5 text-[#BDBDCB]" />;
        if (str.includes('xe') || str.includes('car')) return <Car className="w-5 h-5 text-[#BDBDCB]" />;
        return <ShoppingBag className="w-5 h-5 text-[#BDBDCB]" />;
    };

    return (
        <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-50 flex flex-col col-span-1 lg:col-span-2 min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#303150]">Lịch sử giao dịch</h3>
                <div className="flex space-x-4 text-sm font-medium">
                    <span className="text-[#69ADFF] cursor-pointer">Gần đây</span>
                    <span className="text-[#BDBDCB] hover:text-[#7E7F90] cursor-pointer transition">Cũ nhất</span>
                    <span className="text-[#BDBDCB] hover:text-[#7E7F90] cursor-pointer transition">Thêm</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="text-left text-[#BDBDCB] text-xs font-semibold uppercase tracking-wider border-b border-gray-50">
                            <th className="pb-3 pl-2">Người nhận / Ghi chú</th>
                            <th className="pb-3">Loại</th>
                            <th className="pb-3">Ngày</th>
                            <th className="pb-3 text-right pr-2">Số tiền</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions && transactions.length > 0 ? (
                            transactions.slice(0, 5).map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors cursor-default">
                                    <td className="py-4 pl-2">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center mr-4">
                                                {getIcon(tx.note || tx.categoryName)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#303150]">
                                                    {tx.note || tx.categoryName || 'Giao dịch không tên'}
                                                </span>
                                                <span className="text-xs font-semibold text-[#BDBDCB] mt-0.5">
                                                    {tx.categoryName || 'Chưa phân loại'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm font-semibold text-[#7E7F90]">
                                        {tx.type === 'income' ? "Thu nhập" : "Chi tiêu"}
                                    </td>
                                    <td className="py-4 text-sm font-semibold text-[#7E7F90]">
                                        {formatDate(tx.transactionDate)}
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <span className={`text-sm font-extrabold ${tx.type === 'income' ? 'text-[#0DBACC]' : 'text-[#303150]'}`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-[#BDBDCB] text-sm">
                                    Chưa có giao dịch nào gần đây.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
