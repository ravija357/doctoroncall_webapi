"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { Appointment, Doctor } from "@/types";
import { TrendingUp, DollarSign, Calendar, ArrowUpRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DoctorRevenuePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'doctor') {
                router.push('/login');
                return;
            }
            fetchData();
        }
    }, [isAuthenticated, user, authLoading, router]);

    const fetchData = async () => {
        try {
            const [appts, profile] = await Promise.all([
                appointmentService.getDoctorAppointments(),
                doctorService.getProfile()
            ]);
            setAppointments(appts);
            setDoctorProfile(profile);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // Calculate detailed stats
    const completedAppointments = appointments.filter(a => a.status === 'completed');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyRevenue = completedAppointments
        .filter(a => {
            const d = new Date(a.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .length * (doctorProfile?.fees || 0);

    const totalRevenue = completedAppointments.length * (doctorProfile?.fees || 0);
    const fees = doctorProfile?.fees || 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/doctor/dashboard" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 font-serif">Revenue & Earnings</h1>
                        <p className="text-slate-500 mt-1">Track your financial performance</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white shadow-lg shadow-emerald-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 blur-xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-emerald-100 font-medium mb-1">Total Revenue</p>
                            <h3 className="text-4xl font-bold tracking-tight">${totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-slate-500 font-medium mb-1">This Month</p>
                        <h3 className="text-3xl font-bold text-slate-800">${monthlyRevenue.toLocaleString()}</h3>
                        <div className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-full uppercase tracking-wide">
                            Active Period
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-slate-500 font-medium mb-1">Consultation Fee</p>
                        <h3 className="text-3xl font-bold text-slate-800">${fees}</h3>
                        <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-wide">Per Appointment</p>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 font-serif mb-6">Completed Transactions</h2>
                    
                    {completedAppointments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider pl-4">Date</th>
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Patient</th>
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Service</th>
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-right pr-4">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {completedAppointments.map((appt) => (
                                        <tr key={appt._id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-4 pl-4 font-medium text-slate-600 border-b border-slate-50">
                                                {new Date(appt.date).toLocaleDateString()}
                                                <div className="text-xs text-slate-400 font-normal">{appt.startTime}</div>
                                            </td>
                                            <td className="py-4 border-b border-slate-50">
                                                <div className="font-bold text-slate-800">{appt.patient.firstName} {appt.patient.lastName}</div>
                                                <div className="text-xs text-slate-500">ID: #{appt.patient._id.slice(-4)}</div>
                                            </td>
                                            <td className="py-4 text-slate-600 border-b border-slate-50">
                                                Consultation
                                            </td>
                                            <td className="py-4 text-right pr-4 border-b border-slate-50">
                                                <span className="font-bold text-emerald-600">+${fees}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No completed transactions yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
