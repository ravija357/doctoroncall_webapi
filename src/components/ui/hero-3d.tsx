"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { Activity, Shield, Heart, Stethoscope, CheckCircle2 } from "lucide-react";

export default function Hero3D() {
  const ref = useRef(null);

  // Mouse tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-lg aspect-square mx-auto lg:mr-0 perspective-1000 hidden lg:block"
    >
      {/* Main Glass Card */}
      <motion.div
        style={{ transform: "translateZ(50px)" }}
        className="absolute inset-4 rounded-[3rem] bg-gradient-to-br from-white/80 to-white/20 backdrop-blur-xl border border-white/50 shadow-2xl flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5 mb-6 shadow-lg shadow-blue-500/30">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                 <Activity className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-emerald-400 stroke-[3px]" style={{ stroke: "url(#blue-emerald)" }} />
                  {/* SVG Gradient definition for the icon stroke */}
                 <svg width="0" height="0">
                    <linearGradient id="blue-emerald" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop stopColor="#10b981" offset="0%" />
                        <stop stopColor="#3b82f6" offset="100%" />
                    </linearGradient>
                </svg>
            </div>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Dr. Sarah</h3>
        <p className="text-slate-500 font-medium mb-6">Cardiologist • Top Rated</p>
        
        <div className="flex gap-2 w-full">
             <div className="flex-1 bg-slate-50 rounded-2xl p-3">
                 <p className="text-xs text-slate-400 font-bold uppercase">Patients</p>
                 <p className="text-lg font-bold text-slate-800">1.2k+</p>
             </div>
             <div className="flex-1 bg-slate-50 rounded-2xl p-3">
                 <p className="text-xs text-slate-400 font-bold uppercase">Rating</p>
                 <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold text-slate-800">4.9</span>
                    <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                 </div>
             </div>
        </div>
      </motion.div>

      {/* Floating Elements (Parallax) */}
      <motion.div
         style={{ transform: "translateZ(120px)" }}
         className="absolute -top-10 -right-10 w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-50"
      >
          <Stethoscope className="w-10 h-10 text-blue-500" />
      </motion.div>
      
      <motion.div
         style={{ transform: "translateZ(80px)" }}
         className="absolute -bottom-6 -left-6 bg-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3 border border-slate-50"
      >
           <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
           </div>
           <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
               <p className="text-sm font-bold text-slate-800">Appointment Confirmed</p>
           </div>
      </motion.div>

       {/* Background Glow */}
       <div className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10 rounded-full" />
    </motion.div>
  );
}
