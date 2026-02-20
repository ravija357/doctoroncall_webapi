import api from './api';
import { Doctor } from '../types';

export const doctorService = {
    getAllDoctors: async (filters?: any) => {
        const params = new URLSearchParams();
        if (filters?.specialization) params.append('specialization', filters.specialization);
        if (filters?.minFee) params.append('minFee', filters.minFee.toString());
        if (filters?.maxFee) params.append('maxFee', filters.maxFee.toString());
        if (filters?.name) params.append('name', filters.name); // Using 'name' for bio search as per backend repo logic

        const res = await api.get<{ success: boolean; data: Doctor[] }>(`/doctors?${params.toString()}`);
        return res.data.data;
    },

    getDoctorById: async (id: string) => {
        const res = await api.get<{ success: boolean; data: Doctor }>(`/doctors/${id}`);
        return res.data.data;
    },

    getProfile: async () => {
        const res = await api.get<{ success: boolean; data: Doctor }>('/doctors/profile/me');
        return res.data.data;
    },

    updateSchedule: async (schedules: any[]) => {
        const res = await api.put<{ success: boolean; data: Doctor }>('/doctors/profile/schedule', { schedules });
        return res.data.data;
    },

    updateProfile: async (data: Partial<Doctor>) => {
        const res = await api.put<{ success: boolean; data: Doctor }>('/doctors/profile', data);
        return res.data.data;
    }
};
