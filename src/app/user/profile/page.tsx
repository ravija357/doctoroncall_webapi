"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import {
  Mail, MapPin, Calendar, User, ShieldCheck, PenTool,
  Settings, Moon, Bell, Sparkles, Save, CheckCircle2,
  Phone, FileText, Stethoscope,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { getImageUrl } from "@/utils/imageHelper";
import { motion, AnimatePresence } from "framer-motion";

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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/* ─── sub-components ──────────────────────────────── */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

function FormField({
  label, name, type = "text", value, onChange, placeholder, icon,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 bg-white ${
        focused ? "border-primary ring-2 ring-primary/15 shadow-sm" : "border-slate-200 hover:border-slate-300"
      }`}>
        {icon && <span className={`flex-shrink-0 transition-colors ${focused ? "text-primary" : "text-slate-300"}`}>{icon}</span>}
        <input
          type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-slate-800 font-medium text-sm outline-none placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}

function TextAreaField({
  label, name, value, onChange, placeholder,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <textarea
        name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className={`w-full px-4 py-3 rounded-2xl border transition-all duration-200 bg-white text-slate-800 font-medium text-sm outline-none resize-none placeholder:text-slate-300 ${
          focused ? "border-primary ring-2 ring-primary/15 shadow-sm" : "border-slate-200 hover:border-slate-300"
        }`}
      />
    </div>
  );
}

function ToggleRow({
  icon, title, description, isActive, onToggle,
}: {
  icon: React.ReactNode; title: string; description: string; isActive: boolean; onToggle: () => void;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onClick={onToggle}
      className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          isActive ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
        }`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      {/* Animated toggle */}
      <div
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex-shrink-0 ${
          isActive ? "bg-primary" : "bg-slate-200"
        }`}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ x: isActive ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </motion.div>
  );
}

/* ─── main page ─────────────────────────────────── */
export default function UserProfilePage() {
  const { user, refreshUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const { isDark, set: setDarkMode } = useDarkMode();

  const [preferences, setPreferences] = useState({
    darkMode: isDark,
    notifications: true,
    newsletter: false,
  });

  // Sync state if context changes externally
  useEffect(() => {
    setPreferences(prev => ({ ...prev, darkMode: isDark }));
  }, [isDark]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    address: "Kathmandu, Nepal",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: (user as any).phone || "",
        bio: (user as any).bio || "",
        address: (user as any).address || "Kathmandu, Nepal",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Moved useDarkMode call up to state initialization area

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === "darkMode") {
      setDarkMode(!isDark);
      setPreferences((prev) => ({ ...prev, darkMode: !isDark }));
    } else {
      setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?._id) return;
    setLoading(true);
    const data = new FormData();
    if (image) data.append("image", image);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("phone", formData.phone);
    data.append("bio", formData.bio);
    data.append("address", formData.address);
    data.append("preferences", JSON.stringify(preferences));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/auth/${user._id}`, {
        method: "PUT",
        credentials: "include",
        body: data,
      });
      if (res.ok) {
        await refreshUser();
        setImage(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const isDoctor = user.role === "doctor";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8FAFD] pb-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ── Header ── */}
          <motion.div className="mb-10" initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
              Account Settings
            </motion.p>
            <motion.h1 variants={fadeUp} custom={0.05} className="text-3xl font-black text-slate-900 tracking-tight">
              My Profile
            </motion.h1>
            <motion.p variants={fadeUp} custom={0.1} className="text-slate-400 mt-1 text-sm">
              Manage your personal information and preferences.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Sidebar profile card ── */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            >
              <div className="bg-white rounded-[2.5rem] p-8 border border-primary/15 shadow-lg shadow-primary/8 relative overflow-hidden sticky top-6">
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-5 group/img">
                    <div className="w-28 h-28 rounded-[1.8rem] overflow-hidden ring-4 ring-primary/20 shadow-lg">
                      <img
                        src={preview || getImageUrl(user.image, user._id)}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                      />
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all duration-300 rounded-[1.8rem] backdrop-blur-sm">
                      <PenTool className="w-5 h-5 text-white" />
                      <input
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                      />
                    </label>
                    {/* Role dot */}
                    <span className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${isDoctor ? "bg-primary" : "bg-emerald-400"}`} />
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {isDoctor ? "Dr. " : ""}{user.firstName} {user.lastName}
                  </h2>

                  {/* Role badge */}
                  <div className={`inline-flex items-center gap-1.5 mt-2 mb-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isDoctor ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isDoctor ? "Doctor Account" : "Patient Account"}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-slate-100 mb-6" />

                  {/* Info rows */}
                  <div className="w-full space-y-4 text-left">
                    <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
                    <InfoRow
                      icon={<Calendar className="w-4 h-4" />}
                      label="Member Since"
                      value={new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    />
                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={formData.address || "Kathmandu, Nepal"} />
                    {isDoctor && (
                      <InfoRow icon={<Stethoscope className="w-4 h-4" />} label="Role" value="Registered Doctor" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Main content ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Personal info form */}
              <motion.div
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Update your name, contact, and bio</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    label="First Name" name="firstName" value={formData.firstName}
                    onChange={handleInputChange} placeholder="Jane"
                    icon={<User className="w-4 h-4" />}
                  />
                  <FormField
                    label="Last Name" name="lastName" value={formData.lastName}
                    onChange={handleInputChange} placeholder="Doe"
                    icon={<User className="w-4 h-4" />}
                  />
                  <FormField
                    label="Phone Number" name="phone" type="tel" value={formData.phone}
                    onChange={handleInputChange} placeholder="+977 98XXXXXXXX"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <FormField
                    label="Address" name="address" value={formData.address}
                    onChange={handleInputChange} placeholder="Kathmandu, Nepal"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>

                <TextAreaField
                  label="Bio / About" name="bio" value={formData.bio}
                  onChange={handleInputChange} placeholder="Tell patients a little about yourself..."
                />

                {/* Save button */}
                <div className="flex items-center justify-end gap-4 mt-6">
                  <AnimatePresence>
                    {saved && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-2 text-sm font-bold text-emerald-600"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Saved!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.03 } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                      loading
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25"
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Preferences */}
              <motion.div
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.35 }}
              >
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">App Preferences</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Customize your experience</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <ToggleRow
                    icon={<Moon className="w-4 h-4" />}
                    title="Dark Mode"
                    description="Switch to a darker theme for low-light environments."
                    isActive={isDark}
                    onToggle={() => togglePreference("darkMode")}
                  />
                  <div className="h-px bg-slate-50 mx-4" />
                  <ToggleRow
                    icon={<Bell className="w-4 h-4" />}
                    title="Push Notifications"
                    description="Receive alerts about appointments and messages."
                    isActive={preferences.notifications}
                    onToggle={() => togglePreference("notifications")}
                  />
                  <div className="h-px bg-slate-50 mx-4" />
                  <ToggleRow
                    icon={<Sparkles className="w-4 h-4" />}
                    title="Product Updates"
                    description="Get the latest news and feature updates."
                    isActive={preferences.newsletter}
                    onToggle={() => togglePreference("newsletter")}
                  />
                </div>
              </motion.div>

              {/* Danger zone */}
              <motion.div
                className="bg-white rounded-[2rem] p-8 border border-red-100 shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.45 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Account Security</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage your login credentials</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    Change Password
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 px-5 py-3 rounded-2xl border border-red-100 text-red-400 font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all"
                  >
                    Delete Account
                  </motion.button>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
