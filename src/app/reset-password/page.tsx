"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Strength indicator
  const strength = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();
  const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setIsDone(true);
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(data.message || "Reset failed. Please try again.");
      }
    } catch {
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
                Secure Your Account.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                Choose a strong new password. Your data stays{" "}
                <span className="text-white/90 font-bold">private and encrypted</span>.
              </p>
            </div>

            {/* Hover accent */}
            <div className="mt-12 flex flex-col items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-in-out delay-300">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
                <span className="text-primary-light/80 text-[10px] font-bold tracking-[0.5em] uppercase">256-bit Encrypted</span>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/40" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group mb-6">
          <img src="/doctoroncall-log.png" alt="DoctorOnCall Logo" className="h-16 w-auto object-contain" />
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            {isDone ? "All done! 🎉" : "Set new password"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
            {isDone
              ? "Your password has been updated. Redirecting you to login..."
              : "Choose a strong password to protect your DoctorOnCall account."}
          </p>
        </motion.div>
      </div>

      <div className="mt-8">
        {isDone ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Password updated!</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Redirecting you to login in a moment...
            </p>
            <Button onClick={() => router.push("/login")} className="w-full h-11 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl">
              Go to Login Now
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!token && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
                ⚠️ This reset link appears to be invalid. Please{" "}
                <Link href="/forgot-password" className="font-bold underline">request a new one</Link>.
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-700 font-bold">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl pl-11 pr-11"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < strength ? strengthColor : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-bold ${strength <= 1 ? "text-red-500" : strength === 2 ? "text-yellow-500" : "text-emerald-500"}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirm" className="text-slate-700 font-bold">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl pl-11 pr-11 ${
                    confirm && confirm !== password ? "border-red-300 focus:border-red-400" : ""
                  }`}
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-[11px] font-bold text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
              disabled={isLoading || !token}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
            </Button>
          </form>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
