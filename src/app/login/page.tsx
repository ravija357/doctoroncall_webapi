"use client";

import { useState } from "react";

import Link from "next/link";
import { Loader2, Star, CheckCircle2, MessageSquare, Calendar, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSidebar from "@/components/auth/AuthSidebar";
import BenefitBox from "@/components/auth/BenefitBox";

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
        <AuthSidebar
          title="Empowering Health Through Innovation"
          badgeContent={
            <>
              <Star className="h-4 w-4 fill-white text-white" />
              <span className="text-white">Modern Care Network</span>
            </>
          }
          footer={undefined}
        >
          <div className="grid grid-cols-2 gap-4 mr-8">
            <BenefitBox 
              icon={<Calendar className="text-primary w-5 h-5" />} 
              title="Smart Booking" 
              desc="Instant access to doctors" 
            />
            <BenefitBox 
              icon={<Shield className="text-primary w-5 h-5" />} 
              title="Secure Vault" 
              desc="Encrypted health records" 
            />
            <BenefitBox 
              icon={<Activity className="text-primary w-5 h-5" />} 
              title="Live Care" 
              desc="Real-time monitoring" 
            />
            <BenefitBox 
              icon={<MessageSquare className="text-primary w-5 h-5" />} 
              title="24/7 Expert" 
              desc="Always-on assistance" 
            />
          </div>
        </AuthSidebar>
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
              "Sign In"
            )}
          </Button>
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
