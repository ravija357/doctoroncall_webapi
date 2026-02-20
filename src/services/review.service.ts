import api from './api';

export interface CreateReviewParams {
    doctorId: string;
    appointmentId?: string; // Optional for direct profile ratings
    rating: number;
    comment?: string;
}

export const reviewService = {
    createReview: async (params: CreateReviewParams) => {
        try {
            const response = await api.post('/reviews', params);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    },

    getDoctorReviews: async (doctorId: string) => {
        try {
            const response = await api.get(`/reviews/${doctorId}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    }
};
