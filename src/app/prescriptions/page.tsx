"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { Appointment } from "@/types";
import { Pill, Calendar, ChevronLeft, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrescriptionsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [prescriptions, setPrescriptions] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPrescriptions();
        }
    }, [isAuthenticated]);

    const fetchPrescriptions = async () => {
        try {
            // Mock: Completed appointments represent prescription issues
            const data = await appointmentService.getMyAppointments();
            const pastRecords = data.filter((apt: Appointment) => apt.status === 'completed');
            setPrescriptions(pastRecords);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-primary/5 pt-24 pb-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary/5 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 rounded-full hover:bg-white/50 transition-colors text-slate-500 hover:text-slate-800">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-slate-800">My Prescriptions</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prescriptions.length > 0 ? (
                        prescriptions.map((rx) => (
                            <div key={rx._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -z-0 opacity-50"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 flex-shrink-0">
                                            <Pill className="w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Issued</p>
                                            <p className="font-bold text-slate-700">{new Date(rx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 mb-6">
                                        <h3 className="font-bold text-lg text-slate-800">Digital Prescription</h3>
                                        <p className="text-slate-500 text-sm mt-1">Prescribed by Dr. {rx.doctor.user.lastName}</p>
                                        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 font-medium">
                                            <span className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-teal-500" /> Valid until: {new Date(new Date(rx.date).setMonth(new Date(rx.date).getMonth() + 6)).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-auto">
                                        <Button variant="outline" className="flex-1 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2">
                                            <Eye className="w-4 h-4" /> View
                                        </Button>
                                        <Button className="flex-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold shadow-none gap-2">
                                            <Download className="w-4 h-4" /> Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
                            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-300 mb-4">
                                <Pill className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600">No active prescriptions</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Medications prescribed by your doctors will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
