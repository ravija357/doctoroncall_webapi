"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setIsSuccess(true);
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (err: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      sidebar={
        <div className="absolute inset-0 h-full w-full bg-[#0a192f] overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-hover via-primary to-[#0f2a4a] opacity-95" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 flex flex-col items-center justify-center px-12">
            <div className="relative bg-white/90 backdrop-blur-[40px] p-20 rounded-[4rem] border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              <img 
                src="/doctoroncall-log.png" 
                alt="DoctorOnCall Logo" 
                className="h-32 w-auto object-contain"
              />
            </div>
            <div className="mt-14 flex flex-col items-center max-w-sm text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Security First.</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                We take your security seriously. Follow the instructions sent to your email to recover your access safely.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-10"
      >
        <Link href="/login" className="inline-flex items-center gap-2 group mb-8 text-slate-500 hover:text-primary transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Reset Password</h2>
        {!isSuccess && <p className="text-slate-500 font-medium">Enter your email and we'll send you recovery instructions.</p>}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        {!isSuccess ? (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl px-5 text-base font-medium"
              />
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Send Recovery Link"
                )}
              </Button>
            </motion.div>
          </form>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-8">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Check your email</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              If an account exists for <span className="text-slate-900 font-bold">{email}</span>, you will receive a password reset link shortly.
            </p>
            <Link href="/login">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
                Return to Login
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}
