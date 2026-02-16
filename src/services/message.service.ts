import api from './api';

export const messageService = {
    async getMessages(id: string) {
        const response = await api.get(`/messages/${id}`);
        return response.data;
    },

    async getContacts() {
        const response = await api.get('/messages/contacts');
        return response.data;
    }
};
