"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useRole } from "@/context/RoleContext";
import { useState } from "react";
import { Button } from "./ui/button";
import { User, LogOut, ChevronDown, Menu, LayoutDashboard, Calendar, Users, MessageSquare, Bell, Search, Clock, Stethoscope, FileText, Pill, History, UserCog, HeartPulse } from "lucide-react";
import { getImageUrl } from "@/utils/imageHelper";
import { useEffect, useRef } from "react";
import { doctorService } from "@/services/doctor.service";
import { Doctor } from "@/types";
import { motion, AnimatePresence } from "framer-motion";


const DOCTOR_FEATURES = [
  { name: 'Dashboard', route: '/doctor/dashboard', icon: LayoutDashboard },
  { name: 'My Patients', route: '/my-patients', icon: Users },
  { name: 'Revenue & Fees', route: '/doctor/revenue', icon: HeartPulse },
  { name: 'Schedule Manager', route: '/schedule', icon: Calendar },
  { name: 'Messages', route: '/messages', icon: MessageSquare },
  { name: 'Profile Settings', route: '/user/profile', icon: UserCog },
];

const PATIENT_FEATURES = [
  { name: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
  { name: 'Find a Specialist', route: '/doctors', icon: Stethoscope },
  { name: 'My Appointments', route: '/appointments', icon: Clock },
  { name: 'Medical Records', route: '/medical-records', icon: FileText },
  { name: 'Prescriptions', route: '/prescriptions', icon: Pill },
  { name: 'Quick Messages', route: '/messages', icon: MessageSquare },
  { name: 'Account Profile', route: '/user/profile', icon: User },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { role: storedRole } = useRole();
  const { unreadMessageCount: unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [doctorResults, setDoctorResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use user.role if available (authenticated), otherwise fallback to storedRole for optimistic UI
  const isDoctor = user ? user.role === 'doctor' : storedRole === 'doctor';

  const handleFeatureClick = (route: string) => {
      router.push(route);
      setSearchQuery("");
      setShowResults(false);
  };

  // Feature filtering
  const features = isDoctor ? DOCTOR_FEATURES : PATIENT_FEATURES;
  const filteredFeatures = searchQuery 
    ? features.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Real-time doctor search for patients
  useEffect(() => {
    if (!isDoctor && searchQuery.length > 1) {
      const fetchDoctors = async () => {
        setIsSearching(true);
        try {
          const results = await doctorService.getAllDoctors({ name: searchQuery });
          setDoctorResults(results.slice(0, 3)); // Only show top 3
        } catch (err) {
          console.error("Navbar doctor search failed", err);
        } finally {
          setIsSearching(false);
        }
      };
      const timer = setTimeout(fetchDoctors, 300);
      return () => clearTimeout(timer);
    } else {
      setDoctorResults([]);
    }
  }, [searchQuery, isDoctor]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (!isDoctor) {
          router.push(`/doctors?name=${encodeURIComponent(searchQuery.trim())}`);
          setShowResults(false);
      }
    }
  };

  // Theme Config - Standardizing to the new primary color for all users
  const theme = {
    accent: "text-primary",
    bg: "bg-primary-light/10",
    border: "border-primary-light/20",
    button: "bg-primary hover:bg-primary-hover shadow-primary/30",
    hoverText: "hover:text-primary",
    ring: "focus:ring-primary",
    logoColor: "text-slate-900"
  };

  return (
    <nav className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md border-primary-light/20`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/home" className="flex items-center gap-2 group">
          {/* Logo Placeholder - You can swap image source based on role if you have variants */}
          <div className="flex items-center gap-2">
             <img 
                src="/doctoroncall-log.png" 
                alt="DoctorOnCall Logo" 
                className="h-12 w-auto object-contain"
             />
             {isDoctor && <span className="px-2 py-0.5 rounded-md bg-primary-light/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">Doctor Portal</span>}
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {isDoctor ? (
            <>
                <NavLink href="/doctor/dashboard" theme={theme}>Dashboard</NavLink>
                <NavLink href="/my-patients" theme={theme}>My Patients</NavLink>
                <NavLink href="/schedule" theme={theme}>Schedule</NavLink>
                <NavLink href="/messages" theme={theme} badge={unreadCount}>Messages</NavLink>
                <NavLink href="/about" theme={theme}>How it Works</NavLink>
            </>
          ) : (
            <>
                <NavLink href="/dashboard" theme={theme}>Dashboard</NavLink>
                <NavLink href="/doctors" theme={theme}>Find Doctors</NavLink>
                <NavLink href="/appointments" theme={theme}>Appointments</NavLink>
                <NavLink href="/messages" theme={theme} badge={unreadCount}>Messages</NavLink>
                <NavLink href="/about" theme={theme}>How it Works</NavLink>
            </>
          )}
          
          {/* Unified Search Bar */}
          <div className="relative" ref={searchRef}>
             <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 focus-within:ring-2 ring-[#70c0fa]/30 transition-all w-64 xl:w-80 group">
                <Search className={`w-4 h-4 transition-colors ${showResults ? 'text-[#70c0fa]' : 'text-slate-400'}`} />
                <input 
                    type="text" 
                    placeholder={isDoctor ? "Search features..." : "Search doctors or tools..."} 
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-300 font-medium"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    onKeyDown={handleSearchKeyDown}
                />
                {isSearching && (
                    <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-[#70c0fa] rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-[#70c0fa] rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                )}
             </div>
             
             {/* Unified Results Dropdown */}
             <AnimatePresence>
                 {showResults && (searchQuery.length > 0) && (filteredFeatures.length > 0 || doctorResults.length > 0) && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-3 right-0 w-[22rem] bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden py-2 z-[60]"
                     >
                         {/* Features Section */}
                         {filteredFeatures.length > 0 && (
                             <div className="mb-2">
                                 <div className="px-5 py-2 text-[10px] font-black text-[#70c0fa] uppercase tracking-[0.2em] bg-blue-50/30 mb-1">
                                     App Features
                                 </div>
                                 {filteredFeatures.map((feature) => (
                                     <button
                                        key={feature.route}
                                        onClick={() => handleFeatureClick(feature.route)}
                                        className="w-full text-left px-5 py-3 hover:bg-[#70c0fa]/5 text-slate-700 flex items-center gap-4 transition-all group/item"
                                     >
                                         <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                                            <feature.icon className="w-4 h-4 text-slate-400 group-hover/item:text-[#70c0fa] transition-colors" />
                                         </div>
                                         <span className="text-sm font-bold group-hover/item:text-slate-900 transition-colors">{feature.name}</span>
                                     </button>
                                 ))}
                             </div>
                         )}

                         {/* Doctor Results Section (Patient Only) */}
                         {!isDoctor && doctorResults.length > 0 && (
                             <div className="mt-2 pt-2 border-t border-slate-50">
                                 <div className="px-5 py-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-50/30 mb-1">
                                     Top Specialists
                                 </div>
                                 {doctorResults.map((doc) => (
                                     <button
                                        key={doc._id}
                                        onClick={() => handleFeatureClick(`/doctors/${doc._id}`)}
                                        className="w-full text-left px-5 py-3 hover:bg-emerald-50/5 text-slate-700 flex items-center gap-4 transition-all group/doctor"
                                     >
                                         <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 group-hover/doctor:border-emerald-200 transition-all">
                                            {doc.user.image ? (
                                                <img src={getImageUrl(doc.user.image, doc.user._id)} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-400">{doc.user.firstName?.[0]}</div>
                                            )}
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 leading-none">Dr. {doc.user.firstName} {doc.user.lastName}</span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{doc.specialization} • {doc.averageRating?.toFixed(1) || 'New'} ★</span>
                                         </div>
                                     </button>
                                 ))}
                                 <button 
                                    onClick={() => handleFeatureClick(`/doctors?name=${searchQuery}`)}
                                    className="w-full text-center py-3 text-xs font-bold text-slate-400 hover:text-[#70c0fa] transition-colors"
                                 >
                                    View all matching doctors
                                 </button>
                             </div>
                         )}
                     </motion.div>
                 )}
             </AnimatePresence>
          </div>

          {/* Notification Bell */}
          {user && <NotificationBell theme={theme} />}
          
          <div className="h-6 w-px bg-gray-200" />

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/user/profile" className="flex items-center gap-3 group pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-all">
                <div className={`w-10 h-10 rounded-full ${theme.bg} ${theme.border} border flex items-center justify-center overflow-hidden transition-colors`}>
                  <img 
                    src={getImageUrl(user.image, user._id)} 
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold leading-none ${isDoctor ? 'text-slate-800 group-hover:text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                      {isDoctor ? `Dr. ${user.firstName}` : user.firstName || 'User'}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${theme.accent}`}>
                      {isDoctor ? 'DOCTOR' : user.role}
                  </span>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className={`font-bold text-primary`}>Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className={`font-bold rounded-full px-6 shadow-md transition-all hover:scale-105 active:scale-95 ${theme.button} text-white`}>
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Burger */}
        <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
}

function NavLink({ href, children, theme, badge }: { href: string, children: React.ReactNode, theme: any, badge?: number }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`text-sm font-bold transition-colors relative group flex items-center gap-1 ${
        isActive ? 'text-primary' : `text-gray-500 ${theme.hoverText}`
      }`}
    >
      {children}
      {badge && badge > 0 ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
              {badge > 9 ? '9+' : badge}
          </span>
      ) : null}
      {/* active indicator */}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
          isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'
        }`}
      />
    </Link>
  );
}

function NotificationBell({ theme }: { theme: any }) {
    const { unreadCount } = useNotifications();
    return (
        <Link href="/notifications" className="relative group p-2">
            <Bell className={`w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors ${theme.hoverText}`} />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </Link>
    );
}
