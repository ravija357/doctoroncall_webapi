import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/upload';

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
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            return `${baseUrl}${response.data.path}`;
        } else {
            throw new Error(response.data.message || 'Upload failed');
        }
    }
};
