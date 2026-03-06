import api from './api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    verifyDoctor: async (id: string) => {
        const response = await api.patch(`/admin/doctors/${id}/verify`);
        return response.data;
    }
};
