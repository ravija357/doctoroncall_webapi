"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { form, isLoading, error, currentRole, onSubmit } = useRegisterForm();
  const { register, formState: { errors } } = form;

  return (
    <AuthLayout
      reverse
      sidebar={
        <div className="absolute inset-0 h-full w-full bg-[#0a192f] overflow-hidden flex items-center justify-center group">
          {/* Deep premium background with sleek gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-hover via-primary to-[#0f2a4a] opacity-95" />
          
          {/* Subtle micro-grid pattern for modern feel */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          {/* Elegant ambient light orbs with smooth pulsing */}
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-light/40 blur-[140px] mix-blend-screen animate-pulse duration-[8000ms]" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/30 blur-[150px] mix-blend-screen animate-pulse duration-[12000ms] delay-1000" />
          
          {/* Main Logo Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-12 transition-transform duration-1000 ease-out group-hover:scale-[1.02]">
            {/* Dynamic glow behind the glass card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 blur-[100px] rounded-full opacity-60 group-hover:bg-white/20 transition-all duration-1000 ease-in-out" />
            
            {/* Ultra-premium glassmorphism card - made light to show the original dark logo clearly */}
            <div className="relative bg-white/90 backdrop-blur-[40px] p-20 rounded-[4rem] border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden hover:bg-white hover:border-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] transition-all duration-700 ease-in-out transform group-hover:-translate-y-2">
              
              {/* Subtle glass reflections */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white to-transparent opacity-50" />
              
              <img 
                src="/doctoroncall-log.png" 
                alt="DoctorOnCall Logo" 
                className="relative z-10 h-32 w-auto object-contain drop-shadow-sm transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              />
            </div>
            
            {/* High-End Typography Elements */}
            <div className="mt-14 flex flex-col items-center max-w-sm text-center transform group-hover:-translate-y-2 transition-transform duration-700 ease-out delay-100">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40 mb-4 tracking-tight">
                Join the Revolution.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                Experience seamless healthcare connectivity with our state-of-the-art secure network. Join the <span className="text-white/90 font-bold">doctoroncall</span> community today.
              </p>
            </div>
            
            {/* Minimalist Accents (Kept subtle for balance) */}
            <div className="mt-12 flex flex-col items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-in-out delay-300">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
                <span className="text-primary-light/80 text-[10px] font-bold tracking-[0.5em] uppercase">Join Now</span>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-10 text-center lg:text-left"
      >
        <Link href="/" className="inline-flex items-center gap-2 group mb-8">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform duration-500 shadow-sm shadow-slate-200/50">
            <img 
              src="/doctoroncall-log.png" 
              alt="DoctorOnCall Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
        </Link>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Create account</h2>
        <p className="text-slate-500 font-medium">
          Already part of the network?{" "}
          <Link href="/login" className="font-black text-primary hover:text-primary-hover underline-offset-8 hover:underline decoration-2 transition-all">
            Sign in
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName")}
                className={`h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl px-5 text-base font-medium ${errors.firstName ? "border-red-500 ring-4 ring-red-500/5" : ""}`}
              />
              {errors.firstName && <p className="text-xs font-bold text-red-500 mt-1.5 ml-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
                className={`h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl px-5 text-base font-medium ${errors.lastName ? "border-red-500 ring-4 ring-red-500/5" : ""}`}
              />
              {errors.lastName && <p className="text-xs font-bold text-red-500 mt-1.5 ml-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl px-5 text-base font-medium ${errors.email ? "border-red-500 ring-4 ring-red-500/5" : ""}`}
            />
            {errors.email && <p className="text-xs font-bold text-red-500 mt-1.5 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" title="password" className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl px-5 text-base font-medium ${errors.password ? "border-red-500 ring-4 ring-red-500/5" : ""}`}
            />
            {errors.password && <p className="text-xs font-bold text-red-500 mt-1.5 ml-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" title="confirmPassword" className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl px-5 text-base font-medium ${errors.confirmPassword ? "border-red-500 ring-4 ring-red-500/5" : ""}`}
            />
            {errors.confirmPassword && <p className="text-xs font-bold text-red-500 mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="py-2">
            <input type="hidden" {...register("role")} />
            {errors.role && <p className="text-xs font-bold text-red-500 mt-1.5 ml-1">{errors.role.message}</p>}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-red-50 p-4 border border-red-100"
            >
              <p className="text-sm font-bold text-red-600 text-center uppercase tracking-wider">{error}</p>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finalizing node...
                </>
              ) : (
                "Initialize Registration"
              )}
            </Button>
          </motion.div>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-[11px] text-slate-400 leading-relaxed text-center italic"
        >
          By creating an account, you agree to our <span className="underline cursor-pointer hover:text-slate-600 transition-colors">Terms of Service</span> and <span className="underline cursor-pointer hover:text-slate-600 transition-colors">Privacy Policy</span>.
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}
