"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { Appointment, Doctor } from "@/types";
import { getImageUrl } from "@/utils/imageHelper";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  Bell, 
  ChevronRight, 
  Activity, 
  FileText, 
  Pill,
  Star,
  Stethoscope
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appts, docs] = await Promise.all([
           appointmentService.getMyAppointments().catch(() => []),
           doctorService.getAllDoctors().catch(() => [])
        ]);

        // Find next confirmed appointment
        if (appts) {
            const upcoming = appts
                .filter(a => new Date(a.date) >= new Date() && a.status === 'confirmed')
                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
            setNextAppointment(upcoming || null);
        }

        if (docs) {
            // Get top rated doctors
            const top = docs.sort((a,b) => b.averageRating - a.averageRating).slice(0, 4);
            setTopDoctors(top);
        }
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      
      {/* Header / Top Bar */}
      <div className="bg-white sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Activity className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">HealthPlus</span>
           </div>
           
           <div className="flex items-center gap-4">
              <Link href="/doctors">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Search className="w-6 h-6" />
                </button>
              </Link>
              <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <Link href="/user/profile">
                <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden cursor-pointer">
                    <img 
                        src={getImageUrl(user.image, user._id, user.updatedAt)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
              </Link>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 font-serif">
                    Good Morning, {user.firstName}
                </h1>
                <p className="text-slate-500 mt-1">Here is your daily health overview</p>
            </div>
            <div className="text-right hidden md:block">
                <p className="text-2xl font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
            </div>
        </div>

        {/* Hero Grid: Next Appointment & Health Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Next Appointment Card */}
            <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Next Appointment</h2>
                                {nextAppointment ? (
                                    <p className="text-blue-100 font-medium">Don't forget your scheduled visit</p>
                                ) : (
                                    <p className="text-blue-100 font-medium">No upcoming appointments</p>
                                )}
                            </div>
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {nextAppointment ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-6 flex items-center gap-4 border border-white/10">
                                <div className="w-16 h-16 rounded-xl bg-white/20 overflow-hidden flex-shrink-0">
                                     <img 
                                        src={getImageUrl(nextAppointment.doctor.user.image, nextAppointment.doctor._id)} 
                                        alt="Doctor" 
                                        className="w-full h-full object-cover"
                                     />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">Dr. {nextAppointment.doctor.user.firstName} {nextAppointment.doctor.user.lastName}</h3>
                                    <p className="text-blue-100 text-sm">{nextAppointment.doctor.specialization}</p>
                                </div>
                                <div className="text-right pl-4 border-l border-white/20">
                                    <p className="font-bold text-lg">{nextAppointment.startTime}</p>
                                    <p className="text-blue-100 text-xs uppercase font-bold">{new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8">
                                <Link href="/doctors">
                                    <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all">
                                        Book Now
                                    </button>
                                </Link>
                            </div>
                        )}
                        
                        {nextAppointment && (
                            <Link href="/appointments" className="absolute bottom-0 right-0 p-4">
                                <button className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white transition-colors">
                                    View Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Daily Tip / Banner */}
            <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <h3 className="text-xl font-bold text-emerald-900 mb-2 font-serif relative z-10">Daily Health Tip</h3>
                <p className="text-emerald-700 font-medium leading-relaxed relative z-10 mb-6">
                    "Staying hydrated improves energy levels and brain function. Drink at least 8 glasses today!"
                </p>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                         <p className="text-xs font-bold text-emerald-600 uppercase">Wellness</p>
                         <p className="text-sm font-bold text-emerald-800">Vitality Check</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-serif">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ActionCard icon={<Search />} label="Find Doctor" color="bg-blue-50 text-blue-600" href="/doctors" />
                <ActionCard icon={<Calendar />} label="My Appointments" color="bg-purple-50 text-purple-600" href="/appointments" />
                <ActionCard icon={<FileText />} label="Medical Records" color="bg-orange-50 text-orange-600" href="#" />
                <ActionCard icon={<Pill />} label="Prescriptions" color="bg-teal-50 text-teal-600" href="#" />
            </div>
        </div>

        {/* Top/Recommended Doctors */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 font-serif">Top Rated Doctors</h2>
                <Link href="/doctors" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[2rem] animate-pulse" />)
                ) : (
                    topDoctors.map(doctor => (
                        <div key={doctor._id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => router.push(`/doctors/${doctor._id}`)}>
                            <div className="w-full aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100 relative">
                                <img 
                                    src={getImageUrl(doctor.user.image, doctor._id)} 
                                    alt="Doctor" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    {doctor.averageRating.toFixed(1)}
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 truncate">Dr. {doctor.user.firstName} {doctor.user.lastName}</h3>
                            <p className="text-slate-500 text-sm mb-3 truncate">{doctor.specialization}</p>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-blue-600">${doctor.fees}</p>
                                <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
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

function ActionCard({ icon, label, color, href }: any) {
    return (
        <Link href={href} className={`p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-lg transition-all duration-300 group bg-white flex flex-col items-center justify-center gap-4 text-center cursor-pointer`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
                {React.cloneElement(icon, { className: "w-7 h-7" })}
            </div>
            <span className="font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
        </Link>
    );
}
