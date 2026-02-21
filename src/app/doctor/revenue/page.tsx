"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { Appointment, Doctor } from "@/types";
import { TrendingUp, Banknote, Calendar, ArrowUpRight, ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DoctorRevenuePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { socket } = useSocket();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newFee, setNewFee] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);

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
            if (profile) setNewFee(profile.fees.toString());
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateFee = async () => {
        if (!newFee || isNaN(Number(newFee)) || Number(newFee) < 0) {
            toast.error("Please enter a valid fee amount");
            return;
        }

        setIsUpdating(true);
        try {
            const updated = await doctorService.updateProfile({ fees: Number(newFee) });
            setDoctorProfile(updated);
            setIsEditDialogOpen(false);
            toast.success("Consultation fee updated successfully!");
        } catch (err: any) {
            console.error("Failed to update fee:", err);
            toast.error(err.response?.data?.message || "Failed to update fee");
        } finally {
            setIsUpdating(false);
        }
    };

    // Connect socket listener for real-time revenue updates
    useEffect(() => {
        if (!socket || !doctorProfile) return;

        const handleAppointmentUpdate = (data: { doctorId: string }) => {
            if (data.doctorId === doctorProfile._id) {
                console.log("[Revenue] Appointment updated globally, fetching new revenue data...");
                fetchData();
            }
        };

        socket.on('appointment_updated', handleAppointmentUpdate);
        socket.on('doctor_profile_updated', (data: { doctorId: string }) => {
            if (doctorProfile && data.doctorId === doctorProfile._id) {
                console.log("[Revenue] Profile updated globally, refreshing...");
                fetchData();
            }
        });

        return () => {
            socket.off('appointment_updated', handleAppointmentUpdate);
            socket.off('doctor_profile_updated');
        };
    }, [socket, doctorProfile]);

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
                    <div className="bg-[#70c0fa] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden border border-blue-400/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-sm p-4 mb-4 flex items-center justify-center shadow-inner relative group">
                                <Banknote className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-white/90 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue</p>
                            <h3 className="text-5xl font-black font-serif">Rs. {totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50/80 flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-[#70c0fa]" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">This Month</p>
                        <h3 className="text-4xl font-black text-slate-800 font-serif mb-3">Rs. {monthlyRevenue.toLocaleString()}</h3>
                        <div className="text-[10px] font-bold text-[#70c0fa] bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Active Period
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group relative">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50/80 flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-[#70c0fa]" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Consultation Fee</p>
                        <h3 className="text-4xl font-black text-slate-800 font-serif mb-3">Rs. {fees}</h3>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-[#70c0fa] hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif text-slate-800">Update Consultation Fee</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Set your standard fee for each appointment.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="price" className="text-sm font-bold text-slate-600 ml-1">Fee Amount (Rs.)</label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={newFee}
                                            onChange={(e) => setNewFee(e.target.value)}
                                            className="rounded-xl border-slate-200 focus:border-[#70c0fa] focus:ring-[#70c0fa] p-6 text-lg"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button 
                                        onClick={handleUpdateFee}
                                        disabled={isUpdating}
                                        className="w-full h-14 bg-[#70c0fa] hover:bg-[#68A6CB] text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-100 transition-all"
                                    >
                                        {isUpdating ? "Updating..." : "Save Changes"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Per Appointment</p>
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
                                                <div className="font-bold text-slate-800">{appt.patient?.firstName || 'Unknown'} {appt.patient?.lastName || 'Patient'}</div>
                                                <div className="text-xs text-slate-500">ID: #{appt.patient?._id?.slice(-4) || '0000'}</div>
                                            </td>
                                            <td className="py-4 text-slate-600 border-b border-slate-50">
                                                Consultation
                                            </td>
                                            <td className="py-4 text-right pr-4 border-b border-slate-50">
                                                <span className="font-bold text-[#70c0fa]">+Rs. {fees}</span>
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
