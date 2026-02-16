import api from './api';
import { Appointment } from '../types';

export const appointmentService = {
    createAppointment: async (data: {
        doctorId: string;
        date: string;
        startTime: string;
        endTime: string;
        reason?: string;
    }) => {
        const res = await api.post<{ success: boolean; data: Appointment }>('/appointments', data);
        return res.data.data;
    },

    getMyAppointments: async () => {
        const res = await api.get<{ success: boolean; data: Appointment[] }>('/appointments/my-appointments');
        return res.data.data;
    },

    getDoctorAppointments: async () => {
        const res = await api.get<{ success: boolean; data: Appointment[] }>('/appointments/doctor-appointments');
        return res.data.data;
    },

    deleteAppointment: async (id: string) => {
        const res = await api.delete<{ success: boolean; message: string }>(`/appointments/${id}`);
        return res.data;
    },

    cancelAppointment: async (id: string) => {
        const res = await api.patch<{ success: boolean; data: Appointment; message: string }>(`/appointments/${id}/cancel`);
        return res.data;
    }
};
