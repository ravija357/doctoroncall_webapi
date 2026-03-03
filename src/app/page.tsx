"use client";

import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Stethoscope, User, ArrowRight, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Background3D from '@/components/landing/Background3D';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" as any },
  },
};

export default function LandingPage() {
  const { setRole } = useRole();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectRole = (selectedRole: 'doctor' | 'patient') => {
    setRole(selectedRole);
    router.push('/login');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#70C0FA] flex flex-col items-center justify-start relative overflow-hidden font-sans">
      
      {/* 3D Background Layer */}
      <Background3D />

      <main className="relative z-10 w-full max-w-md mx-auto px-8 pt-20 pb-12 flex flex-col items-center min-h-screen">
        
        {/* Logo Card - Matching Reference Exactly */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-48 h-48 bg-white !bg-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-6 mb-16 relative group"
        >
          <div className="absolute inset-0 bg-blue-100/50 rounded-[3rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
             {/* Use the actual Logo Image */}
             <div className="relative mb-2 w-32 h-32 flex items-center justify-center">
                <motion.img
                  src="/assets/images/doctoroncall_logo.png"
                  alt="DoctorOnCall Logo"
                  className="w-full h-full object-contain"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-[#70C0FA]/20 rounded-full blur-xl"
                />
             </div>
             <span className="text-[#70C0FA] font-black text-xl tracking-tighter uppercase">doctoroncall</span>
          </div>
        </motion.div>

        {/* "I'm a" Text - Matching Reference Serif Style */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-serif italic text-white mb-12 drop-shadow-lg"
        >
          I'm a
        </motion.h1>

        {/* Role Selection Buttons - Matching Reference Exactly with Premium Effects */}
        <div className="w-full space-y-6">
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            whileHover={{ 
              scale: 1.03, 
              y: -4,
              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectRole('doctor')}
            className="w-full py-6 bg-white !bg-white rounded-3xl shadow-xl shadow-blue-900/10 flex items-center justify-center group relative overflow-hidden transition-shadow duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="text-3xl font-serif text-[#70C0FA] relative z-10">Doctor</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ 
              scale: 1.03, 
              y: -4,
              boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)"
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectRole('patient')}
            className="w-full py-6 bg-white !bg-white rounded-3xl shadow-xl shadow-blue-900/10 flex items-center justify-center group relative overflow-hidden transition-shadow duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="text-3xl font-serif text-[#70C0FA] relative z-10">Patient</span>
          </motion.button>
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="mt-auto pt-12"
        >
          <div className="w-12 h-1 bg-white/50 rounded-full" />
        </motion.div>
      </main>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
