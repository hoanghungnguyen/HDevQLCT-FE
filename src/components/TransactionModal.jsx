import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, onSave, transaction, categories }) => {
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        note: '',
        transactionDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    });

    // Reset form when modal opens/closes or when transaction changes
    useEffect(() => {
        if (transaction) {
            setFormData({
                categoryId: transaction.categoryId || '',
                amount: Math.abs(transaction.amount) || '',
                note: transaction.note || '',
                transactionDate: transaction.transactionDate || new Date().toISOString().split('T')[0]
            });
        } else {
            setFormData({
                categoryId: categories.length > 0 ? categories[0].id : '',
                amount: '',
                note: '',
                transactionDate: new Date().toISOString().split('T')[0]
            });
        }
    }, [transaction, isOpen, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Find category to determine if it's expense or income
        const selectedCat = categories.find(c => c.id === Number(formData.categoryId));
        let finalAmount = Number(formData.amount);
        
        // Mặc định expense sẽ lưu số âm (nếu logic backend hoặc frontend yêu cầu), 
        // nhưng backend Java TransactionDto hiện tại có vẻ lưu số dương và dựa vào Category Type.
        // Tuy nhiên theo code hiện tại, Transactions list đang check `tx.type === 'income'`.
        // Việc cấp số tiền có kèm dấu trừ hay không tuỳ vào policy. Tạm thời pass value positive.

        onSave({
            ...formData,
            categoryId: Number(formData.categoryId),
            amount: finalAmount
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#F7F7F8]">
                    <h3 className="text-lg font-bold text-[#303150]">
                        {transaction ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}
                    </h3>
                    <button onClick={onClose} className="text-[#BDBDCB] hover:text-red-500 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Danh mục */}
                    <div>
                        <label className="block text-sm font-semibold text-[#7E7F90] mb-2">Danh mục</label>
                        <select 
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#F7F7F8] border-none rounded-xl px-4 py-3 text-[#303150] font-medium focus:ring-2 focus:ring-[#69ADFF] outline-none transition-shadow"
                        >
                            <option value="" disabled>-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.type === 'income' ? 'Thu' : 'Chi'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Số tiền */}
                    <div>
                        <label className="block text-sm font-semibold text-[#7E7F90] mb-2">Số tiền (VNĐ)</label>
                        <div className="relative">
                            <input 
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="Ví dụ: 500000"
                                className="w-full bg-[#F7F7F8] border-none rounded-xl pl-4 pr-10 py-3 text-[#303150] font-bold text-lg focus:ring-2 focus:ring-[#69ADFF] outline-none transition-shadow"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BDBDCB] font-bold">₫</span>
                        </div>
                    </div>

                    {/* Ngày giao dịch */}
                    <div>
                        <label className="block text-sm font-semibold text-[#7E7F90] mb-2">Ngày giao dịch</label>
                        <input 
                            type="date"
                            name="transactionDate"
                            value={formData.transactionDate}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#F7F7F8] border-none rounded-xl px-4 py-3 text-[#303150] font-medium focus:ring-2 focus:ring-[#69ADFF] outline-none transition-shadow"
                        />
                    </div>

                    {/* Ghi chú */}
                    <div>
                        <label className="block text-sm font-semibold text-[#7E7F90] mb-2">Ghi chú</label>
                        <textarea 
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Mô tả ngắn gọn..."
                            rows="2"
                            className="w-full bg-[#F7F7F8] border-none rounded-xl px-4 py-3 text-[#303150] focus:ring-2 focus:ring-[#69ADFF] outline-none transition-shadow resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-4 flex space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-[#7E7F90] font-bold rounded-xl transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 bg-[#69ADFF] hover:bg-[#5a9aeb] text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-200"
                        >
                            {transaction ? 'Cập nhật' : 'Lưu giao dịch'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
