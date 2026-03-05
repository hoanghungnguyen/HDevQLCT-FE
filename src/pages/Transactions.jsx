import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { formatCurrency, formatDate } from '../utils/formatters';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states (Default: Current Month)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [filterMonth, setFilterMonth] = useState(currentMonth);
    const [filterYear, setFilterYear] = useState(currentYear);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await transactionService.getFiltered(filterMonth, filterYear);
            console.log(data);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filterMonth, filterYear]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử giao dịch</h1>
            
            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
                    <select 
                        value={filterMonth} 
                        onChange={(e) => setFilterMonth(Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
                    <input 
                        type="number"
                        value={filterYear}
                        onChange={(e) => setFilterYear(Number(e.target.value))}
                        className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <button 
                        onClick={fetchTransactions}
                        className="bg-indigo-50 text-indigo-700 px-4 py-2 border border-indigo-200 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
                    >
                        Làm mới
                    </button>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Đang tải danh sách giao dịch...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        Không có giao dịch nào trong khoảng thời gian này.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Danh mục</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(tx.transactionDate)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {tx.note || <span className="text-gray-400 italic">Không có ghi chú</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        #{tx.categoryId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                                        {formatCurrency(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Transactions;
