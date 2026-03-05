import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionModal = ({ isOpen, onClose, onSave, transaction, categories }) => {
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        note: '',
        transactionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        isNewCategory: false,
        newCategoryName: '',
        newCategoryType: 'expense'
    });

    // Reset form when modal opens/closes or when transaction changes
    useEffect(() => {
        if (transaction) {
            setFormData({
                categoryId: transaction.categoryId || '',
                amount: Math.abs(transaction.amount) || '',
                note: transaction.note || '',
                transactionDate: transaction.transactionDate || new Date().toISOString().split('T')[0],
                isNewCategory: false,
                newCategoryName: '',
                newCategoryType: 'expense'
            });
        } else {
            setFormData({
                categoryId: categories.length > 0 ? categories[0].id : '',
                amount: '',
                note: '',
                transactionDate: new Date().toISOString().split('T')[0],
                isNewCategory: false,
                newCategoryName: '',
                newCategoryType: 'expense'
            });
        }
    }, [transaction, isOpen, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'categoryId' && value === 'NEW') {
            setFormData(prev => ({ ...prev, categoryId: value, isNewCategory: true }));
        } else if (name === 'categoryId') {
            setFormData(prev => ({ ...prev, [name]: value, isNewCategory: false }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let finalAmount = Number(formData.amount);

        // Validation: Số tiền phải lớn hơn 0
        if (finalAmount <= 0) {
            toast.error("Số tiền phải lớn hơn 0!");
            return;
        }

        // Validation: Ngày giao dịch không được lớn hơn ngày hiện tại
        const selectedDate = new Date(formData.transactionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to midnight for comparison

        if (selectedDate > today) {
            toast.error("Đến từ tương lai à? Ngày giao dịch không được lớn hơn hôm nay!");
            return;
        }

        onSave({
            ...formData,
            categoryId: formData.isNewCategory ? 'NEW' : Number(formData.categoryId),
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
                        {categories.length === 0 ? (
                            <div className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
                                ⚠️ Bạn chưa có danh mục nào! Vui lòng làm mới trang.
                            </div>
                        ) : (
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
                                <option value="NEW" className="font-bold text-[#69ADFF]">➕ Thêm danh mục mới...</option>
                            </select>
                        )}
                        
                        {/* Hiển thị form con nếu chọn Thêm mới danh mục */}
                        {formData.isNewCategory && (
                            <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-xs font-bold text-[#69ADFF] mb-1">Tên danh mục mới</label>
                                    <input 
                                        type="text"
                                        name="newCategoryName"
                                        value={formData.newCategoryName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ví dụ: Đổ xăng, Cà phê..."
                                        className="w-full bg-white border-none rounded-lg px-3 py-2.5 text-sm text-[#303150] shadow-sm focus:ring-2 focus:ring-[#69ADFF] outline-none"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-[#303150] cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="newCategoryType" 
                                            value="expense"
                                            checked={formData.newCategoryType === 'expense'}
                                            onChange={handleChange}
                                            className="text-[#F18AB5] focus:ring-[#F18AB5]"
                                        />
                                        <span>Khoản Chi (-)</span>
                                    </label>
                                    <label className="flex items-center space-x-2 text-sm font-medium text-[#303150] cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="newCategoryType" 
                                            value="income"
                                            checked={formData.newCategoryType === 'income'}
                                            onChange={handleChange}
                                            className="text-[#0DBACC] focus:ring-[#0DBACC]"
                                        />
                                        <span>Khoản Thu (+)</span>
                                    </label>
                                </div>
                            </div>
                        )}
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
                            disabled={categories.length === 0 && !formData.isNewCategory}
                            className={`flex-1 py-3 font-bold rounded-xl transition-colors shadow-md ${
                                (categories.length === 0 && !formData.isNewCategory)
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                                : "bg-[#69ADFF] hover:bg-[#5a9aeb] text-white shadow-blue-200"
                            }`}
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
