import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // Expected: { token: "eyJhbG...", type: "Bearer", ... }
    },
    
    register: async (username, email, password) => {
        // Backend entity User.java expects the field 'passwordHash' instead of 'password'
        const response = await api.post('/users/register', { 
            username, 
            email, 
            passwordHash: password 
        });
        return response.data;
    }
};
