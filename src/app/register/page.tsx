"use client";

import Link from "next/link";
import { Loader2, ShieldCheck, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSidebar from "@/components/auth/AuthSidebar";
import BenefitBox from "@/components/auth/BenefitBox";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export default function RegisterPage() {
  const { form, isLoading, error, currentRole, onSubmit } = useRegisterForm();
  const { register, formState: { errors } } = form;

  return (
    <AuthLayout
      reverse
      sidebar={
        <AuthSidebar
          title="Join the future of digital healthcare."
          bgClassName="bg-slate-900"
          badgeContent={
            <>
              <ShieldCheck className="h-4 w-4 text-primary-light" />
              HIPAA Compliant Security
            </>
          }
          footer={undefined}
        >
          <p className="text-xl text-slate-300 leading-relaxed font-medium mb-4">
            Whether you're a provider or a patient, we offer the tools you need for a better care experience.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <BenefitBox icon={<Users className="text-primary-light" />} title="Patients" desc="Verified specialists in one click." />
            <BenefitBox icon={<Activity className="text-primary-light" />} title="Doctors" desc="Manage appointments seamlessly." />
          </div>
        </AuthSidebar>
      }
    >
      <div className="mb-10 text-center lg:text-left">
        <Link href="/" className="inline-flex items-center gap-2 group mb-8">
          <img 
            src="/doctoroncall-log.png" 
            alt="DoctorOnCall Logo" 
            className="h-16 w-auto object-contain"
          />
        </Link>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Create account</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-primary-hover underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-slate-700 font-bold">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register("firstName")}
              className={`h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl ${errors.firstName ? "border-red-500 ring-red-500" : ""}`}
            />
            {errors.firstName && <p className="text-[10px] font-bold text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-slate-700 font-bold">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register("lastName")}
              className={`h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl ${errors.lastName ? "border-red-500 ring-red-500" : ""}`}
            />
            {errors.lastName && <p className="text-[10px] font-bold text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-slate-700 font-bold">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className={`h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl ${errors.email ? "border-red-500 ring-red-500" : ""}`}
          />
          {errors.email && <p className="text-[10px] font-bold text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" title="password" className="text-slate-700 font-bold">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={`h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl ${errors.password ? "border-red-500 ring-red-500" : ""}`}
          />
          {errors.password && <p className="text-[10px] font-bold text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" title="confirmPassword" className="text-slate-700 font-bold">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={`h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-xl ${errors.confirmPassword ? "border-red-500 ring-red-500" : ""}`}
          />
          {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <div className="py-2">
          {/* Role selection hidden, handled by context */}
          <input type="hidden" {...register("role")} />
          {errors.role && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.role.message}</p>}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 border border-red-100 mb-4">
            <p className="text-[10px] font-bold text-red-600 text-center uppercase tracking-wider">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-8 text-[11px] text-slate-400 leading-relaxed text-center italic">
        By creating an account, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </AuthLayout>
  );
}
