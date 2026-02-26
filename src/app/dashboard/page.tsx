"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { Appointment, Doctor } from "@/types";
import { getImageUrl } from "@/utils/imageHelper";
import Link from "next/link";
import { 
  Stethoscope, 
  Heart,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Calendar,
  Activity,
  Search,
  FileText,
  Pill,
  Star,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const [appts, docs] = await Promise.all([
         appointmentService.getMyAppointments().catch(() => []),
         doctorService.getAllDoctors().catch(() => [])
      ]);

      if (appts) {
          const upcoming = appts
              .filter(a => new Date(a.date) >= new Date() && a.status === 'confirmed')
              .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
          setNextAppointment(upcoming || null);
      }

      if (docs) {
          const top = docs.sort((a,b) => b.averageRating - a.averageRating).slice(0, 4);
          setTopDoctors(top);
      }
    } catch (e) {
      console.error("Dashboard fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    
    const handleRatingUpdate = (data: { doctorId: string, averageRating: number, totalReviews: number }) => {
        setTopDoctors(prev => 
            prev.map(doc => 
                doc._id === data.doctorId 
                    ? { ...doc, averageRating: data.averageRating, totalReviews: data.totalReviews }
                    : doc
            )
        );
    };

    const handleSync = () => {
        console.log('[SOCKET] Activity Sync Received');
        fetchData();
    };

    socket.on('doctor_rating_updated', handleRatingUpdate);
    socket.on('appointment_sync', handleSync);
    socket.on('schedule_sync', handleSync);
    socket.on('profile_sync', handleSync);

    return () => {
        socket.off('doctor_rating_updated', handleRatingUpdate);
        socket.off('appointment_sync', handleSync);
        socket.off('schedule_sync', handleSync);
        socket.off('profile_sync', handleSync);
    };
  }, [socket]);

  useEffect(() => {
    if (user?.role === 'doctor') {
      router.push('/doctor/dashboard');
    }
  }, [user, router]);

  if (!user || user.role === 'doctor') return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-4xl font-black text-slate-800 font-serif tracking-tight">
                    Good Morning, <span className="text-[#70c0fa]">{user.firstName}</span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Here is your daily health overview</p>
            </div>
            <div className="text-right hidden md:flex items-center gap-4 bg-white/50 backdrop-blur-xl px-6 py-3 rounded-3xl border border-white shadow-sm transition-transform hover:scale-105 duration-500">
                <div className="text-right">
                    <p className="text-2xl font-black text-slate-800 leading-none">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                    <p className="text-[10px] font-black text-[#70c0fa] uppercase tracking-widest mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#70c0fa]/10 flex items-center justify-center text-[#70c0fa]">
                    <Clock className="w-5 h-5" />
                </div>
            </div>
        </div>

        {/* Hero Grid: Next Appointment & Health Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Next Appointment Card */}
            <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer border border-white/5">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#70c0fa]/10 rounded-full blur-[120px] -mr-32 -mt-32 transition-all group-hover:bg-[#70c0fa]/20 duration-1000"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[260px]">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#70c0fa]">
                                    <Zap className="w-3 h-3 fill-[#70c0fa]" /> Upcoming
                                </div>
                                <h2 className="text-4xl font-black font-serif">Next Appointment</h2>
                                {nextAppointment ? (
                                    <p className="text-slate-400 font-medium">Your health journey continues on {new Date(nextAppointment.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                ) : (
                                    <p className="text-slate-400 font-medium">Ready for your next checkup?</p>
                                )}
                            </div>
                            <div className="bg-white/5 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/10 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                <Calendar className="w-10 h-10 text-[#70c0fa]" />
                            </div>
                        </div>

                        {nextAppointment ? (
                            <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 mt-8 flex items-center gap-6 border border-white/10 group-hover:bg-white/10 transition-colors duration-500">
                                <div className="w-20 h-20 rounded-2xl bg-[#70c0fa]/20 overflow-hidden flex-shrink-0 border-2 border-white/10 relative">
                                     <img 
                                        src={getImageUrl(nextAppointment.doctor.user.image, nextAppointment.doctor._id)} 
                                        alt="Doctor" 
                                        className="w-full h-full object-cover"
                                     />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-2xl tracking-tight">Dr. {nextAppointment.doctor.user.firstName} {nextAppointment.doctor.user.lastName}</h3>
                                    <p className="text-[#70c0fa] text-sm font-black uppercase tracking-widest opacity-80 mt-1">{nextAppointment.doctor.specialization}</p>
                                </div>
                                <div className="text-right pl-8 border-l border-white/10">
                                    <p className="font-black text-3xl text-white leading-none">{nextAppointment.startTime}</p>
                                    <p className="text-[#70c0fa] text-[10px] uppercase font-black tracking-widest mt-2">{new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8">
                                <Link href="/doctors">
                                    <button className="bg-[#70c0fa] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#70c0fa]/20 hover:shadow-2xl hover:bg-white hover:text-slate-900 transition-all duration-500 hover:-translate-y-1 active:translate-y-0">
                                        Book New Session
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Daily Tip Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 border border-white shadow-xl shadow-blue-500/5 flex flex-col justify-between group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700">
                <div>
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Activity className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 font-serif">Daily Health Tip</h3>
                    <p className="text-slate-700 font-bold leading-relaxed border-l-4 border-[#70c0fa] pl-4 py-2 bg-blue-50/50 rounded-r-xl">
                        "Staying hydrated improves energy levels and brain function. Drink at least 8 glasses today!"
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                             <p className="text-sm font-black text-slate-900">Vitality Check</p>
                        </div>
                     </div>
                     <TrendingUp className="w-6 h-6 text-[#70c0fa] animate-bounce" />
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-[#70c0fa] rounded-full"></div>
                <h2 className="text-3xl font-black text-slate-800 font-serif tracking-tight">Quick Navigation</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ActionCard icon={<Search />} label="Find Doctor" color="bg-blue-50 text-blue-600" href="/doctors" sub="Top specialists" />
                <ActionCard icon={<Calendar />} label="My Schedule" color="bg-purple-50 text-purple-600" href="/appointments" sub="Manage visits" />
                <ActionCard icon={<FileText />} label="E-Records" color="bg-orange-50 text-orange-600" href="/medical-records" sub="Health history" />
                <ActionCard icon={<Pill />} label="Prescriptions" color="bg-teal-50 text-teal-600" href="/prescriptions" sub="Medication info" />
            </div>
        </div>

        {/* Top Rated Doctors */}
        <div className="gsap-reveal">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-[#70c0fa] rounded-full"></div>
                    <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Top Specialists</h2>
                </div>
                <Link href="/doctors">
                    <button className="group flex items-center gap-2 text-sm font-black text-[#70c0fa] bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white shadow-sm hover:bg-[#70c0fa] hover:text-white transition-all duration-500">
                        EXPLORE ALL <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem] animate-pulse" />)
                ) : (
                    topDoctors.map((doctor, idx) => (
                        <div 
                            key={doctor._id} 
                            className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#70c0fa]/10 transition-all duration-700 group cursor-pointer relative overflow-hidden" 
                            onClick={() => router.push(`/doctors/${doctor._id}`)}
                        >
                            <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-slate-100 relative">
                                <img 
                                    src={getImageUrl(doctor.user.image, doctor._id)} 
                                    alt="Doctor" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-black text-slate-800 shadow-xl border border-white/50">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    {doctor.averageRating.toFixed(1)}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-black text-xl text-slate-900 tracking-tight transition-colors group-hover:text-[#70c0fa]">Dr. {doctor.user.firstName} {doctor.user.lastName}</h3>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">{doctor.specialization}</p>
                                <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">CONSULTATION</p>
                                        <p className="font-black text-2xl text-slate-900 mt-1">${doctor.fees}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-[#70c0fa] group-hover:text-white transition-all duration-500 group-hover:rotate-12 group-hover:shadow-lg">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, label, color, href, sub }: any) {
    return (
        <Link href={href}>
            <div 
                className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group flex flex-col items-center justify-center gap-5 text-center cursor-pointer h-full hover:scale-[1.05] active:scale-[0.98]"
            >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-inner group-hover:scale-110 group-hover:shadow-lg ${color}`}>
                    {React.cloneElement(icon, { className: "w-10 h-10" })}
                </div>
                <div className="space-y-1">
                    <p className="font-black text-slate-900 text-lg group-hover:text-[#70c0fa] transition-colors">{label}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sub}</p>
                </div>
            </div>
        </Link>
    );
}
