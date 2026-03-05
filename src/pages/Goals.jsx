import React, { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Target, Trash2, ArrowUpCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] // Default Next Month
    });
    const [addAmount, setAddAmount] = useState('');

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const data = await goalService.getAll();
            setGoals(data);
        } catch (error) {
            console.error("Error fetching goals:", error);
            toast.error("Lỗi khi tải danh sách mục tiêu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            await goalService.create({
                name: formData.name,
                targetAmount: Number(formData.targetAmount),
                currentAmount: 0,
                deadline: formData.deadline
            });
            toast.success("Đã thêm mục tiêu mới!");
            setIsCreateModalOpen(false);
            setFormData({ name: '', targetAmount: '', deadline: new Date().toISOString().split('T')[0] });
            fetchGoals();
        } catch (error) {
            toast.error(error.response?.data || "Lỗi khi tạo mục tiêu.");
        }
    };

    const handleAddMoney = async (e) => {
        e.preventDefault();
        if (!selectedGoal) return;
        
        const amount = Number(addAmount);
        if (amount <= 0) {
            toast.error("Số tiền phải lớn hơn 0");
            return;
        }

        try {
            await goalService.addMoney(selectedGoal.id, amount);
            toast.success("Đã nạp tiền vào mục tiêu!");
            setIsAddMoneyModalOpen(false);
            setAddAmount('');
            fetchGoals();
        } catch (error) {
            toast.error(error.response?.data || "Lỗi khi nạp tiền.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa mục tiêu này? Dữ liệu không thể khôi phục.")) {
            try {
                await goalService.delete(id);
                toast.success("Đã xóa mục tiêu!");
                fetchGoals();
            } catch (error) {
                toast.error("Lỗi khi xóa mục tiêu.");
            }
        }
    };

    const openAddMoneyModal = (goal) => {
        setSelectedGoal(goal);
        setIsAddMoneyModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in zoom-in duration-300 transition-colors">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mục tiêu tài chính</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Lên kế hoạch và theo dõi tiến độ tiết kiệm cho những giấc mơ của bạn.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#69ADFF] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-[#5a9aeb] hover:-translate-y-1 transition-all flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" /> Tạo mục tiêu mới
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#69ADFF]"></div>
                </div>
            ) : goals.length === 0 ? (
                <div className="bg-white dark:bg-[#1E1E2D] rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center transition-colors">
                    <Target className="w-20 h-20 text-[#BDBDCB] dark:text-gray-600 mb-6 block mx-auto" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-[#303150] dark:text-white mb-2">Chưa có mục tiêu nào</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">Bạn chưa đặt mục tiêu tiết kiệm nào. Hãy tạo mục tiêu đầu tiên ngay hôm nay nhé!</p>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#F7F7F8] dark:bg-[#2A2A3C] text-[#69ADFF] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-[#2A2A3C]/80 transition-colors"
                    >
                        Tạo mục tiêu
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => {
                        const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                        const isCompleted = percent >= 100;
                        
                        return (
                            <div key={goal.id} className="bg-white dark:bg-[#1E1E2D] p-6 rounded-[24px] shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#69ADFF]/5 to-[#0DBACC]/5 dark:from-[#69ADFF]/10 dark:to-[#0DBACC]/10 rounded-bl-[100px] -z-0"></div>
                                
                                <div className="flex justify-between items-start mb-6 z-10">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isCompleted ? 'bg-[#E3F6EE] dark:bg-[#00C48C]/20 text-[#00C48C]' : 'bg-[#EAF3FF] dark:bg-[#69ADFF]/20 text-[#69ADFF]'}`}>
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#303150] dark:text-white text-lg">{goal.name}</h3>
                                            <span className="text-xs font-semibold text-[#BDBDCB] dark:text-gray-500">Hạn: {formatDate(goal.deadline)}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleDelete(goal.id)}
                                        className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mb-3 z-10">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-[#7E7F90] dark:text-gray-400 mb-1">Đã tích luỹ</span>
                                        <span className="font-extrabold text-[#303150] dark:text-white text-xl">{formatCurrency(goal.currentAmount)}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-semibold text-[#7E7F90] dark:text-gray-400 mb-1">Mục tiêu</span>
                                        <span className="font-bold text-[#BDBDCB] dark:text-gray-500 text-sm">{formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-[#F7F7F8] dark:bg-[#2A2A3C] rounded-full overflow-hidden flex mb-2 shadow-inner z-10 transition-colors">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-[#00C48C]' : 'bg-gradient-to-r from-[#69ADFF] to-[#0DBACC]'}`} 
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold z-10">
                                    <span className={isCompleted ? 'text-[#00C48C]' : 'text-[#69ADFF]'}>{percent}%</span>
                                    {isCompleted ? (
                                        <span className="text-[#00C48C]">Hoàn thành 🎉</span>
                                    ) : (
                                        <span className="text-[#7E7F90] dark:text-gray-400">Còn {formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-center z-10 transition-colors">
                                    <button 
                                        onClick={() => openAddMoneyModal(goal)}
                                        disabled={isCompleted}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all ${isCompleted ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'bg-[#EAF3FF] dark:bg-[#69ADFF]/10 text-[#69ADFF] hover:bg-[#69ADFF] hover:text-white'}`}
                                    >
                                        <ArrowUpCircle className="w-5 h-5 mr-2" /> 
                                        {isCompleted ? 'Đã đạt mục tiêu' : 'Thêm tiền vào mục tiêu'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Tạo Mục Tiêu Mới */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1E1E2D] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-[#F7F7F8] dark:bg-[#1A1A24] transition-colors">
                            <h3 className="text-lg font-bold text-[#303150] dark:text-white">Tạo mục tiêu mới</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-[#BDBDCB] dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateGoal} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#7E7F90] dark:text-gray-400 mb-2">Tên mục tiêu</label>
                                <input 
                                    type="text" name="name" value={formData.name} onChange={handleChange} required
                                    placeholder="Ví dụ: Mua iPhone 16"
                                    className="w-full bg-[#F7F7F8] dark:bg-[#2A2A3C] border border-transparent dark:border-gray-700 rounded-xl px-4 py-3 text-[#303150] dark:text-white font-medium focus:ring-2 focus:ring-[#69ADFF] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#7E7F90] dark:text-gray-400 mb-2">Số tiền cần đạt (VNĐ)</label>
                                <input 
                                    type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} required min="1000"
                                    placeholder="50000000"
                                    className="w-full bg-[#F7F7F8] dark:bg-[#2A2A3C] border border-transparent dark:border-gray-700 rounded-xl px-4 py-3 text-[#303150] dark:text-white font-bold text-lg focus:ring-2 focus:ring-[#69ADFF] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#7E7F90] dark:text-gray-400 mb-2">Ngày dự kiến hoàn thành</label>
                                <input 
                                    type="date" name="deadline" value={formData.deadline} onChange={handleChange} required
                                    className="w-full bg-[#F7F7F8] dark:bg-[#2A2A3C] border border-transparent dark:border-gray-700 rounded-xl px-4 py-3 text-[#303150] dark:text-white font-medium focus:ring-2 focus:ring-[#69ADFF] outline-none transition-colors"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-[#69ADFF] hover:bg-[#5a9aeb] text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-200 mt-2">
                                Bắt đầu tiết kiệm
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Nạp Tiền */}
            {isAddMoneyModalOpen && selectedGoal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1E1E2D] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-[#F7F7F8] dark:bg-[#1A1A24] transition-colors">
                            <h3 className="text-lg font-bold text-[#303150] dark:text-white">Nạp tiền</h3>
                            <button onClick={() => setIsAddMoneyModalOpen(false)} className="text-[#BDBDCB] dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddMoney} className="p-6">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 text-center">
                                Thêm tiền vào mục tiêu <span className="font-bold text-[#303150] dark:text-white">{selectedGoal.name}</span>
                            </p>
                            <div className="mb-6 relative">
                                <input 
                                    type="number" 
                                    value={addAmount} 
                                    onChange={(e) => setAddAmount(e.target.value)} 
                                    required 
                                    min="1"
                                    max={selectedGoal.targetAmount - selectedGoal.currentAmount}
                                    placeholder="Nhập số tiền..."
                                    className="w-full bg-[#F7F7F8] dark:bg-[#2A2A3C] border border-transparent dark:border-gray-700 rounded-xl px-4 py-4 text-[#303150] dark:text-white font-bold text-2xl text-center focus:ring-2 focus:ring-[#0DBACC] outline-none transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BDBDCB] font-bold">₫</span>
                            </div>
                            <button type="submit" className="w-full py-3 bg-[#0DBACC] hover:bg-[#0ba5b5] text-white font-bold rounded-xl transition-colors shadow-md shadow-cyan-200">
                                Xác nhận nạp
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
