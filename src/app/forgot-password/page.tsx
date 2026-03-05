"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, ShieldCheck, Key, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSidebar from "@/components/auth/AuthSidebar";
import BenefitBox from "@/components/auth/BenefitBox";
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
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      sidebar={
        <AuthSidebar
          title="Recover Your Digital Health Access"
          badgeContent={
            <>
              <ShieldCheck className="h-4 w-4 fill-white text-white" />
              <span className="text-white">Secure Identity Recovery</span>
            </>
          }
          footer={undefined}
        >
          <div className="grid grid-cols-2 gap-4 mr-8">
            <BenefitBox 
              icon={<Key className="text-primary w-5 h-5" />} 
              title="Secure Reset" 
              desc="Encrypted recovery process" 
            />
            <BenefitBox 
              icon={<Mail className="text-primary w-5 h-5" />} 
              title="Quick Link" 
              desc="Instant email delivery" 
            />
            <BenefitBox 
              icon={<LifeBuoy className="text-primary w-5 h-5" />} 
              title="24/7 Support" 
              desc="Expert help if needed" 
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
