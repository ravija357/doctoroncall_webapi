"use client";

import Link from "next/link";
import { Loader2, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSidebar from "@/components/auth/AuthSidebar";
import FeatureItem from "@/components/auth/FeatureItem";

import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginPage() {
  const { form, isLoading, error, currentRole, onSubmit } = useLoginForm();
  const { register, formState: { errors } } = form;

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
          <FeatureItem icon={<CheckCircle2 className="text-blue-300" />} text="Instant Booking with 500+ Specialists" />
          <FeatureItem icon={<CheckCircle2 className="text-blue-300" />} text="Secure Electronic Medical Records" />
          <FeatureItem icon={<CheckCircle2 className="text-blue-300" />} text="24/7 Access to Care Dashboard" />
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
          <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline">
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
                <Link href="#" className="font-bold text-blue-600 hover:text-blue-500">
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

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5" disabled={isLoading}>
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
            <Button variant="outline" className="h-12 border-slate-200 hover:bg-slate-50 font-bold rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  className="fill-[#4285F4]"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  className="fill-[#34A853]"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  className="fill-[#FBBC05]"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  className="fill-[#EA4335]"
                />
              </svg>
              Google
            </Button>
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
