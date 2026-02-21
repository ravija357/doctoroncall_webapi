"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doctorService } from "@/services/doctor.service";
import { Schedule, Doctor } from "@/types";
import { Clock, Save, Plus, X, Moon, Sun, CalendarDays, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: (d = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease, delay: d },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/* helper to format "09:00" → "9:00 AM" */
function fmt(t?: string) {
  if (!t) return "–";
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/* daily hours row */
function ScheduleRow({
  schedule, index, onChange, onRemove,
}: {
  schedule: Partial<Schedule>;
  index: number;
  onChange: (i: number, field: keyof Schedule, val: any) => void;
  onRemove: (i: number) => void;
}) {
  const isOff = !!schedule.isOff;

  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.05}
      layout
      className={`relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        isOff
          ? "bg-slate-50 border-slate-100 opacity-60"
          : "bg-white border-slate-100 hover:border-primary/20 hover:bg-primary/5"
      }`}
    >
      {/* Day label + select */}
      <div className="w-36 flex-shrink-0">
        <select
          value={schedule.day}
          onChange={(e) => onChange(index, "day", e.target.value)}
          className="w-full font-black text-slate-800 bg-transparent border-none outline-none cursor-pointer text-sm focus:ring-0 appearance-none"
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Time pickers */}
      <div className={`flex-1 flex items-center gap-3 transition-opacity ${isOff ? "opacity-30 pointer-events-none" : ""}`}>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <input
            type="time"
            value={schedule.startTime || ""}
            onChange={(e) => onChange(index, "startTime", e.target.value)}
            disabled={isOff}
            className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-24"
          />
        </div>
        <span className="text-slate-300 font-bold">–</span>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <input
            type="time"
            value={schedule.endTime || ""}
            onChange={(e) => onChange(index, "endTime", e.target.value)}
            disabled={isOff}
            className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-24"
          />
        </div>

        {/* Duration badge */}
        {!isOff && schedule.startTime && schedule.endTime && (
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider">
            {(() => {
              const [sh, sm] = (schedule.startTime || "0:0").split(":").map(Number);
              const [eh, em] = (schedule.endTime || "0:0").split(":").map(Number);
              const mins = (eh * 60 + em) - (sh * 60 + sm);
              const h = Math.floor(mins / 60);
              const m = mins % 60;
              return `${h}h${m > 0 ? ` ${m}m` : ""}`;
            })()}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Day-off toggle */}
        <motion.button
          onClick={() => onChange(index, "isOff", !isOff)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isOff
              ? "bg-slate-200 text-slate-500 hover:bg-slate-300"
              : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
          }`}
        >
          {isOff ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          {isOff ? "Day Off" : "Set Off"}
        </motion.button>

        {/* Remove */}
        <motion.button
          onClick={() => onRemove(index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* main page */
export default function SchedulePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [schedules, setSchedules] = useState<Partial<Schedule>[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { window.location.href = "/login"; return; }

    const fetchProfile = async () => {
      try {
        const data = await doctorService.getProfile();
        setDoctor(data);
        if (data.schedules && data.schedules.length > 0) {
          setSchedules(data.schedules);
        } else {
          setSchedules(
            DAYS.slice(0, 5).map((day) => ({ day, startTime: "09:00", endTime: "17:00", isOff: false }))
          );
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "doctor") fetchProfile();
  }, [isAuthenticated, authLoading, user]);

  const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
    const next = [...schedules];
    next[index] = { ...next[index], [field]: value };
    setSchedules(next);
  };

  const handleAddDay = () =>
    setSchedules([...schedules, { day: "Monday", startTime: "09:00", endTime: "17:00", isOff: false }]);

  const handleRemoveDay = (index: number) =>
    setSchedules(schedules.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    try {
      await doctorService.updateSchedule(schedules);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Schedule saved!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFD]">
        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeDays = schedules.filter((s) => !s.isOff).length;
  const offDays = schedules.filter((s) => s.isOff).length;

  return (
    <div className="min-h-screen bg-[#F8FAFD] pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <motion.div className="mb-10" initial="hidden" animate="visible" variants={stagger}>
          <motion.p variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
            Doctor Portal
          </motion.p>
          <motion.h1 variants={fadeUp} custom={0.05} className="text-3xl font-black text-slate-900 tracking-tight">
            Schedule Manager
          </motion.h1>
          <motion.p variants={fadeUp} custom={0.1} className="text-slate-400 mt-1 text-sm">
            Set your weekly availability for patient appointments.
          </motion.p>
        </motion.div>

        {/* ── Summary chips ── */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.18 }}
        >
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm text-sm font-bold text-slate-700">
            <CalendarDays className="w-4 h-4 text-primary" />
            {schedules.length} days configured
          </div>
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-bold text-primary">
            <Sun className="w-4 h-4" />
            {activeDays} working
          </div>
          {offDays > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-2 text-sm font-bold text-amber-600">
              <Moon className="w-4 h-4" />
              {offDays} day{offDays > 1 ? "s" : ""} off
            </div>
          )}
        </motion.div>

        {/* ── Schedule card ── */}
        <motion.div
          className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.22 }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-black text-slate-900">Weekly Availability</h2>
                <p className="text-xs text-slate-400 mt-0.5">Changes apply to new bookings</p>
              </div>
            </div>

            {/* Save button */}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={!saving ? { scale: 1.03 } : {}}
              whileTap={!saving ? { scale: 0.97 } : {}}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all ${
                saving
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : saved
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover"
              }`}
            >
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin"
                  />
                ) : saved ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Save className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
            </motion.button>
          </div>

          {/* Rows */}
          <div className="p-6 space-y-3">
            <AnimatePresence initial={false}>
              {schedules.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-slate-400 text-sm"
                >
                  No days added yet. Click "Add Day" below.
                </motion.div>
              ) : (
                <motion.div className="space-y-3" initial="hidden" animate="visible" variants={stagger}>
                  {schedules.map((schedule, index) => (
                    <ScheduleRow
                      key={index}
                      schedule={schedule}
                      index={index}
                      onChange={handleScheduleChange}
                      onRemove={handleRemoveDay}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer: Add Day */}
          <div className="px-6 pb-6">
            <motion.button
              onClick={handleAddDay}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Day
            </motion.button>
          </div>
        </motion.div>

        {/* Tips card */}
        <motion.div
          className="mt-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tips</p>
          <ul className="space-y-2 text-sm text-slate-500">
            {[
              'Toggle "Set Off" to mark a day as unavailable without removing it.',
              "Duration shows automatically when both times are filled.",
              "Changes only affect new appointment bookings\u2014existing ones remain.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
