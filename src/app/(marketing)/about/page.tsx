"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Activity, Users, Clock, Award, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20 pb-20">
      
      {/* Decorative Blob */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 pt-32 lg:pt-40">
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-light/50 shadow-sm shadow-primary/10"
          >
            <span className="text-xs font-bold text-primary tracking-wide uppercase">About DoctorOnCall</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight"
          >
            Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Care & Convenience.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium"
          >
            A unified platform empowering patients to find top-tier specialists, while giving doctors the tools they need to manage their practice effortlessly.
          </motion.p>
        </div>

        {/* Feature Grid for Both Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24">
          
          {/* Patient Perspective */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">For Patients</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We understand that your health is your most valuable asset. Our platform is designed to make accessing quality healthcare seamless, secure, and instant.
            </p>
            <ul className="space-y-4">
              <FeatureListItem icon={<Calendar />} text="Instant Appointment Booking" />
              <FeatureListItem icon={<PhoneCall />} text="HD Video Consultations" />
              <FeatureListItem icon={<ShieldCheck />} text="Secure Electronic Health Records" />
              <FeatureListItem icon={<Clock />} text="24/7 Access to Care History" />
            </ul>
          </motion.div>

          {/* Doctor Perspective */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10">
                <Activity className="w-8 h-8 text-primary-light" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">For Doctors</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Focus on what matters most: patient care. We provide a robust digital infrastructure to digitize your practice, manage schedules, and grow your reach.
              </p>
              <ul className="space-y-4 text-slate-200">
                <FeatureListItem icon={<Clock />} text="Smart Schedule Management" />
                <FeatureListItem icon={<Users />} text="Centralized Patient Directory" />
                <FeatureListItem icon={<Activity />} text="Integrated Prescription System" />
                <FeatureListItem icon={<Award />} text="Verified Digital Presence" />
              </ul>
            </div>
          </motion.div>

        </div>

        {/* Call to Action */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-3xl font-black text-slate-900 mb-6">Ready to experience the future of healthcare?</h3>
            <Link href="/register">
              <Button className="h-14 px-10 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:-translate-y-1">
                Join the Network
              </Button>
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}

function FeatureListItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
        {React.isValidElement<{ className?: string }>(icon) 
          ? React.cloneElement(icon, { className: "w-5 h-5" }) 
          : icon}
      </div>
      <span className="font-bold">{text}</span>
    </li>
  );
}
