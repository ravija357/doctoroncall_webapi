"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Stethoscope, User, ArrowRight, Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoleSelectionPage() {
  const { setRole } = useRole();
  const router = useRouter();

  const handleSelectRole = (selectedRole: 'doctor' | 'patient') => {
    setRole(selectedRole);
    if (selectedRole === 'doctor') {
      router.push('/login');
    } else {
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[5000ms]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4">
        
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center p-3 px-6 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-4"
          >
             <Activity className="w-5 h-5 text-blue-400 mr-2" />
             <span className="text-blue-100 font-medium tracking-wide text-sm">Next-Gen Healthcare Platform</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Doctor<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">OnCall</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the future of medical care. Seamlessly connecting world-class specialists with patients worldwide.
          </motion.p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          
          {/* Doctor Card */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => handleSelectRole('doctor')}
            className="group relative h-96 bg-gradient-to-br from-slate-900 to-slate-900/50 p-1 rounded-[2.5rem] hover:scale-[1.02] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            <div className="absolute inset-[1px] bg-slate-950 rounded-[2.45rem] overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                     <ShieldCheck className="w-64 h-64 text-emerald-500" />
                </div>
                
                <div className="relative h-full flex flex-col justify-between p-10 z-10 text-left">
                    <div>
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                             <Stethoscope className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">I'm a Doctor</h2>
                        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                            Join our network of top-tier professionals. Manage your practice, consult remotely, and expand your reach.
                        </p>
                    </div>

                    <div className="flex items-center text-emerald-500 font-bold group-hover:translate-x-2 transition-transform duration-300">
                        <span className="uppercase tracking-wider text-sm">Enter Portal</span>
                        <ArrowRight className="w-5 h-5 ml-3" />
                    </div>
                </div>
            </div>
          </motion.button>

          {/* Patient Card */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={() => handleSelectRole('patient')}
            className="group relative h-96 bg-gradient-to-br from-slate-900 to-slate-900/50 p-1 rounded-[2.5rem] hover:scale-[1.02] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            <div className="absolute inset-[1px] bg-slate-950 rounded-[2.45rem] overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
                     <HeartPulse className="w-64 h-64 text-blue-500" />
                </div>
                
                <div className="relative h-full flex flex-col justify-between p-10 z-10 text-left">
                    <div>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                             <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">I'm a Patient</h2>
                        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                            Access premium healthcare instantly. Book appointments, consult specialists, and manage your health data securey.
                        </p>
                    </div>

                    <div className="flex items-center text-blue-500 font-bold group-hover:translate-x-2 transition-transform duration-300">
                        <span className="uppercase tracking-wider text-sm">Start Journey</span>
                        <ArrowRight className="w-5 h-5 ml-3" />
                    </div>
                </div>
            </div>
          </motion.button>
        </div>

      </div>
    </div>
  );
}
