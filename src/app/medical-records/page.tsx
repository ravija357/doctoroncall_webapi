"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { Appointment } from "@/types";
import { FileText, ChevronLeft, Download, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MedicalRecordsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [records, setRecords] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchRecords();
        }
    }, [isAuthenticated]);

    const fetchRecords = async () => {
        try {
            // Use past completed appointments as mock medical records
            const data = await appointmentService.getMyAppointments();
            const pastRecords = data.filter((apt: Appointment) => apt.status === 'completed');
            setRecords(pastRecords);
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
                    <h1 className="text-3xl font-serif font-bold text-slate-800">Medical Records</h1>
                </div>

                <div className="space-y-6">
                    {records.length > 0 ? (
                        records.map((record) => (
                            <div key={record._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 flex-shrink-0">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1 w-full md:w-auto">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">Visit Summary - Dr. {record.doctor.user.lastName}</h3>
                                                <p className="text-slate-500 text-sm">{record.doctor.specialization}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-700">{new Date(record.date).toLocaleDateString()}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase">{record.startTime}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 mt-4 border border-slate-100/50">
                                            <p className="font-bold text-slate-700 mb-1 flex items-center gap-2"><Activity className="w-4 h-4 text-orange-400"/> Clinical Notes</p>
                                            {record.notes || "Standard checkup completed. Patient is in good health."}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[120px] w-full md:w-auto mt-4 md:mt-0">
                                        <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2">
                                            <Download className="w-4 h-4" /> Download
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-300 mb-4">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600">No medical records found</h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Your visit summaries and clinical notes will appear here over time.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
