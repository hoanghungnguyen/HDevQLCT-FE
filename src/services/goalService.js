import api from './api';

export const goalService = {
    getAll: async () => {
        const response = await api.get('/goals');
        return response.data;
    },
    
    create: async (data) => {
        const response = await api.post('/goals', data);
        return response.data;
    },

    addMoney: async (id, amount) => {
        const response = await api.put(`/goals/${id}/add-money`, { amount });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/goals/${id}`);
        return response.data;
    }
};
