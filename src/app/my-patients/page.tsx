"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { Appointment, User } from "@/types";
import {
  Calendar, Mail, User as UserIcon, Stethoscope,
  Search, ChevronRight, Users, Clock, CheckCircle2, X,
} from "lucide-react";
import { getImageUrl } from "@/utils/imageHelper";
import Link from "next/link";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
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
function PatientCard({ patient, onClick, index }: { patient: Patient; onClick: () => void; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.06}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(112,192,250,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
      className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm cursor-pointer group"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 ring-2 ring-white shadow-md">
          <img
            src={getImageUrl(patient.image, patient._id)}
            alt={patient.firstName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-900 truncate">
            {patient.firstName} {patient.lastName}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            ID #{patient._id.slice(-6).toUpperCase()}
          </p>
        </div>
        {/* visits badge */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex flex-col items-center justify-center">
          <span className="text-sm font-black text-primary leading-none">{patient.totalVisits}</span>
          <span className="text-[7px] font-bold text-primary/70 uppercase tracking-tight leading-none">visits</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2.5 mb-5">
        <div className="flex items-center gap-2.5 text-sm text-slate-500">
          <Mail className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <span className="truncate font-medium">{patient.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <span className="font-medium">
            Last visit:{" "}
            {patient.lastAppointment
              ? new Date(patient.lastAppointment).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "—"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">View full history</span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── history modal ──────────────────────────────── */
function HistoryModal({
  patient, history, onClose,
}: { patient: Patient; history: Appointment[]; onClose: () => void }) {
  const statusStyle = (s: string) =>
    s === "completed" ? "bg-primary/10 text-primary" :
    s === "confirmed" ? "bg-emerald-50 text-emerald-600" :
    s === "cancelled" ? "bg-red-50 text-red-400" :
                        "bg-amber-50 text-amber-600";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl p-0 overflow-hidden sm:rounded-[2.5rem]">
        {/* Modal header */}
        <div className="bg-[#F8FAFD] border-b border-slate-100 p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <DialogHeader className="relative z-10 sm:text-left">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary/20 shadow-lg flex-shrink-0">
                <img
                  src={getImageUrl(patient.image, patient._id)}
                  alt={patient.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                  {patient.firstName} {patient.lastName}
                </DialogTitle>
                <DialogDescription className="text-primary font-bold tracking-widest uppercase text-[10px] mt-1">
                  {history.length} appointment{history.length !== 1 ? "s" : ""} on record
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Appointment list */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No appointment history found.</div>
          ) : (
            history.map((appt, i) => (
              <motion.div
                key={appt._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all group"
              >
                {/* Date bubble */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl text-center px-4 py-3 flex-shrink-0 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all min-w-[64px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {new Date(appt.date).toLocaleDateString("en-US", { month: "short" })}
                  </p>
                  <p className="text-2xl font-black text-slate-800 group-hover:text-primary transition-colors">
                    {new Date(appt.date).getDate()}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400">
                    {new Date(appt.date).getFullYear()}
                  </p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 capitalize truncate">
                    {appt.reason || "General Consultation"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {appt.startTime} – {appt.endTime}
                  </div>
                </div>

                {/* Status */}
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${statusStyle(appt.status)}`}>
                  {appt.status}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
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

  /* derived stats */
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

        {/* ── Header ── */}
        <motion.div className="mb-10 flex items-center justify-between" initial="hidden" animate="visible" variants={stagger}>
          <div>
            <motion.p variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
              Doctor Portal
            </motion.p>
            <motion.h1 variants={fadeUp} custom={0.05} className="text-3xl font-black text-slate-900 tracking-tight">
              My Patients
            </motion.h1>
            <motion.p variants={fadeUp} custom={0.1} className="text-slate-400 mt-1 text-sm">
              View and manage your full patient roster.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} custom={0.15}>
            <Link 
              href="/doctor/appointments"
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              All Appointments
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
          initial="hidden" animate="visible" variants={stagger}
        >
          {[
            { icon: <Users className="w-5 h-5 text-primary" />, label: "Total Patients", value: patients.length, accent: "bg-primary/10" },
            { icon: <Calendar className="w-5 h-5 text-violet-500" />, label: "Total Visits", value: totalVisits, accent: "bg-violet-50" },
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, label: "Completed", value: completedVisits, accent: "bg-emerald-50" },
          ].map(({ icon, label, value, accent }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              custom={i * 0.07}
              className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center mb-3`}>
                {icon}
              </div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Search bar ── */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
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
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* ── Patient grid ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-1">
              {search ? "No patients found" : "No Patients Yet"}
            </h3>
            <p className="text-slate-400 text-sm">
              {search
                ? "Try a different name or email."
                : "Start confirming appointments to see your patient list."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {filtered.map((patient, i) => (
              <PatientCard
                key={patient._id}
                patient={patient}
                index={i}
                onClick={() => setSelectedPatientId(patient._id)}
              />
            ))}
          </motion.div>
        )}

        {/* result count */}
        {search && filtered.length > 0 && (
          <p className="text-xs text-slate-400 font-bold mt-4 text-center">
            Showing {filtered.length} of {patients.length} patients
          </p>
        )}
      </div>

      {/* ── History modal ── */}
      <AnimatePresence>
        {selectedPatientId && selectedPatient && (
          <HistoryModal
            patient={selectedPatient}
            history={patientHistory}
            onClose={() => setSelectedPatientId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
