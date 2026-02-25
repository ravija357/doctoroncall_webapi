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
  Users,
  CalendarCheck,
  TrendingUp,
  Clock,
  MoreVertical,
  Star,
  ArrowUpRight,
  Pencil,
  Check,
  X,
  Eye,
  ChevronRight,
  Settings,
  Stethoscope,
  Activity,
  Banknote,
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
import { motion } from "framer-motion";

/* ─── animation helpers ─────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (d = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.8, ease, delay: d },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/* ─── stat card ─────────────────────────────────── */
function StatCard({
  label, value, trend, icon, accent, href, delay = 0,
}: {
  label: string; value: string; trend: string;
  icon: React.ReactNode; accent: string; href: string; delay?: number;
}) {
  return (
    <motion.div variants={fadeUp} custom={delay}>
      <Link href={href}>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(112,192,250,0.18)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm cursor-pointer h-full"
        >
          <div className="flex items-start justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl ${accent} flex items-center justify-center`}>
              {icon}
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-full uppercase tracking-wide">
              <ArrowUpRight className="w-3 h-3" />{trend}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">{value}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ─── schedule row ───────────────────────────────── */
function ScheduleRow({ appt, onStatus }: { appt: Appointment; onStatus: (id: string, s: "confirmed" | "cancelled") => void }) {
  const statusStyle =
    appt.status === "confirmed" ? "bg-primary/10 text-primary" :
    appt.status === "pending"   ? "bg-amber-50 text-amber-600" :
    appt.status === "completed" ? "bg-slate-100 text-slate-500" :
                                  "bg-red-50 text-red-500";
  return (
    <motion.div
      variants={fadeUp}
      layout
      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 group"
    >
      {/* time */}
      <div className="w-14 flex-shrink-0 text-center border-r border-slate-100 pr-4">
        <p className="text-sm font-black text-slate-900">{appt.startTime}</p>
        <p className="text-[10px] text-slate-400 font-bold">{appt.endTime}</p>
      </div>

      {/* avatar */}
      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden ring-2 ring-white flex-shrink-0">
        <img src={getImageUrl(appt.patient.image, appt.patient._id)} alt="Patient" className="w-full h-full object-cover" />
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 truncate">{appt.patient.firstName} {appt.patient.lastName}</p>
        <p className="text-xs text-slate-400 truncate">{appt.reason || "Routine Checkup"}</p>
      </div>

      {/* badge */}
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${statusStyle}`}>
        {appt.status}
      </span>

      {/* inline actions for pending */}
      {appt.status === "pending" && (
        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onStatus(appt._id, "confirmed")}
            className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onStatus(appt._id, "cancelled")}
            className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ─── action button ──────────────────────────────── */
function ActionButton({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const inner = (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-colors group"
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="font-bold text-slate-700 group-hover:text-slate-900 text-sm">{label}</span>
      <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
    </motion.div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

/* ─── main page ─────────────────────────────────── */
export default function DoctorDashboard() {
  const { user, refreshUser } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0, todayAppointments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const [profile, appts] = await Promise.all([
        doctorService.getProfile().catch(() => null),
        appointmentService.getDoctorAppointments().catch(() => []),
      ]);
      if (profile) setDoctorProfile(profile);
      if (appts) {
        setAppointments(appts);
        const uniquePatients = profile?.totalPatients || new Set(appts.map((a) => a.patient._id)).size;
        const localTodayStr = new Date().toLocaleDateString("en-CA");
        const todayCount = appts.filter((a) => new Date(a.date).toLocaleDateString("en-CA") === localTodayStr).length;
        const revenue = profile?.totalRevenue || appts.filter((a) => a.status === "completed").length * (profile?.fees || 0);
        setStats({ totalPatients: uniquePatients, totalAppointments: profile?.totalVisits || appts.length, todayAppointments: todayCount, revenue });
      }
    } catch (e) {
      console.error("Dashboard fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  useEffect(() => {
    if (!socket) return;
    const handleRating = (d: { doctorId: string; averageRating: number; totalReviews: number }) =>
      setDoctorProfile((p) => p && p._id === d.doctorId ? { ...p, averageRating: d.averageRating, totalReviews: d.totalReviews } : p);
    const handleAppt = (d: { doctorId: string }) => { if (doctorProfile?._id === d.doctorId) fetchData(); };
    socket.on("doctor_rating_updated", handleRating);
    socket.on("appointment_updated", handleAppt);
    socket.on("schedule_updated", handleAppt);
    socket.on("doctor_profile_updated", handleAppt);
    return () => {
      socket.off("doctor_rating_updated", handleRating);
      socket.off("appointment_updated", handleAppt);
      socket.off("schedule_updated");
      socket.off("doctor_profile_updated");
    };
  }, [socket, doctorProfile]);

  const handleImageUpdate = async (file: File) => {
    if (!user?._id) return;
    setIsUpdatingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/${user._id}`, { method: "PUT", body: formData });
      if (res.ok) { await refreshUser(); toast.success("Profile photo updated!"); }
    } catch { toast.error("Failed to update photo"); }
    finally { setIsUpdatingImage(false); }
  };

  const handleStatusUpdate = async (id: string, status: "confirmed" | "cancelled") => {
    setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      if (status === "cancelled") await appointmentService.cancelAppointment(id);
      else await appointmentService.updateStatus(id, status);
      toast.success(`Appointment ${status}`);
    } catch { toast.error("Failed to update"); fetchData(); }
  };

  if (!user) return null;

  const localTodayStr = new Date().toLocaleDateString("en-CA");
  const todayAppts = appointments
    .filter((a) => new Date(a.date).toLocaleDateString("en-CA") === localTodayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const recentAppts = [...appointments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <AuthGuard role="doctor">
      <div className="min-h-screen bg-[#F8FAFD] pb-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ── Page header ── */}
          <motion.div
            className="mb-10"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </motion.p>
            <motion.h1 variants={fadeUp} custom={0.05} className="text-3xl font-black text-slate-900 tracking-tight">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, Dr. {user.firstName} 👋
            </motion.h1>
            <motion.p variants={fadeUp} custom={0.1} className="text-slate-500 mt-1">
              Here's what's happening with your practice today.
            </motion.p>
          </motion.div>

          {/* ── Stat cards ── */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <StatCard
              label="Total Patients" value={stats.totalPatients.toString()}
              trend="+12% month" icon={<Users className="w-5 h-5 text-primary" />}
              accent="bg-primary/10" href="/my-patients"
            />
            <StatCard
              label="Appointments" value={stats.totalAppointments.toString()}
              trend="+5% week" icon={<CalendarCheck className="w-5 h-5 text-violet-500" />}
              accent="bg-violet-50" href="/doctor/appointments" delay={0.07}
            />
            <StatCard
              label="Revenue" value={`Rs. ${stats.revenue.toLocaleString()}`}
              trend="+18% month" icon={<Banknote className="w-5 h-5 text-primary" />}
              accent="bg-primary/10" href="/doctor/revenue" delay={0.14}
            />
            <StatCard
              label="Rating" value={doctorProfile?.averageRating?.toFixed(1) || "New"}
              trend={`${doctorProfile?.totalReviews || 0} reviews`}
              icon={<Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
              accent="bg-amber-50" href="/doctor/reviews" delay={0.21}
            />
          </motion.div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left col */}
            <div className="lg:col-span-2 space-y-8">

              {/* Today's Schedule */}
              <motion.div
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.25 }}
              >
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Today's Schedule</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{stats.todayAppointments} appointment{stats.todayAppointments !== 1 ? "s" : ""} scheduled</p>
                  </div>
                  <Link href="/schedule">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
                    >
                      Calendar <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />)}
                  </div>
                ) : todayAppts.length === 0 ? (
                  <div className="text-center py-14 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium text-sm">No appointments today</p>
                    <Link href="/schedule" className="mt-3 inline-block text-xs font-bold text-primary hover:underline">Manage schedule →</Link>
                  </div>
                ) : (
                  <motion.div className="space-y-3" initial="hidden" animate="visible" variants={stagger}>
                    {todayAppts.map((appt) => (
                      <ScheduleRow key={appt._id} appt={appt} onStatus={handleStatusUpdate} />
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Recent Requests */}
              <motion.div
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.35 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Requests</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Latest appointment activity</p>
                  </div>
                  <Link href="/doctor/appointments">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
                    >
                      View all <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Patient", "Date & Time", "Type", "Status", "Action"].map((h) => (
                          <th key={h} className="pb-3 pt-1 font-bold text-slate-400 text-[10px] uppercase tracking-wider first:pl-1 last:text-right last:pr-1">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentAppts.map((appt, i) => {
                        const statusStyle =
                          appt.status === "confirmed" ? "bg-primary/10 text-primary" :
                          appt.status === "pending"   ? "bg-amber-50 text-amber-600" :
                          appt.status === "completed" ? "bg-slate-100 text-slate-500" :
                                                        "bg-red-50 text-red-400";
                        return (
                          <motion.tr
                            key={appt._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.06 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-4 pl-1">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden ring-2 ring-white flex-shrink-0">
                                  <img src={getImageUrl(appt.patient.image, appt.patient._id)} className="w-full h-full object-cover" alt="" />
                                </div>
                                <span className="font-bold text-slate-800">{appt.patient.firstName} {appt.patient.lastName}</span>
                              </div>
                            </td>
                            <td className="py-4 text-slate-500 font-medium whitespace-nowrap">
                              {new Date(appt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {appt.startTime}
                            </td>
                            <td className="py-4 text-slate-400">Consultation</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle}`}>
                                {appt.status}
                              </span>
                            </td>
                            <td className="py-4 text-right pr-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-2 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors outline-none">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <Link href="/doctor/appointments">
                                    <DropdownMenuItem className="cursor-pointer"><Eye className="mr-2 w-4 h-4" />View Details</DropdownMenuItem>
                                  </Link>
                                  {appt.status === "pending" && (
                                    <>
                                      <DropdownMenuItem
                                        className="cursor-pointer text-primary focus:text-primary focus:bg-primary/10"
                                        onClick={() => handleStatusUpdate(appt._id, "confirmed")}
                                      >
                                        <Check className="mr-2 w-4 h-4" />Accept
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50"
                                        onClick={() => handleStatusUpdate(appt._id, "cancelled")}
                                      >
                                        <X className="mr-2 w-4 h-4" />Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {appt.status === "confirmed" && (
                                    <DropdownMenuItem
                                      className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50"
                                      onClick={() => handleStatusUpdate(appt._id, "cancelled")}
                                    >
                                      <X className="mr-2 w-4 h-4" />Cancel
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </motion.tr>
                        );
                      })}
                      {recentAppts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No appointments yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">

              {/* Profile card */}
              <motion.div
                className="bg-white rounded-[2.5rem] p-8 border border-primary/20 shadow-lg shadow-primary/8 relative overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.3 }}
              >
                {/* Decorative blobs */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-5 group/img">
                    <div className="w-24 h-24 rounded-[1.7rem] overflow-hidden ring-4 ring-primary/20 shadow-lg">
                      <img
                        src={getImageUrl(user.image, user._id, user.updatedAt)}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                      />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all duration-300 rounded-[1.7rem] backdrop-blur-sm">
                      <Pencil className="w-5 h-5 text-white" />
                      <input type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpdate(e.target.files[0]); }} />
                    </label>
                    {/* Online dot */}
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Dr. {user.firstName} {user.lastName}</h3>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1 mb-6">
                    {doctorProfile?.specialization || "General Practitioner"}
                  </p>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-3 w-full mb-6">
                    {[
                      { label: "Exp.", value: `${doctorProfile?.experience || 0}yr` },
                      { label: "Rating", value: doctorProfile?.averageRating?.toFixed(1) || "—" },
                      { label: "Patients", value: stats.totalPatients.toString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <p className="text-lg font-black text-slate-900">{value}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Info row */}
                  {doctorProfile?.hospital && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <span className="font-medium">{doctorProfile.hospital}</span>
                    </div>
                  )}

                  <Link href="/user/profile" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl shadow-md shadow-primary/25 transition-colors text-sm uppercase tracking-wider"
                    >
                      Edit Profile
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Weekly Schedule */}
              <motion.div
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-black text-slate-900">Weekly Schedule</h3>
                  <Link href="/schedule">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                <div className="space-y-2">
                  {doctorProfile?.schedules && doctorProfile.schedules.length > 0 ? (
                    doctorProfile.schedules
                      .filter((s) => !s.isOff)
                      .map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                        >
                          <span className="text-sm font-bold text-slate-700">{s.day}</span>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Clock className="w-3 h-3 text-primary" />
                            {s.startTime} – {s.endTime}
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-400">No schedule set</p>
                      <Link href="/schedule" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">Set schedule →</Link>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.5 }}
              >
                <h3 className="text-base font-black text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-1">
                  <ActionButton icon={<Activity className="w-4 h-4" />} label="View Revenue" href="/doctor/revenue" />
                  <ActionButton icon={<CalendarCheck className="w-4 h-4" />} label="All Appointments" href="/doctor/appointments" />
                  <ActionButton icon={<Clock className="w-4 h-4" />} label="Edit Hours" href="/schedule" />
                  <ActionButton icon={<Settings className="w-4 h-4" />} label="Profile Settings" href="/user/profile" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
