import api from './api';

export const messageService = {
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ success: boolean; fileUrl: string; filename: string; mimetype: string }>('/messages/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async getMessages(id: string) {
        const response = await api.get(`/messages/${id}`);
        return response.data;
    },

    async getContacts() {
        const response = await api.get('/messages/contacts');
        return response.data;
    }
};
