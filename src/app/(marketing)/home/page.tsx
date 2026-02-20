"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Hero3D from "@/components/ui/hero-3d";
import { 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Activity, 
  Heart,
  Brain,
  Baby,
  Stethoscope,
  Microscope,
  Award
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function HomePage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 overflow-hidden font-sans selection:bg-emerald-500/20">
      
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-emerald-400/5 rounded-full blur-[120px]" />
         <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-400/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 space-y-10 text-center lg:text-left z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm shadow-emerald-500/5">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
               <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">Top Rated Medical Platform</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Heal<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">th.</span><br />
              Simplifi<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">ed.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              We connect you with the world's most trusted specialists. Experience healthcare that feels less like a process and more like a privilege.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5">
              <Link href="/doctors">
                 <Button className="h-14 px-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 font-bold text-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-wide">
                    Find a Doctor
                 </Button>
              </Link>
              <Link href="/register">
                 <Button variant="outline" className="h-14 px-10 rounded-full border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 font-bold text-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-wide bg-white/50 backdrop-blur-sm">
                    Join Network
                 </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {['Forbes', 'TechCrunch', 'Healthline', 'Wired'].map((brand) => (
                   <span key={brand} className="text-xl font-serif font-bold text-slate-400">{brand}</span>
               ))}
            </motion.div>
          </motion.div>

          {/* 3D Visual */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative z-0">
             <Hero3D />
          </div>

        </div>
      </section>

      {/* Stats Section with Parallax */}
      <section ref={targetRef} className="py-24 relative z-10">
         <motion.div style={{ y, opacity }} className="container mx-auto px-6">
            <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white shadow-2xl relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-10">
                   <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
                   <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]" />
               </div>

               <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center divider-x divider-white/10">
                  <StatItem count="500+" label="Verified Doctors" />
                  <StatItem count="100k+" label="Happy Patients" />
                  <StatItem count="4.9/5" label="Average Rating" />
                  <StatItem count="24/7" label="Support" />
               </div>
            </div>
         </motion.div>
      </section>

      {/* Categories (Premium Cards) */}
      <section className="py-24 container mx-auto px-6">
         <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Curated Excellence.</h2>
             <p className="text-xl text-slate-500">Access top-tier care across essential specialities. Only the best make the cut.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard 
               icon={<Heart className="w-8 h-8 text-rose-500" />} 
               title="Cardiology" 
               desc="Heart health experts"
               delay={0}
            />
            <CategoryCard 
               icon={<Brain className="w-8 h-8 text-violet-500" />} 
               title="Neurology" 
               desc="Brain & nervous system"
               delay={0.1}
            />
             <CategoryCard 
               icon={<Baby className="w-8 h-8 text-sky-500" />} 
               title="Pediatrics" 
               desc="Child healthcare"
               delay={0.2}
            />
             <CategoryCard 
               icon={<Microscope className="w-8 h-8 text-emerald-500" />} 
               title="Diagnostics" 
               desc="Lab & pathology"
               delay={0.3}
            />
         </div>
         
         <div className="flex justify-center mt-16">
            <Link href="/doctors">
                <Button variant="link" className="group text-lg font-bold text-slate-900 hover:no-underline">
                   View all specialities 
                   <span className="ml-2 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all">
                      <ArrowRight className="w-4 h-4" />
                   </span>
                </Button>
            </Link>
         </div>
      </section>

      {/* Trust/Process with Glassmorphism */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
           <div className="container mx-auto px-6">
               <div className="flex flex-col lg:flex-row items-center gap-20">
                   <div className="flex-1 space-y-12">
                       <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                           Healthcare at the speed of life.
                       </h2>
                       
                       <div className="space-y-8">
                           <ProcessStep 
                              num="01" 
                              title="Search" 
                              desc="Filter by speciality, rating, or availability."
                           />
                           <ProcessStep 
                              num="02" 
                              title="Book" 
                              desc="Secure your slot instantly. No phone calls."
                           />
                           <ProcessStep 
                              num="03" 
                              title="Consult" 
                              desc="Visit in person or connect via HD video call."
                           />
                       </div>
                   </div>
                   
                   <div className="flex-1 relative">
                       {/* Floating UI Elements Mockup */}
                       <motion.div 
                          className="relative z-10 bg-white rounded-[2.5rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 max-w-md mx-auto"
                          whileHover={{ y: -10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                       >
                           <div className="flex items-center justify-between mb-8">
                               <div>
                                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming</p>
                                   <h4 className="text-xl font-bold text-slate-800">General Checkup</h4>
                               </div>
                               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                   <Calendar className="w-6 h-6 text-slate-900" />
                               </div>
                           </div>
                           
                           <div className="flex items-center gap-4 mb-8">
                               <div className="w-14 h-14 rounded-full bg-slate-100" />
                               <div>
                                   <p className="font-bold text-slate-900">Dr. Emily Chen</p>
                                   <p className="text-sm text-slate-500">Tomorrow, 10:00 AM</p>
                               </div>
                           </div>
                           
                           <Button className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200">
                               Start Video Call
                           </Button>
                       </motion.div>
                       
                       {/* Abstract shapes */}
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-emerald-100/50 rounded-full blur-3xl -z-10" />
                   </div>
               </div>
           </div>
      </section>

      {/* Premium Footer CTA */}
      <section className="py-32 container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden">
               <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                   <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight">Ready to upgrade your health?</h2>
                   <p className="text-xl text-slate-400">Join the network that puts you first. Premium care, standard price.</p>
                   <div className="flex justify-center gap-4">
                       <Link href="/register">
                          <Button className="h-16 px-12 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg shadow-2xl">
                              Get Started Now
                          </Button>
                       </Link>
                   </div>
               </div>
               
               {/* Background Glows */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[50%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-[50%] right-[20%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]" />
               </div>
          </div>
      </section>

    </div>
  );
}

function StatItem({ count, label }: { count: string, label: string }) {
    return (
        <div className="space-y-2">
            <h3 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">{count}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function CategoryCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer"
        >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-slate-900 transition-colors duration-500 flex items-center justify-center mb-6">
                <div className="transition-transform duration-500 group-hover:scale-110">
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 font-medium">{desc}</p>
        </motion.div>
    );
}

function ProcessStep({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex gap-8 group">
             <div className="text-2xl font-bold text-slate-200 group-hover:text-emerald-500 transition-colors pt-1 font-mono">
                 {num}
             </div>
             <div className="space-y-2">
                 <h4 className="text-2xl font-bold text-slate-900">{title}</h4>
                 <p className="text-slate-500 text-lg leading-relaxed">{desc}</p>
             </div>
        </div>
    );
}