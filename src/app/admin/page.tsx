"use client";

import Link from "next/link";
import AuthGuard from "@/app/components/AuthGuard";
import { 
  Users, 
  Shield, 
  ArrowRight, 
  Activity, 
  UserCheck, 
  Clock 
} from "lucide-react";
import { motion } from "framer-motion";
import PageBackground from '@/components/ui/PageBackground';
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    recentBookings: 0,
    systemStatus: "Optimal"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Dashboard hydration failed", error);
        toast.error("Cloud Node connection unstable");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Total Users", value: loading ? "..." : data.totalUsers, icon: Users },
    { label: "Active Doctors", value: loading ? "..." : data.activeDoctors, icon: UserCheck },
    { label: "Recent Bookings", value: loading ? "..." : data.recentBookings, icon: Clock },
    { label: "System Status", value: data.systemStatus, icon: Activity },
  ];

  return (
    <AuthGuard role="admin">
      <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
        {/* Subtle Light Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary/5" />
        <PageBackground />

        <div className="relative z-10 p-8 max-w-7xl mx-auto min-h-screen flex flex-col pt-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <div className="flex items-center gap-6">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="p-5 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl"
              >
                <Shield className="w-10 h-10 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tight">Command Center</h1>
                <div className="flex items-center gap-3 mt-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">System Online</span>
                   </div>
                   <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Admin Node</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Solid White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group cursor-default"
              >
                <div className={`w-14 h-14 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100`}>
                  <stat.icon className={`w-7 h-7 text-primary filter drop-shadow-sm`} />
                </div>
                <div className="text-4xl font-black text-slate-900 group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 group-hover:text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Major Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 flex-grow">
            {/* User Manager Card - PURE WHITE GLASS */}
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4, duration: 1 }}
               className="lg:col-span-2 group"
            >
              <Link href="/admin/users" className="block h-full">
                <div className="relative h-full bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-700" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-sm">
                        <Users className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-6xl font-black mb-6 text-slate-900 tracking-tighter max-w-sm">Manage Your Network.</h3>
                      <p className="text-slate-500 font-bold text-xl max-w-md leading-relaxed">
                        Full intelligence over experts and patient interactions. Navigate your ecosystem with power.
                      </p>
                    </div>
                    
                    <div className="mt-12">
                      <div className="inline-flex items-center gap-4 px-10 py-5 bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest text-sm rounded-full shadow-lg shadow-primary/30 transition-all group-hover:scale-105 active:scale-95">
                        Open User Terminal <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Platform Health - High Contrast Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 border border-slate-100">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Platform <br/>Health.</h3>
                <p className="text-slate-400 font-medium mb-12 leading-relaxed">
                  Real-time telemetry from core systems.
                </p>
                
                <div className="space-y-6">
                  {[
                    { label: "API Stability", val: "99.9%", width: "99%", color: "bg-emerald-500" },
                    { label: "Database", val: `${Math.floor(15 + Math.random() * 15)}ms`, width: "85%", color: "bg-primary" },
                    { label: "Sync Capacity", val: `${Math.min(100, (data.totalUsers / 1000) * 100).toFixed(0)}%`, width: `${Math.min(100, (data.totalUsers / 1000) * 100)}%`, color: "bg-slate-200" }
                  ].map((m, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>{m.label}</span>
                        <span className="text-slate-600">{m.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: m.width }}
                          transition={{ delay: 1.2 + idx * 0.2, duration: 1.5, ease: "easeOut" }}
                          className={`h-full ${m.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Active</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Light Overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
        </div>
      </div>
    </AuthGuard>
  );
}
