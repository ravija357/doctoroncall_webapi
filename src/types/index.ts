export interface User {
    _id: string;
    email: string;
    role: 'user' | 'doctor' | 'admin';
    image?: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginResponse {
    success: boolean;
    user: User;
    token?: string;
}

export interface Schedule {
    day: string;
    startTime: string;
    endTime: string;
    isOff: boolean;
    _id: string;
}

export interface Doctor {
    _id: string;
    user: User;
    specialization: string;
    experience: number;
    qualifications: string[];
    bio: string;
    fees: number;
    isVerified: boolean;
    averageRating: number;
    totalReviews: number;
    schedules: Schedule[];
    hospital?: string;
}

export interface Appointment {
    _id: string;
    patient: User;
    doctor: Doctor;
    date: string; // ISO date string
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    reason?: string;
    notes?: string;
    createdAt: string;
}

