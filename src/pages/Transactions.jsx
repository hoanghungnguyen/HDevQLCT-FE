import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal & CRUD State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);

    // Filter states (Default: Current Month)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [filterMonth, setFilterMonth] = useState(currentMonth);
    const [filterYear, setFilterYear] = useState(currentYear);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [txData, cats] = await Promise.all([
                transactionService.getFiltered(filterMonth, filterYear),
                categoryService.getAll()
            ]);
            
            // Sort Transactions Descending Date
            txData.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
            setTransactions(txData);
            setCategories(cats);
        } catch (error) {
            console.error("Failed to fetch transactions/categories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterMonth, filterYear]);

    // --- HANDLERS ---
    const handleOpenModal = (tx = null) => {
        setEditingTx(tx);
        setIsModalOpen(true);
    };

    const handleSaveTransaction = async (formData) => {
        try {
            let finalCategoryId = formData.categoryId;

            // Xử lý tạo mới Danh mục nếu người dùng chọn tùy chọn "Thêm danh mục mới"
            if (formData.isNewCategory) {
                const newCat = await categoryService.create({
                    name: formData.newCategoryName,
                    type: formData.newCategoryType,
                    icon: 'plus'
                });
                finalCategoryId = newCat.id; // Lấy ID của danh mục vừa tạo xong
            }

            const txData = {
                categoryId: finalCategoryId,
                amount: formData.amount,
                note: formData.note,
                transactionDate: formData.transactionDate
            };

            if (editingTx) {
                await transactionService.update(editingTx.id, txData);
            } else {
                await transactionService.create(txData);
            }
            setIsModalOpen(false);
            fetchData(); // Reload list
        } catch (error) {
            console.error("Error saving transaction", error);
            alert("Đã xảy ra lỗi khi lưu giao dịch. Vui lòng thử lại!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
            try {
                await transactionService.delete(id);
                fetchData(); // Reload
            } catch (error) {
                console.error("Failed to delete transaction", error);
                alert("Lỗi khi xoá giao dịch.");
            }
        }
    };


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
                        onClick={fetchData}
                        className="bg-gray-100 text-[#7E7F90] px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition"
                    >
                        Làm mới
                    </button>
                </div>
                {/* Add Nút bấm Thêm Mới Góc phải */}
                <div className="ml-auto">
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-[#69ADFF] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-200 hover:bg-[#5a9aeb] hover:-translate-y-0.5 transition flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Thêm giao dịch
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
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#BDBDCB] uppercase tracking-wider">Ngày</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#BDBDCB] uppercase tracking-wider">Mô tả</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#BDBDCB] uppercase tracking-wider">Danh mục</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-[#BDBDCB] uppercase tracking-wider">Số tiền</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-[#BDBDCB] uppercase tracking-wider w-24">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#7E7F90]">
                                        {formatDate(tx.transactionDate)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#303150] font-bold">
                                        {tx.note || <span className="text-[#BDBDCB] italic font-medium">Không có ghi chú</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tx.type === 'income' ? 'bg-[#E3D6FF]/30 text-[#9F7FE0]' : 'bg-[#FFC0DB]/30 text-[#F18AB5]'}`}>
                                            {tx.categoryName || 'Không phân loại'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-right">
                                        <span className={tx.type === 'income' ? 'text-[#0DBACC]' : 'text-[#303150]'}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <div className="flex items-center justify-center space-x-3">
                                            <button 
                                                onClick={() => handleOpenModal(tx)}
                                                className="text-[#69ADFF] hover:text-[#5a9aeb] transition" title="Sửa"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(tx.id)}
                                                className="text-red-400 hover:text-red-500 transition" title="Xoá"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            <TransactionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTransaction}
                transaction={editingTx}
                categories={categories}
            />
        </div>
    );
};

export default Transactions;
