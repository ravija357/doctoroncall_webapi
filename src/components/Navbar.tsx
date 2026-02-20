"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useRole } from "@/context/RoleContext";
import { useState } from "react";
import { Button } from "./ui/button";
import { User, LogOut, ChevronDown, Menu, LayoutDashboard, Calendar, Users, MessageSquare, Bell, Search } from "lucide-react";
import { getImageUrl } from "@/utils/imageHelper";


const DOCTOR_FEATURES = [
  { name: 'Dashboard', route: '/doctor/dashboard', icon: LayoutDashboard },
  { name: 'My Patients', route: '/my-patients', icon: Users },
  { name: 'Schedule', route: '/schedule', icon: Calendar },
  { name: 'Messages', route: '/messages', icon: MessageSquare },
  { name: 'Profile', route: '/user/profile', icon: User },
  { name: 'Notifications', route: '/notifications', icon: Bell },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { role: storedRole } = useRole();
  const { unreadMessageCount: unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (!user || user.role !== 'doctor') {
          router.push(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleFeatureClick = (route: string) => {
      router.push(route);
      setSearchQuery("");
      setShowResults(false);
  };
  
  // Use user.role if available (authenticated), otherwise fallback to storedRole for optimistic UI
  const isDoctor = user ? user.role === 'doctor' : storedRole === 'doctor';

  const filteredFeatures = isDoctor && searchQuery 
    ? DOCTOR_FEATURES.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Theme Config
  const theme = isDoctor ? {
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    hoverText: "hover:text-emerald-600",
    ring: "focus:ring-emerald-500",
    logoColor: "text-emerald-900" 
  } : {
    accent: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    button: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
    hoverText: "hover:text-blue-600",
    ring: "focus:ring-blue-500",
    logoColor: "text-slate-900"
  };

  return (
    <nav className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md ${isDoctor ? 'border-emerald-100' : 'border-slate-100'}`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/home" className="flex items-center gap-2 group">
          {/* Logo Placeholder - You can swap image source based on role if you have variants */}
          <div className="flex items-center gap-2">
             <img 
                src="/doctoroncall-log.png" 
                alt="DoctorOnCall Logo" 
                className="h-12 w-auto object-contain"
             />
             {isDoctor && <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">Doctor Portal</span>}
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
            </>
          ) : (
            <>
                <NavLink href="/doctors" theme={theme}>Find Doctors</NavLink>
                <NavLink href="/appointments" theme={theme}>Appointments</NavLink>
                <NavLink href="/messages" theme={theme} badge={unreadCount}>Messages</NavLink>
                <NavLink href="/about" theme={theme}>How it Works</NavLink>
            </>
          )}
          
          {/* Search Bar for Doctors */}
          {isDoctor && (
             <div className="relative">
                 <div className="flex items-center gap-2 bg-emerald-50/50 px-3 py-1.5 rounded-full border border-emerald-100 focus-within:ring-2 ring-emerald-100 transition-all mr-2 w-auto md:w-auto">
                    <Search className="w-3.5 h-3.5 text-emerald-600/50 flex-shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Search features..." 
                        className="bg-transparent border-none outline-none text-xs w-20 md:w-40 text-emerald-900 placeholder:text-emerald-600/50 transition-all focus:w-32 md:focus:w-48" 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowResults(true);
                        }}
                        onFocus={() => setShowResults(true)}
                        // Delay blur to allow click on result
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    />
                 </div>
                 
                 {/* Feature Dropdown */}
                 {showResults && filteredFeatures.length > 0 && (
                     <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-xl shadow-xl border border-emerald-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 z-[60]">
                         <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-100 mb-1">
                             Navigate To
                         </div>
                         {filteredFeatures.map((feature) => (
                             <button
                                key={feature.route}
                                onClick={() => handleFeatureClick(feature.route)}
                                className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-sm text-slate-700 hover:text-emerald-700 flex items-center gap-3 transition-colors"
                             >
                                 <feature.icon className="w-4 h-4 opacity-70" />
                                 {feature.name}
                             </button>
                         ))}
                     </div>
                 )}
             </div>
          )}

           {/* Search Bar for Patients - Responsive */}
           {!isDoctor && (
             <div className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200 focus-within:ring-2 ring-blue-100 transition-all mr-2 w-auto md:w-auto">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input 
                    type="text" 
                    placeholder="Search doctors..." 
                    className="bg-transparent border-none outline-none text-xs w-20 md:w-40 text-slate-700 placeholder:text-slate-400 transition-all focus:w-32 md:focus:w-48"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
             </div>
          )}

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
                  <span className={`text-sm font-bold leading-none ${isDoctor ? 'text-slate-800 group-hover:text-emerald-700' : 'text-gray-900'}`}>
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
                <Button variant="ghost" className={`font-bold ${isDoctor ? 'text-emerald-900' : 'text-blue-900'}`}>Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className={`font-bold rounded-full px-6 shadow-md transition-all hover:scale-105 active:scale-95 ${theme.button}`}>
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
  return (
    <Link href={href} className={`text-sm font-bold text-gray-500 ${theme.hoverText} transition-colors relative group flex items-center gap-1`}>
      {children}
      {badge && badge > 0 ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
              {badge > 9 ? '9+' : badge}
          </span>
      ) : null}
      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full opacity-50`} />
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
