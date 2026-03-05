import axios from 'axios';
import api from './api';

const API_URL = `${api.defaults.baseURL?.replace('/api', '')}/upload`;

export const uploadService = {
    uploadFile: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });

        if (response.data.success) {
            const baseUrl = api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3001';
            return `${baseUrl}${response.data.path}`;
        } else {
            throw new Error(response.data.message || 'Upload failed');
        }
    }
};
