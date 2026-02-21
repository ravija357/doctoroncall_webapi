"use client";

import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
import { doctorService } from "@/services/doctor.service";
import { appointmentService } from "@/services/appointment.service";
import { Doctor, Appointment } from "@/types";
import { getImageUrl } from "@/utils/imageHelper";
import AuthGuard from "../../components/AuthGuard";
import { 
    LayoutDashboard, 
    Users, 
    CalendarCheck, 
    TrendingUp, 
    Clock, 
    MoreVertical, 
    MapPin, 
    Star, 
    Search,
    Bell,
    Settings,
    ChevronRight,
    ArrowUpRight,
    Pencil,
    Check,
    X,
    Eye
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function DoctorDashboard() {
  const { user, refreshUser } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const { socket } = useSocket();

  // Data Fetching
  const fetchData = async () => {
    try {
      const [profile, appts] = await Promise.all([
        doctorService.getProfile().catch(e => null),
        appointmentService.getDoctorAppointments().catch(e => [])
      ]);

      if (profile) setDoctorProfile(profile);
      if (appts) {
         setAppointments(appts || []);
         
         // Calculate Stats
         const uniquePatients = new Set(appts.map(a => a.patient._id)).size;
         // Get today's local date string YYYY-MM-DD
         const localTodayStr = new Date().toLocaleDateString('en-CA');
         const todayCount = appts.filter(a => {
             const apptDate = new Date(a.date);
             return apptDate.toLocaleDateString('en-CA') === localTodayStr;
         }).length;
         // Mock revenue calculation: appointments * fees
         const revenue = appts.filter(a => a.status === 'completed').length * (profile?.fees || 50);

         setStats({
           totalPatients: uniquePatients,
           totalAppointments: appts.length,
           todayAppointments: todayCount,
           revenue: revenue
         });
      }
    } catch (error) {
      console.error("Dashboard data fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    
    const handleRatingUpdate = (data: { doctorId: string, averageRating: number, totalReviews: number }) => {
        setDoctorProfile(prev => {
            if (prev && prev._id === data.doctorId) {
                return { ...prev, averageRating: data.averageRating, totalReviews: data.totalReviews };
            }
            return prev;
        });
    };

    const handleAppointmentUpdate = (data: { doctorId: string }) => {
        if (doctorProfile && data.doctorId === doctorProfile._id) {
            console.log("[Dashboard] Appointment updated globally, refreshing stats...");
            fetchData();
        }
    };

    socket.on('doctor_rating_updated', handleRatingUpdate);
    socket.on('appointment_updated', handleAppointmentUpdate);
    socket.on('schedule_updated', (data: { doctorId: string }) => {
        if (doctorProfile && data.doctorId === doctorProfile._id) {
            console.log("[Dashboard] Schedule updated globally, refreshing data...");
            fetchData();
        }
    });
    socket.on('doctor_profile_updated', (data: { doctorId: string }) => {
        if (doctorProfile && data.doctorId === doctorProfile._id) {
            console.log("[Dashboard] Profile updated globally, refreshing stats...");
            fetchData();
        }
    });

    return () => {
        socket.off('doctor_rating_updated', handleRatingUpdate);
        socket.off('appointment_updated', handleAppointmentUpdate);
        socket.off('doctor_profile_updated');
    };
  }, [socket, doctorProfile]);

  const handleImageUpdate = async (file: File) => {
      // Implement image update logic (reuse from previous component or extract)
      // For brevity, skipping inline implementation details but UI will have the trigger
      if (!user?._id) return;
      setIsUpdatingImage(true);
      const formData = new FormData();
      formData.append("image", file);
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/${user._id}`, {
            method: "PUT",
            body: formData,
        });

        if (res.ok) {
            await refreshUser();
            alert("Profile image updated!");
        }
      } catch(e) {
          console.error(e);
          alert("Failed to update image");
      } finally {
          setIsUpdatingImage(false);
      }
  };

  const handleStatusUpdate = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
      try {
          // Optimistic update
          setAppointments(prev => prev.map(a => 
              a._id === appointmentId ? { ...a, status: status } : a
          ));

          if (status === 'cancelled') {
              await appointmentService.cancelAppointment(appointmentId);
              toast.success("Appointment cancelled");
          } else {
              await appointmentService.updateStatus(appointmentId, status);
              toast.success(`Appointment ${status}`);
          }
      } catch (error) {
          console.error("Failed to update status", error);
          toast.error("Failed to update status");
          // Revert could be implemented here by re-fetching
      }
  };

  if (!user) return null;

  return (
    <AuthGuard role="doctor">
      <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-emerald-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Link href="/my-patients">
                    <StatCard 
                        label="Total Patients" 
                        value={stats.totalPatients.toString()} 
                        trend="+12% this month"
                        icon={<Users className="w-6 h-6 text-emerald-600" />}
                        bg="bg-emerald-50"
                        trendColor="text-emerald-600"
                    />
                </Link>
                <Link href="/doctor/appointments">
                    <StatCard 
                        label="Appointments" 
                        value={stats.totalAppointments.toString()} 
                        trend="+5% this week"
                        icon={<CalendarCheck className="w-6 h-6 text-indigo-600" />}
                        bg="bg-indigo-50"
                        trendColor="text-emerald-600"
                    />
                </Link>
                <Link href="/doctor/revenue">
                    <StatCard 
                        label="Total Revenue" 
                        value={`Rs. ${stats.revenue.toLocaleString()}`} 
                        trend="+18% vs last month"
                        icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
                        bg="bg-emerald-50"
                        trendColor="text-emerald-600"
                    />
                </Link>
                <Link href="/doctor/reviews">
                    <StatCard 
                        label="Rating" 
                        value={doctorProfile?.averageRating.toFixed(1) || "New"} 
                        trend={`${doctorProfile?.totalReviews || 0} reviews`}
                        icon={<Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />}
                        bg="bg-yellow-50"
                        trendColor="text-slate-500"
                    />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Schedule & Recent */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Today's Schedule */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Today's Schedule</h2>
                                <p className="text-slate-500 font-medium mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <Link href="/schedule">
                                <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-full transition-colors">
                                    View Calendar <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>

                        {loading ? (
                             <div className="space-y-4">
                                {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
                             </div>
                        ) : stats.todayAppointments === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200">
                                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No appointments scheduled for today</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments
                                    .filter(a => {
                                        const apptDate = new Date(a.date);
                                        const localTodayStr = new Date().toLocaleDateString('en-CA');
                                        return apptDate.toLocaleDateString('en-CA') === localTodayStr;
                                    })
                                    .sort((a,b) => a.startTime.localeCompare(b.startTime))
                                    .map((appt) => (
                                    <div key={appt._id} className="flex items-center p-5 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 group bg-white relative overflow-hidden">
                                        <div className="w-16 flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-100 pr-5 mr-5">
                                            <span className="text-sm font-black text-slate-900">{appt.startTime}</span>
                                            <span className="text-xs text-slate-400 font-bold tracking-tighter">{appt.endTime}</span>
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-slate-50">
                                                    <img 
                                                        src={getImageUrl(appt.patient.image, appt.patient._id)} 
                                                        alt="Patient" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{appt.patient.firstName} {appt.patient.lastName}</h3>
                                                    <p className="text-sm text-slate-500 font-medium line-clamp-1">{appt.reason || 'Routine Checkup'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                                                appt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity / Requests */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                         <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Requests</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider pl-2">Patient</th>
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Date & Time</th>
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider">Type</th>
                                        <th className="pb-4 pt-2 font-bold text-slate-400 text-xs uppercase tracking-wider text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {appointments.slice(0, 5).map((appt) => (
                                        <tr key={appt._id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-4 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-white">
                                                         <img src={getImageUrl(appt.patient.image, appt.patient._id)} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-bold text-slate-900">{appt.patient.firstName}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-slate-600 font-medium">
                                                {new Date(appt.date).toLocaleDateString()} • {appt.startTime}
                                            </td>
                                            <td className="py-4 text-slate-500">
                                                Consultation
                                            </td>
                                            <td className="py-4 text-right pr-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="text-slate-400 hover:text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors outline-none">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <Link href={`/doctor/appointments`}>
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <Eye className="mr-2 w-4 h-4" /> View Details
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        
                                                        {appt.status === 'pending' && (
                                                            <>
                                                                <DropdownMenuItem 
                                                                    className="cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                                                                    onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                                                >
                                                                    <Check className="mr-2 w-4 h-4" /> Accept Request
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                                    onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                                                >
                                                                    <X className="mr-2 w-4 h-4" /> Reject Request
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        
                                                        {(appt.status === 'confirmed') && (
                                                            <DropdownMenuItem 
                                                                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                                onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                                            >
                                                                <X className="mr-2 w-4 h-4" /> Cancel Appointment
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Profile & Actions */}
                <div className="space-y-8">
                     {/* Mini Profile Card */}
                     <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                             <div className="w-28 h-28 rounded-[2rem] bg-white/10 backdrop-blur-md p-1.5 mb-6 relative group/img overflow-hidden ring-1 ring-white/20">
                                <img 
                                    src={getImageUrl(user.image, user._id, user.updatedAt)} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover rounded-[1.7rem] transition-transform duration-700 group-hover/img:scale-110" 
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm">
                                    <Pencil className="w-6 h-6 text-white" />
                                    <input type="file" className="hidden" onChange={(e) => {
                                        if (e.target.files?.[0]) handleImageUpdate(e.target.files[0]);
                                    }} />
                                </label>
                             </div>
                             <h3 className="text-2xl font-black mb-1 tracking-tight">Dr. {user.firstName} {user.lastName}</h3>
                             <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-8">{doctorProfile?.specialization || 'General Practitioner'}</p>
                             
                             <div className="grid grid-cols-2 gap-4 w-full">
                                 <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
                                     <p className="text-3xl font-black text-emerald-400">{doctorProfile?.experience || 1}+</p>
                                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Years Exp.</p>
                                 </div>
                                 <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
                                     <p className="text-3xl font-black text-indigo-400">{doctorProfile?.totalReviews || 0}</p>
                                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Patients</p>
                                 </div>
                             </div>
 
                             <Link href="/user/profile" className="w-full mt-8">
                                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/40 transition-all active:scale-95 uppercase tracking-widest text-xs">
                                    Edit Profile
                                </button>
                             </Link>
                        </div>
                     </div>

                      {/* Availability / Weekly Schedule */}
                      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800 font-serif">Weekly Schedule</h3>
                            <Link href="/schedule">
                                <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </Link>
                         </div>
                         <div className="space-y-3">
                             {doctorProfile?.schedules && doctorProfile.schedules.length > 0 ? (
                                 doctorProfile.schedules
                                    .filter(s => !s.isOff)
                                    .map((s, idx) => (
                                     <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                         <span className="text-sm font-bold text-slate-700">{s.day}</span>
                                         <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                             <Clock className="w-3 h-3" />
                                             <span>{s.startTime} - {s.endTime}</span>
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <p className="text-sm text-slate-500 text-center py-4 italic">No schedule set</p>
                             )}
                         </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                         <h3 className="text-lg font-bold text-slate-800 mb-4 font-serif">Quick Actions</h3>
                         <div className="space-y-3">
                             <ActionButton icon={<CalendarCheck className="w-5 h-5" />} label="Block Date" />
                             <ActionButton icon={<Clock className="w-5 h-5" />} label="Edit Hours" href="/schedule" />
                             <ActionButton icon={<Settings className="w-5 h-5" />} label="Settings" />
                         </div>
                      </div>
                </div>
            </div>
        </div>
      </div>
    </AuthGuard>
  );
}

function StatCard({ label, value, trend, icon, bg, trendColor }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:scale-[1.02] cursor-pointer transition-all duration-300 h-full">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-[10px] font-bold ${trendColor} bg-slate-50 px-2 py-1 rounded-full uppercase tracking-wide`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-3xl font-black text-slate-950 tracking-tight mb-1">{value}</p>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
}

function ActionButton({ icon, label, href }: { icon: any, label: string, href?: string }) {
    const Button = (
        <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                {icon}
            </div>
            <span className="font-bold text-slate-600 group-hover:text-slate-900">{label}</span>
            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-500" />
        </div>
    );
    
    if (href) return <Link href={href}>{Button}</Link>;
    return Button;
}
