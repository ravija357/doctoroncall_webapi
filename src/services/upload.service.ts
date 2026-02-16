import axios from 'axios';

const API_URL = 'http://localhost:3001/upload';

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
            return `http://localhost:3001${response.data.path}`;
        } else {
            throw new Error(response.data.message || 'Upload failed');
        }
    }
};
