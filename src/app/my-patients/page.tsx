"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointment.service';
import { Appointment, User } from '@/types';
import { Calendar, Mail, User as UserIcon, Activity, ChevronRight, Stethoscope } from 'lucide-react';
import { getImageUrl } from '@/utils/imageHelper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';

interface Patient extends User {
    lastAppointment?: string;
    totalVisits?: number;
}

// Reusable Standard Patient Card Component
function PatientCard({ patient, onClick }: { patient: Patient, onClick: () => void }) {
    return (
        <div
            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img 
                        src={getImageUrl(patient.image, patient._id)} 
                        alt={patient.firstName} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-800 truncate">{patient.firstName} {patient.lastName}</h3>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">ID: {patient._id.slice(-6).toUpperCase()}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">Last: {new Date(patient.lastAppointment || '').toLocaleDateString()}</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Visits</span>
                    <p className="text-lg font-bold text-slate-800">{patient.totalVisits}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

export default function MyPatientsPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        if (user?.role !== 'doctor') return;

        const fetchPatients = async () => {
            try {
                const appointments = await appointmentService.getDoctorAppointments();
                setAllAppointments(appointments);
                
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

        if (isAuthenticated) fetchPatients();
    }, [isAuthenticated, authLoading, user]);

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const selectedPatient = patients.find(p => p._id === selectedPatientId);
    const patientHistory = selectedPatientId 
        ? allAppointments
            .filter(app => app.patient._id === selectedPatientId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : [];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="container mx-auto max-w-7xl pt-16 pb-32 px-6">
                <div className="mb-12">
                    <div className="w-12 h-1.5 bg-emerald-500 rounded-full mb-4" />
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Patient History
                    </h1>
                    <p className="text-lg text-slate-500 mt-2 font-medium">
                        View and manage your patient roster.
                    </p>
                </div>

                {patients.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                        <UserIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Patients Yet</h3>
                        <p className="text-slate-500">
                            Start confirming appointments to see your patient list.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.map((patient) => (
                            <PatientCard 
                                key={patient._id} 
                                patient={patient} 
                                onClick={() => setSelectedPatientId(patient._id)} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* History Modal (3D Animated entry via Framer Motion & Shadcn integration) */}
            <AnimatePresence>
                {selectedPatientId && selectedPatient && (
                    <Dialog open={true} onOpenChange={(open) => !open && setSelectedPatientId(null)}>
                        <DialogContent className="max-w-3xl bg-white/90 backdrop-blur-3xl border-white/40 shadow-2xl p-0 overflow-hidden sm:rounded-[2.5rem]">
                            {/* Modal Header Premium Styling */}
                            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full -mr-20 -mt-20" />
                                <DialogHeader className="relative z-10 sm:text-left">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-3xl overflow-hidden bg-white/10 ring-2 ring-white/20 shadow-2xl p-1 shrink-0">
                                            <img 
                                                src={getImageUrl(selectedPatient.image, selectedPatient._id)} 
                                                alt={selectedPatient.firstName} 
                                                className="w-full h-full object-cover rounded-[1.25rem]"
                                            />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-3xl font-black tracking-tight mb-2">
                                                {selectedPatient.firstName} {selectedPatient.lastName}
                                            </DialogTitle>
                                            <DialogDescription className="text-emerald-400 font-bold tracking-widest uppercase text-xs">
                                                Patient Comprehensive History
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>
                            
                            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
                                <div className="space-y-4">
                                    {patientHistory.map((appt, i) => (
                                        <div 
                                            key={appt._id} 
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex gap-6 items-center">
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[90px] group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors duration-300">
                                                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                                        {new Date(appt.date).toLocaleDateString('default', { month: 'short' })}
                                                    </div>
                                                    <div className="text-3xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors my-1">
                                                        {new Date(appt.date).getDate()}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-400">
                                                        {new Date(appt.date).getFullYear()}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
                                                        {appt.reason || 'General Consultation'}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                                            <span>{appt.startTime} - {appt.endTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0 md:ml-0 flex flex-col items-end gap-2">
                                                <span className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl ${
                                                    appt.status === 'completed' ? 'bg-blue-100 text-blue-700 shadow-sm shadow-blue-200' :
                                                    appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-200' :
                                                    appt.status === 'cancelled' ? 'bg-rose-100 text-rose-700 shadow-sm shadow-rose-200' :
                                                    'bg-amber-100 text-amber-700 shadow-sm shadow-amber-200'
                                                }`}>
                                                    {appt.status}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                                                    <Stethoscope className="w-4 h-4" />
                                                    Consultation
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    );
}
