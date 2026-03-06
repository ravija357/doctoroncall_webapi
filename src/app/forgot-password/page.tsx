"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setIsSent(true);
        toast.success("Reset link sent! Check your email.");
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      sidebar={
        <div className="absolute inset-0 h-full w-full bg-[#0a192f] overflow-hidden flex items-center justify-center group">
          {/* Deep premium background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-hover via-primary to-[#0f2a4a] opacity-95" />

          {/* Micro-grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          {/* Ambient orbs */}
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-light/40 blur-[140px] mix-blend-screen animate-pulse duration-[8000ms]" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/30 blur-[150px] mix-blend-screen animate-pulse duration-[12000ms] delay-1000" />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-12 transition-transform duration-1000 ease-out group-hover:scale-[1.02]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 blur-[100px] rounded-full opacity-60 group-hover:bg-white/20 transition-all duration-1000 ease-in-out" />

            {/* Glassmorphism logo card */}
            <div className="relative bg-white/90 backdrop-blur-[40px] p-20 rounded-[4rem] border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden hover:bg-white hover:border-white transition-all duration-700 ease-in-out transform group-hover:-translate-y-2">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white to-transparent opacity-50" />
              <img
                src="/doctoroncall-log.png"
                alt="DoctorOnCall Logo"
                className="relative z-10 h-32 w-auto object-contain drop-shadow-sm transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Typography */}
            <div className="mt-14 flex flex-col items-center max-w-sm text-center transform group-hover:-translate-y-2 transition-transform duration-700 ease-out delay-100">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40 mb-4 tracking-tight">
                Recover Your Access.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                We'll send a secure reset link to your email. Back and{" "}
                <span className="text-white/90 font-bold">protected</span> in minutes.
              </p>
            </div>

            {/* Hover accent */}
            <div className="mt-12 flex flex-col items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-in-out delay-300">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
                <span className="text-primary-light/80 text-[10px] font-bold tracking-[0.5em] uppercase">Secure Recovery</span>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group mb-6">
          <img 
            src="/doctoroncall-log.png" 
            alt="DoctorOnCall Logo" 
            className="h-16 w-auto object-contain"
          />
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Forgot password?</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
            No worries! Enter your email and we'll send you instructions to reset your password.
          </p>
        </motion.div>
      </div>

      <div className="mt-8">
        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-700 font-bold">Email address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl pl-11"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-primary/5 border border-primary/10 p-8 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Check your email</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              We've sent a password reset link to <span className="text-primary font-bold">{email}</span>.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSent(false)}
              className="w-full h-11 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
            >
              Didn't receive it? Try again
            </Button>
          </motion.div>
        )}

        <div className="mt-8">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
