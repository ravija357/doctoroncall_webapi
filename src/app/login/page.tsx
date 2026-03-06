"use client";

import { useState } from "react";

import Link from "next/link";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";

import { useLoginForm } from "@/hooks/useLoginForm";
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { SocialButton } from "@/components/ui/SocialButton";
import { Apple } from "lucide-react";

export default function LoginPage() {
  const { form, isLoading: isFormLoading, error, currentRole, onSubmit } = useLoginForm();
  const { register, formState: { errors }, setValue } = form;
  const { googleLogin, appleLogin } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        await googleLogin(tokenResponse.access_token, currentRole);
        toast.success("Logged in with Google!");
      } catch (err: any) {
        if (err.response?.status !== 403) {
          console.error(err);
        }
        toast.error(err.response?.data?.message || "Google Login failed");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google Login failed"),
    prompt: 'select_account', // Always show account chooser, don't auto-select
  });

  const handleAppleLogin = async () => {
    setIsAppleLoading(true);
    try {
      const mockAppleToken = "mock_apple_token_" + Math.random().toString(36).substring(7);
      await appleLogin(mockAppleToken, currentRole);
      toast.success("Logged in with Apple!");
    } catch (err: any) {
      if (err.response?.status !== 403) {
        console.error(err);
      }
      toast.error(err.response?.data?.message || "Apple Login failed");
    } finally {
      setIsAppleLoading(false);
    }
  };

  const isLoading = isFormLoading || isGoogleLoading || isAppleLoading;

  return (
    <AuthLayout
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
                The Future of Care.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                Experience seamless healthcare connectivity with our state-of-the-art secure network. Welcome back to <span className="text-white/90 font-bold">doctoroncall</span>.
              </p>
            </div>
            
            {/* Minimalist Accents (Kept subtle for balance) */}
            <div className="mt-12 flex flex-col items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-in-out delay-300">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
                <span className="text-primary-light/80 text-[10px] font-bold tracking-[0.5em] uppercase">Secure Portal</span>
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
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
      </div>

      <div className="mt-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-slate-700 font-bold">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl ${errors.email ? "border-red-500 ring-red-500" : ""}`}
            />
            {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" title="password" className="text-slate-700 font-bold">Password</Label>
              <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-hover">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl ${errors.password ? "border-red-500 ring-red-500" : ""}`}
            />
            {errors.password && <p className="text-xs font-bold text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
              <p className="text-sm font-bold text-red-600 text-center">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              `Sign In${currentRole === 'admin' ? ' as Admin' : ''}`
            )}
          </Button>

          {/* Admin login toggle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => form.setValue('role', currentRole === 'admin' ? 'user' : 'admin')}
              className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all rounded-full px-3 py-1.5 ${
                currentRole === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-3 h-3" />
              {currentRole === 'admin' ? 'Admin Mode Active — switch back' : 'Sign in as Admin'}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SocialButton
              onClick={() => googleLoginHandler()}
              disabled={isLoading}
              label="Google Account"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              }
            />

            <SocialButton
              onClick={handleAppleLogin}
              disabled={isLoading}
              label="Apple Account"
              icon={<Apple className="w-5 h-5 fill-slate-900" />}
            />
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-500 font-medium">
        Don't have an account?{" "}
        <Link href="/register" className="font-bold text-primary hover:text-primary-hover underline-offset-4 hover:underline transition-all">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
