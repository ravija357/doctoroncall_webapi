"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointment.service';
import { Appointment, User } from '@/types';
import { Calendar, Mail, Phone, MapPin, User as UserIcon } from 'lucide-react';
import { getImageUrl } from '@/utils/imageHelper';

interface Patient extends User {
    lastAppointment?: string;
    totalVisits?: number;
}

export default function MyPatientsPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        if (user?.role !== 'doctor') {
            // Optional: redirect if not doctor
            return;
        }

        const fetchPatients = async () => {
            try {
                const appointments = await appointmentService.getDoctorAppointments();
                
                // Process appointments to find unique patients
                const patientMap = new Map<string, Patient>();

                appointments.forEach(app => {
                    const patientId = app.patient._id;
                    if (!patientMap.has(patientId)) {
                        patientMap.set(patientId, {
                            ...app.patient,
                            lastAppointment: app.date,
                            totalVisits: 1
                        });
                    } else {
                        const p = patientMap.get(patientId)!;
                        // Update last appointment if this one is more recent (simple string comparison for ISO dates works)
                        if (app.date > (p.lastAppointment || '')) {
                            p.lastAppointment = app.date;
                        }
                        p.totalVisits = (p.totalVisits || 0) + 1;
                    }
                });

                setPatients(Array.from(patientMap.values()));
            } catch (error) {
                console.error("Failed to fetch patients", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchPatients();
        }
    }, [isAuthenticated, authLoading, user]);

    if (authLoading || loading) {
        return (
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl pt-8 pb-16 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
                <p className="text-gray-500 mt-2">Manage and view your patient history.</p>
            </div>

            {patients.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No patients yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Once you have confirmed appointments, your patients will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <div key={patient._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-50 ring-2 ring-emerald-100">
                                        <img 
                                            src={getImageUrl(patient.image, patient._id)} 
                                            alt={patient.firstName} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{patient.firstName} {patient.lastName}</h3>
                                        <p className="text-xs text-gray-500">Patient ID: {patient._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-emerald-500" />
                                    <span>{patient.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-emerald-500" />
                                    <span>Last Visit: {new Date(patient.lastAppointment || '').toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <UserIcon className="w-4 h-4 text-emerald-500" />
                                    <span>Total Visits: {patient.totalVisits}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2.5 px-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors text-sm">
                                View History
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
