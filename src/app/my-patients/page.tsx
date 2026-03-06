"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { Appointment, User } from "@/types";
import {
  Calendar, Mail, User as UserIcon, Phone,
  Search, ChevronRight, Users, Clock, CheckCircle2, X,
  MessageCircle, MapPin, Activity,
} from "lucide-react";
import { getImageUrl } from "@/utils/imageHelper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ─── types ─────────────────────────────────────── */
interface Patient extends User {
  lastAppointment?: string;
  totalVisits?: number;
}

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
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/* ─── PatientCard ────────────────────────────────── */
function PatientCard({
  patient, onClick, index, isActive,
}: { patient: Patient; onClick: () => void; index: number; isActive: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.06}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(112,192,250,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
      className={`rounded-[2rem] p-6 border shadow-sm cursor-pointer group transition-all ${
        isActive
          ? "bg-primary border-primary/30 shadow-lg shadow-primary/20"
          : "bg-white border-slate-100 hover:border-primary/20"
      }`}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 ring-2 ring-white shadow-md">
          <img
            src={getImageUrl(patient.image, patient._id)}
            alt={patient.firstName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-black truncate ${isActive ? "text-white" : "text-slate-900"}`}>
            {patient.firstName} {patient.lastName}
          </h3>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isActive ? "text-white/70" : "text-slate-400"}`}>
            ID #{patient._id.slice(-6).toUpperCase()}
          </p>
        </div>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex flex-col items-center justify-center ${isActive ? "bg-white/20" : "bg-primary/10"}`}>
          <span className={`text-sm font-black leading-none ${isActive ? "text-white" : "text-primary"}`}>{patient.totalVisits}</span>
          <span className={`text-[7px] font-bold uppercase tracking-tight leading-none ${isActive ? "text-white/70" : "text-primary/70"}`}>visits</span>
        </div>
      </div>

      <div className="space-y-2.5 mb-5">
        <div className={`flex items-center gap-2.5 text-sm ${isActive ? "text-white/80" : "text-slate-500"}`}>
          <Mail className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-white/50" : "text-slate-300"}`} />
          <span className="truncate font-medium">{patient.email}</span>
        </div>
        <div className={`flex items-center gap-2.5 text-sm ${isActive ? "text-white/80" : "text-slate-500"}`}>
          <Calendar className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-white/50" : "text-slate-300"}`} />
          <span className="font-medium">
            Last visit:{" "}
            {patient.lastAppointment
              ? new Date(patient.lastAppointment).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "—"}
          </span>
        </div>
      </div>

      <div className={`pt-4 border-t flex items-center justify-between ${isActive ? "border-white/20" : "border-slate-50"}`}>
        <span className={`text-xs font-bold ${isActive ? "text-white/60" : "text-slate-400"}`}>View profile</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isActive ? "bg-white/20 text-white" : "bg-slate-50 text-slate-300 group-hover:bg-primary/10 group-hover:text-primary"
        }`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Patient Profile Panel ──────────────────────── */
function PatientProfilePanel({
  patient, history, onClose,
}: { patient: Patient; history: Appointment[]; onClose: () => void }) {
  const router = useRouter();
  const completed = history.filter(a => a.status === "completed").length;
  const cancelled = history.filter(a => a.status === "cancelled").length;

  const statusStyle = (s: string) =>
    s === "completed" ? "bg-primary/10 text-primary" :
    s === "confirmed" ? "bg-emerald-50 text-emerald-600" :
    s === "cancelled" ? "bg-red-50 text-red-400" :
                        "bg-amber-50 text-amber-600";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease }}
      className="lg:col-span-1 sticky top-6"
    >
      <div className="bg-white rounded-[2.5rem] border border-primary/15 shadow-xl shadow-primary/8 overflow-hidden">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-primary to-[#5da0c9] p-8 pb-16">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden ring-4 ring-white/30 shadow-xl mb-4">
              <img
                src={getImageUrl(patient.image, patient._id)}
                alt={patient.firstName}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">
              Patient · ID #{patient._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Stats floating row */}
        <div className="mx-6 -mt-8 mb-6 bg-white rounded-2xl shadow-lg border border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
          {[
            { icon: <Activity className="w-4 h-4 text-primary" />, label: "Visits", value: patient.totalVisits || 0 },
            { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, label: "Done", value: completed },
            { icon: <X className="w-4 h-4 text-red-400" />, label: "Cancelled", value: cancelled },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-4 gap-1">
              {icon}
              <p className="text-lg font-black text-slate-900">{value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="px-8 mb-6 space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
          {[
            { icon: <Mail className="w-4 h-4" />, label: "Email", value: patient.email },
            { icon: <Phone className="w-4 h-4" />, label: "Phone", value: (patient as any).phone || "Not provided" },
            { icon: <MapPin className="w-4 h-4" />, label: "Location", value: (patient as any).address || "Not provided" },
            {
              icon: <Calendar className="w-4 h-4" />, label: "Member Since",
              value: new Date((patient as any).createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">{icon}</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Chat Button */}
        <div className="px-8 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/messages?userId=${patient._id}`)}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-primary to-[#5da0c9] text-white font-black text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Live Chat with Patient
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </motion.button>
        </div>

        {/* Appointment history */}
        <div className="px-8 pb-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Appointment History
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-6">No appointments yet.</p>
            ) : (
              history.map((appt, i) => (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                >
                  <div className="bg-slate-50 rounded-xl text-center px-3 py-2 flex-shrink-0 min-w-[50px]">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      {new Date(appt.date).toLocaleDateString("en-US", { month: "short" })}
                    </p>
                    <p className="text-xl font-black text-slate-800">{new Date(appt.date).getDate()}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm capitalize truncate">
                      {appt.reason || "General Consultation"}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {appt.startTime} – {appt.endTime}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${statusStyle(appt.status)}`}>
                    {appt.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── main page ─────────────────────────────────── */
export default function MyPatientsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { window.location.href = "/login"; return; }
    if (user?.role !== "doctor") return;

    const fetchPatients = async () => {
      try {
        const appointments = await appointmentService.getDoctorAppointments();
        setAllAppointments(appointments);

        const patientMap = new Map<string, Patient>();
        appointments.forEach((app) => {
          if (!app.patient) return;
          const pid = app.patient._id;
          if (!patientMap.has(pid)) {
            patientMap.set(pid, { ...app.patient, lastAppointment: app.date, totalVisits: 1 });
          } else {
            const p = patientMap.get(pid)!;
            if (app.date > (p.lastAppointment || "")) p.lastAppointment = app.date;
            p.totalVisits = (p.totalVisits || 0) + 1;
          }
        });

        setPatients(Array.from(patientMap.values()));
      } catch (e) {
        console.error("Failed to fetch patients", e);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchPatients();
  }, [isAuthenticated, authLoading, user]);

  const filtered = useMemo(() =>
    patients.filter((p) =>
      `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase())
    ), [patients, search]);

  const selectedPatient = patients.find((p) => p._id === selectedPatientId);
  const patientHistory = selectedPatientId
    ? allAppointments
        .filter((a) => a.patient._id === selectedPatientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const totalVisits = allAppointments.length;
  const completedVisits = allAppointments.filter((a) => a.status === "completed").length;

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFD]">
        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div className="mb-10 flex items-center justify-between" initial="hidden" animate="visible" variants={stagger}>
          <div>
            <motion.p variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Doctor Portal</motion.p>
            <motion.h1 variants={fadeUp} custom={0.05} className="text-3xl font-black text-slate-900 tracking-tight">My Patients</motion.h1>
            <motion.p variants={fadeUp} custom={0.1} className="text-slate-400 mt-1 text-sm">
              Click a patient card to view their profile and start a live chat.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} custom={0.15}>
            <Link
              href="/doctor/appointments"
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> All Appointments
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8" initial="hidden" animate="visible" variants={stagger}>
          {[
            { icon: <Users className="w-5 h-5 text-primary" />, label: "Total Patients", value: patients.length, accent: "bg-primary/10" },
            { icon: <Calendar className="w-5 h-5 text-violet-500" />, label: "Total Visits", value: totalVisits, accent: "bg-violet-50" },
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, label: "Completed", value: completedVisits, accent: "bg-emerald-50" },
          ].map(({ icon, label, value, accent }, i) => (
            <motion.div key={label} variants={fadeUp} custom={i * 0.07} className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center mb-3`}>{icon}</div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.25 }}
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-300" />
          </div>
          <input
            type="text"
            placeholder="Search patients by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* Two-column layout: patients list + profile panel */}
        <div className={`grid gap-6 transition-all duration-500 ${selectedPatientId ? "lg:grid-cols-[1fr_420px]" : "grid-cols-1"}`}>
          <div>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-700 mb-1">{search ? "No patients found" : "No Patients Yet"}</h3>
                <p className="text-slate-400 text-sm">
                  {search ? "Try a different name or email." : "Start confirming appointments to see your patient list."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                className={`grid gap-5 ${selectedPatientId ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
                initial="hidden" animate="visible" variants={stagger}
              >
                {filtered.map((patient, i) => (
                  <PatientCard
                    key={patient._id}
                    patient={patient}
                    index={i}
                    isActive={patient._id === selectedPatientId}
                    onClick={() => setSelectedPatientId(prev => prev === patient._id ? null : patient._id)}
                  />
                ))}
              </motion.div>
            )}
            {search && filtered.length > 0 && (
              <p className="text-xs text-slate-400 font-bold mt-4 text-center">
                Showing {filtered.length} of {patients.length} patients
              </p>
            )}
          </div>

          {/* Patient Profile Panel */}
          <AnimatePresence>
            {selectedPatientId && selectedPatient && (
              <PatientProfilePanel
                patient={selectedPatient}
                history={patientHistory}
                onClose={() => setSelectedPatientId(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
