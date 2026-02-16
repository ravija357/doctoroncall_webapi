"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Shield, 
  Star, 
  Search, 
  Activity, 
  CheckCircle2,
  Stethoscope,
  Heart,
  Brain,
  Baby
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
        <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-blue-50/50 clip-path-hero hidden lg:block" />
        <div className="absolute top-20 right-20 -z-10 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl animate-pulse" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700 border border-blue-200 shadow-sm animate-bounce">
                <Star className="h-4 w-4 fill-blue-700" />
                Trusted by 50,000+ Patients
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
                Healthcare <span className="text-blue-600">Reimagined</span> for You.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Connect with world-class specialists in minutes. Book appointments, manage records, and get expert care—all from one secure platform.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/doctors">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-full shadow-xl shadow-blue-200 flex gap-2">
                    Book Appointment <Calendar className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 rounded-full hover:bg-slate-50">
                    Join as Provider
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 pt-4 opacity-70">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                    <span className="font-semibold text-slate-700">ISO Certified</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                    <span className="font-semibold text-slate-700">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                    <span className="font-semibold text-slate-700">Privacy First</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative hidden lg:block">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white">
                  {/* We don't have images tool working here, let's use a nice colored box or CSS art */}
                  <div className="aspect-square bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                    <Stethoscope className="text-white w-48 h-48 opacity-20 absolute rotate-12 -right-10 -bottom-10" />
                    <Heart className="text-white w-24 h-24 opacity-30 absolute top-20 left-10 animate-pulse" />
                    <div className="text-center p-12">
                        <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md mx-auto mb-6 flex items-center justify-center">
                            <Activity className="text-white w-12 h-12" />
                        </div>
                        <h3 className="text-white text-3xl font-bold mb-2">Smart Booking</h3>
                        <p className="text-white/80">AI-powered slot optimization for both patients and doctors.</p>
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float whitespace-nowrap z-20">
                    <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Success</p>
                        <p className="text-sm font-bold text-slate-900">Appointment Booked!</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem count="500+" label="Verified Doctors" />
            <StatItem count="100k+" label="Served Patients" />
            <StatItem count="98%" label="Positive Ratings" />
            <StatItem count="50+" label="Specialities" />
          </div>
        </div>
      </section>

      {/* Specialities Highlight */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-black text-slate-900">Explore by speciality</h2>
            <p className="text-slate-600">Find the right specialist for your specific health needs with our curated network.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard icon={<Heart className="text-red-500" />} title="Cardiology" count="45 Doctors" />
            <CategoryCard icon={<Brain className="text-purple-500" />} title="Neurology" count="32 Doctors" />
            <CategoryCard icon={<Baby className="text-blue-500" />} title="Pediatrics" count="58 Doctors" />
            <CategoryCard icon={<Stethoscope className="text-emerald-500" />} title="General Surgery" count="21 Doctors" />
          </div>

          <div className="text-center mt-12">
            <Link href="/doctors">
                <Button variant="link" className="text-blue-600 font-bold text-lg group">
                    View all specialities <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-20">
                <div className="flex-1 space-y-12">
                     <h2 className="text-4xl font-black text-slate-900">How it works?</h2>
                     
                     <div className="space-y-8">
                        <StepItem 
                            num="01" 
                            title="Find your doctor" 
                            desc="Search by name, speciality, or symptoms. Our smart filters help you find the perfect match."
                        />
                        <StepItem 
                            num="02" 
                            title="Schedule a visit" 
                            desc="Choose a convenient time slot. Get instant confirmation from your chosen provider."
                        />
                        <StepItem 
                            num="03" 
                            title="Experience care" 
                            desc="Visit the clinic or consult online. All your medical history is securely saved for future visits."
                        />
                     </div>
                </div>
                <div className="flex-1 bg-blue-600 rounded-[3rem] p-12 text-white relative">
                    <div className="absolute top-0 right-0 p-8">
                        <Activity className="opacity-20 w-32 h-32" />
                    </div>
                    <blockquote className="text-2xl font-medium leading-relaxed my-8 italic">
                        "The most seamless booking experience I've ever had. I found a great cardiologist and had my results in my profile within an hour. Highly recommended!"
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20" />
                        <div>
                            <p className="font-bold">Sarah Jenkins</p>
                            <p className="text-white/60 text-sm">Patient since 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 px-4">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black">Ready to get started?</h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Join thousands of patients who trust DoctorOnCall for their healthcare needs. Simple, secure, and always there for you.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 h-14 px-10 rounded-full font-bold text-lg">
                                Create Account
                            </Button>
                        </Link>
                        <Link href="/doctors">
                            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 h-14 px-10 rounded-full font-bold text-lg">
                                Browse Doctors
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ count, label }: { count: string, label: string }) {
    return (
        <div className="text-center group">
            <p className="text-4xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{count}</p>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function CategoryCard({ icon, title, count }: { icon: React.ReactNode, title: string, count: string }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col items-center text-center">
            <div className="p-4 bg-slate-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 font-medium">{count}</p>
        </div>
    );
}

function StepItem({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="text-4xl font-black text-blue-100 group-hover:text-blue-600 transition-colors">
                {num}
            </div>
            <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">{title}</h4>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}