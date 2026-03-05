import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { categoryService } from "../services/categoryService";

const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  transaction,
  categories,
  onCategoryDelete,
}) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    note: "",
    transactionDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    isNewCategory: false,
    newCategoryName: "",
    newCategoryType: "expense",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý click ngoài dropdown để tự đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset form when modal opens/closes or when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        categoryId: transaction.categoryId || "",
        amount: Math.abs(transaction.amount) || "",
        note: transaction.note || "",
        transactionDate:
          transaction.transactionDate || new Date().toISOString().split("T")[0],
        isNewCategory: false,
        newCategoryName: "",
        newCategoryType: "expense",
      });
    } else {
      setFormData({
        categoryId: categories.length > 0 ? categories[0].id : "",
        amount: "",
        note: "",
        transactionDate: new Date().toISOString().split("T")[0],
        isNewCategory: false,
        newCategoryName: "",
        newCategoryType: "expense",
      });
    }
  }, [transaction, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCategory = (value) => {
    if (value === "NEW") {
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        isNewCategory: true,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        isNewCategory: false,
      }));
    }
    setIsDropdownOpen(false);
  };

  const handleDeleteCategory = async (catId, e) => {
    e.stopPropagation(); // Ngăn sự kiện click list trigger việc select danh mục
    if (window.confirm("Bạn có chắc muốn xoá danh mục này không?")) {
      try {
        await categoryService.delete(catId);
        toast.success("Đã xoá danh mục!");
        // Nếu đang select nó thì reset
        if (
          formData.categoryId === catId ||
          Number(formData.categoryId) === catId
        ) {
          setFormData((prev) => ({
            ...prev,
            categoryId: "",
            isNewCategory: false,
          }));
        }

        // Gọi callback để parent component load lại danh sách categories
        if (onCategoryDelete) {
          onCategoryDelete();
        }
      } catch (error) {
        console.error("Delete category error", error);

        // Tránh lỗi Object không thể render trong React (khi backend trả JSON Array/Object fallback)
        let errorMsg = "Lỗi. Danh mục này có thể đang chứa giao dịch.";
        if (error.response?.data) {
          if (typeof error.response.data === "string") {
            errorMsg = error.response.data;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else {
            errorMsg = JSON.stringify(error.response.data);
          }
        }
        toast.error(errorMsg);
      }
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
      toast.error(
        "Đến từ tương lai à? Ngày giao dịch không được lớn hơn hôm nay!",
      );
      return;
    }

    onSave({
      ...formData,
      categoryId: formData.isNewCategory ? "NEW" : Number(formData.categoryId),
      amount: finalAmount,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#F7F7F8]">
          <h3 className="text-lg font-bold text-[#303150]">
            {transaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#BDBDCB] hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Danh mục */}
          <div>
            <label className="block text-sm font-semibold text-[#7E7F90] mb-2">
              Danh mục
            </label>
            {categories.length === 0 ? (
              <div className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
                ⚠️ Bạn chưa có danh mục nào! Vui lòng làm mới trang.
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`w-full bg-[#F7F7F8] border-none rounded-xl px-4 py-3 text-[#303150] font-medium cursor-pointer flex justify-between items-center transition-shadow ${isDropdownOpen ? "ring-2 ring-[#69ADFF]" : ""}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>
                    {formData.isNewCategory
                      ? "➕ Thêm danh mục mới..."
                      : categories.find(
                          (c) => c.id === Number(formData.categoryId),
                        )?.name || "-- Chọn danh mục --"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                    <div className="p-1">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className={`flex justify-between items-center px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer text-sm font-medium transition-colors ${Number(formData.categoryId) === cat.id ? "bg-blue-50 text-[#69ADFF]" : "text-[#303150]"}`}
                          onClick={() => handleSelectCategory(cat.id)}
                        >
                          <span>
                            {cat.name}{" "}
                            <span className="text-gray-400 text-xs ml-1">
                              ({cat.type === "income" ? "Thu" : "Chi"})
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCategory(cat.id, e)}
                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all"
                            title="Xoá danh mục này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1"></div>
                      <div
                        className="px-4 py-3 font-bold text-[#69ADFF] hover:bg-blue-50 cursor-pointer rounded-lg text-sm flex items-center"
                        onClick={() => handleSelectCategory("NEW")}
                      >
                        ➕ Thêm danh mục mới...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hiển thị form con nếu chọn Thêm mới danh mục */}
            {formData.isNewCategory && (
              <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-xs font-bold text-[#69ADFF] mb-1">
                    Tên danh mục mới
                  </label>
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
                      checked={formData.newCategoryType === "expense"}
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
                      checked={formData.newCategoryType === "income"}
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
            <label className="block text-sm font-semibold text-[#7E7F90] mb-2">
              Số tiền (VNĐ)
            </label>
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
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BDBDCB] font-bold">
                ₫
              </span>
            </div>
          </div>

          {/* Ngày giao dịch */}
          <div>
            <label className="block text-sm font-semibold text-[#7E7F90] mb-2">
              Ngày giao dịch
            </label>
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
            <label className="block text-sm font-semibold text-[#7E7F90] mb-2">
              Ghi chú
            </label>
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
                categories.length === 0 && !formData.isNewCategory
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-[#69ADFF] hover:bg-[#5a9aeb] text-white shadow-blue-200"
              }`}
            >
              {transaction ? "Cập nhật" : "Lưu giao dịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
