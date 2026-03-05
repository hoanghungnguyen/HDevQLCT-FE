import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // Expected: { token: "eyJhbG...", type: "Bearer", ... }
    },
    
    register: async (username, email, password) => {
        const response = await api.post('/users/register', { username, email, password });
        return response.data;
    }
};
