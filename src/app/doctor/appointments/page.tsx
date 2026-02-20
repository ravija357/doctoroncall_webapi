"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { Appointment } from "@/types";
import { Calendar, Clock, Search, ChevronLeft } from "lucide-react";
import { getImageUrl } from "@/utils/imageHelper";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DoctorAppointmentsPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'doctor') {
                router.push('/login');
                return;
            }
            fetchAppointments();
        }
    }, [isAuthenticated, user, authLoading, router]);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getDoctorAppointments();
            setAppointments(data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesFilter = filter === 'all' || apt.status === filter;
        const matchesSearch = apt.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              apt.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/doctor/dashboard" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 font-serif">All Appointments</h1>
                        <p className="text-slate-500 mt-1">Manage and track all your patient appointments</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
                                    filter === f 
                                    ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by patient name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64 text-sm"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((apt) => (
                            <div key={apt._id} className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-50 hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6 group">
                                <div className="flex items-center gap-4 flex-1 w-full">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden ring-2 ring-slate-50 group-hover:ring-emerald-100 transition-all">
                                        <img 
                                            src={getImageUrl(apt.patient.image, apt.patient._id)} 
                                            alt="Patient" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-800">{apt.patient.firstName} {apt.patient.lastName}</h3>
                                        <p className="text-slate-500 text-sm font-medium">{apt.reason || 'General Consultation'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-row md:flex-col gap-4 md:gap-1 items-center md:items-end w-full md:w-auto justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                        <span className="font-bold">{new Date(apt.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Clock className="w-4 h-4 text-emerald-500" />
                                        <span className="font-bold">{apt.startTime} - {apt.endTime}</span>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex justify-end">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">No appointments found</h3>
                            <p className="text-slate-400 mt-1">Try adjusting your filters or search query</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
