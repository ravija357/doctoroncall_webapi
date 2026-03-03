"use client";

import { useState } from "react";

import Link from "next/link";
import { Loader2, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSidebar from "@/components/auth/AuthSidebar";
import FeatureItem from "@/components/auth/FeatureItem";

import { useLoginForm } from "@/hooks/useLoginForm";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { form, isLoading: isFormLoading, error, currentRole, onSubmit } = useLoginForm();
  const { register, formState: { errors } } = form;
  const { googleLogin } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    
    setIsGoogleLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      toast.success("Logged in with Google!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Google Login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isLoading = isFormLoading || isGoogleLoading;

  return (
    <AuthLayout
      sidebar={
        <AuthSidebar
          title="The simplest way to manage your health journey."
          badgeContent={
            <>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              Modern Healthcare Interface
            </>
          }
          footer={undefined}
        >
          <FeatureItem icon={<CheckCircle2 className="text-white" />} text="Instant Booking with 500+ Specialists" />
          <FeatureItem icon={<CheckCircle2 className="text-white" />} text="Secure Electronic Medical Records" />
          <FeatureItem icon={<CheckCircle2 className="text-white" />} text="24/7 Access to Care Dashboard" />
        </AuthSidebar>
      }
    >
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center gap-2 group mb-8">
          <img 
            src="/doctoroncall-log.png" 
            alt="DoctorOnCall Logo" 
            className="h-16 w-auto object-contain"
          />
        </Link>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:text-primary-hover underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-10">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-slate-700 font-bold">Email address</Label>
            <div className="mt-1">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={`h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl ${errors.email ? "border-red-500 ring-red-500" : ""}`}
              />
            </div>
            {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" title="password" className="text-slate-700 font-bold">Password</Label>
              <div className="text-sm">
                <Link href="#" className="font-bold text-primary hover:text-primary-hover">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-1">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl ${errors.password ? "border-red-500 ring-red-500" : ""}`}
              />
            </div>
            {errors.password && <p className="text-xs font-bold text-red-500 mt-1">{errors.password.message}</p>}
          </div>



          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
              <p className="text-sm font-bold text-red-600 text-center">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
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
            <div className="relative flex justify-center text-sm font-bold">
              <span className="bg-white px-4 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login failed")}
                theme="outline"
                size="large"
                shape="pill"
                width="100%"
                text="continue_with"
              />
            </div>
            <Button variant="outline" className="h-12 border-slate-200 hover:bg-slate-50 font-bold rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.644-.026 2.658-1.477 3.662-2.95 1.159-1.697 1.64-3.339 1.665-3.417-.036-.013-3.223-1.241-3.257-4.893-.034-3.047 2.486-4.507 2.599-4.577-1.428-2.088-3.6-2.324-4.384-2.375-2.127-.154-3.53.948-4.405.948zm2.344-2.738c.959-1.162 1.612-2.785 1.431-4.158-1.179.049-2.61.782-3.456 1.769-.76.877-1.426 2.534-1.247 3.88 1.309.102 2.641-.665 3.272-1.491z" />
              </svg>
              Apple
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
