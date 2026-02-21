"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Award,
  HeartPulse,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Hero3D from "./components/Hero3D";

/* ─────────────────────────────────────────────
   Shared variants
───────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease, delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease, delay },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─────────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────────── */
function useCounter(target: number, duration = 1.6, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return controls.stop;
  }, [start, target, duration]);
  return value;
}

/* ─────────────────────────────────────────────
   Magnetic card wrapper
───────────────────────────────────────────── */
function MagneticCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.08);
    y.set((e.clientY - cy) * 0.08);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Animated gradient orb
───────────────────────────────────────────── */
function AnimatedOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Stat Item with animated counter
───────────────────────────────────────────── */
function StatItem({ count, label }: { count: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Parse numeric part for counting
  const numMatch = count.match(/[\d.]+/);
  const numericVal = numMatch ? parseFloat(numMatch[0]) : 0;
  const suffix = count.replace(/[\d.]+/, "");
  const counted = useCounter(numericVal, 1.8, isInView);

  return (
    <motion.div
      ref={ref}
      className="space-y-2"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
    >
      <h3 className="text-4xl lg:text-5xl font-black text-primary">
        {isInView ? counted + suffix : "0" + suffix}
      </h3>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Category Card
───────────────────────────────────────────── */
function CategoryCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <MagneticCard>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={delay}
        variants={scaleIn}
        whileHover={{
          y: -12,
          boxShadow: "0 40px 80px -20px rgba(16,185,129,0.2)",
          transition: { type: "spring", stiffness: 300, damping: 18 },
        }}
        className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary/20 shadow-sm transition-colors duration-500 cursor-pointer relative overflow-hidden"
      >
        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 bg-primary/5 -translate-x-full"
          whileHover={{ translateX: "200%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <motion.div
          className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative z-10"
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-primary">{icon}</div>
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">
          {title}
        </h3>
        <p className="text-slate-500 font-medium relative z-10">{desc}</p>
        <motion.div
          className="flex items-center gap-1 mt-4 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 relative z-10"
          initial={{ x: -8 }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          Explore <ArrowRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </MagneticCard>
  );
}

/* ─────────────────────────────────────────────
   Process Step
───────────────────────────────────────────── */
function ProcessStep({
  num,
  title,
  desc,
  delay,
}: {
  num: string;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex gap-8 group"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={delay}
      variants={fadeUp}
    >
      <motion.div
        className="text-2xl font-bold text-slate-200 group-hover:text-primary transition-colors pt-1 font-mono"
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {num}
      </motion.div>
      <div className="space-y-2">
        <h4 className="text-2xl font-bold text-slate-900">{title}</h4>
        <p className="text-slate-500 text-lg leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Floating orbit badge
───────────────────────────────────────────── */
function OrbitBadge({
  text,
  radius,
  duration,
  offsetAngle = 0,
}: {
  text: string;
  radius: number;
  duration: number;
  offsetAngle?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: radius * 2, height: radius * 2, top: "50%", left: "50%", marginTop: -radius, marginLeft: -radius }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 text-xs font-bold text-primary shadow-lg"
        style={{
          top: 0,
          left: "50%",
          transform: `translateX(-50%) rotate(${offsetAngle}deg)`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {text}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"],
  });
  const statsY = useTransform(statsProgress, [0, 1], [80, -80]);
  const statsOpacity = useTransform(statsProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden font-sans selection:bg-primary/20">

      {/* ── Animated background orbs ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <AnimatedOrb className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-primary-light/20 rounded-full blur-[120px]" delay={0} />
        <AnimatedOrb className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px]" delay={2} />
        <AnimatedOrb className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] bg-emerald-200/20 rounded-full blur-[120px]" delay={4} />
      </div>

      {/* ══════════════════════════════
          HERO SECTION
      ══════════════════════════════ */}
      <section ref={heroRef} className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 container mx-auto px-6">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-20"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >

          {/* ── Left Content ── */}
          <motion.div
            className="flex-1 space-y-10 text-center lg:text-left z-10"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Pill badge */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-light/50 shadow-sm shadow-primary/10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-bold text-primary tracking-wide uppercase">
                Top Rated Medical Platform
              </span>
            </motion.div>

            {/* Headline — letter-by-letter reveal */}
            <motion.h1
              className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]"
              variants={fadeUp}
              custom={0.1}
            >
              Heal
              <motion.span
                className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              >
                th.
              </motion.span>
              <br />
              Simplifi
              <motion.span
                className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease }}
              >
                ed.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
            >
              We connect you with the world&apos;s most trusted specialists.
              Experience healthcare that feels less like a process and more like
              a privilege.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              custom={0.3}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5"
            >
              <Link href="/doctors">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-14 px-10 rounded-full bg-primary text-white shadow-xl shadow-primary/30 font-bold text-lg uppercase tracking-wide relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-primary-hover"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Find a Doctor</span>
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-14 px-10 rounded-full border border-primary-light text-primary hover:bg-primary/5 font-bold text-lg uppercase tracking-wide bg-white backdrop-blur-sm transition-colors"
                >
                  Join Network
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust logos */}
            <motion.div
              variants={fadeIn}
              custom={0.5}
              className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-50 hover:opacity-80 transition-opacity duration-500"
            >
              {["Forbes", "TechCrunch", "Healthline", "Wired"].map((brand, i) => (
                <motion.span
                  key={brand}
                  className="text-xl font-serif font-bold text-slate-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
                >
                  {brand}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right 3D Visual ── */}
          <motion.div
            className="flex-1 w-full max-w-xl lg:max-w-none relative z-0 flex items-center justify-center h-[500px] lg:h-[700px]"
            initial={{ opacity: 0, scale: 0.8, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
          >
            <div className="absolute inset-0 w-full h-full">
              <Hero3D />
            </div>

            {/* Central pulse icon */}
            <motion.div
              className="relative z-10 w-32 h-32 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center"
              animate={{
                y: [0, -12, 0],
                boxShadow: [
                  "0 20px 60px rgba(16,185,129,0.2)",
                  "0 30px 80px rgba(16,185,129,0.4)",
                  "0 20px 60px rgba(16,185,129,0.2)",
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeartPulse className="w-16 h-16 text-primary" />
              </motion.div>
            </motion.div>

            {/* Orbiting badges */}
            <OrbitBadge text="500+ Doctors" radius={130} duration={14} />
            <OrbitBadge text="4.9 ★" radius={170} duration={20} offsetAngle={180} />
            <OrbitBadge text="24/7 Support" radius={100} duration={10} offsetAngle={90} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════
          STATS SECTION with Parallax
      ══════════════════════════════ */}
      <section ref={statsRef} className="py-24 relative z-10">
        <motion.div
          style={{ y: statsY, opacity: statsOpacity }}
          className="container mx-auto px-6"
        >
          <motion.div
            className="bg-primary/10 border border-primary/20 rounded-[3rem] p-12 lg:p-20 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <StatItem count="500+" label="Verified Doctors" />
              <StatItem count="100k+" label="Happy Patients" />
              <StatItem count="4.9/5" label="Average Rating" />
              <StatItem count="24/7" label="Support" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════
          CATEGORIES SECTION
      ══════════════════════════════ */}
      <section className="py-24 container mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase mb-4"
          >
            Specialities
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={0.1}
            className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Curated Excellence.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="text-xl text-slate-500"
          >
            Access top-tier care across essential specialities. Only the best
            make the cut.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard icon={<Heart className="w-8 h-8" />} title="Cardiology" desc="Heart health experts" delay={0} />
          <CategoryCard icon={<Brain className="w-8 h-8" />} title="Neurology" desc="Brain & nervous system" delay={0.1} />
          <CategoryCard icon={<Baby className="w-8 h-8" />} title="Pediatrics" desc="Child healthcare" delay={0.2} />
          <CategoryCard icon={<Microscope className="w-8 h-8" />} title="Diagnostics" desc="Lab & pathology" delay={0.3} />
        </div>

        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <Link href="/doctors">
            <motion.button
              whileHover={{ gap: "12px" }}
              className="group flex items-center gap-2 text-lg font-bold text-primary"
            >
              View all specialities
              <motion.span
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                whileHover={{ scale: 1.2, backgroundColor: "var(--color-primary)", color: "#fff" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════
          PROCESS SECTION
      ══════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">

            <div className="flex-1 space-y-12">
              <motion.h2
                className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                Healthcare at the{" "}
                <span className="text-primary">
                  speed of life.
                </span>
              </motion.h2>

              <div className="space-y-8">
                <ProcessStep num="01" title="Search" desc="Filter by speciality, rating, or availability." delay={0} />
                <ProcessStep num="02" title="Book" desc="Secure your slot instantly. No phone calls." delay={0.1} />
                <ProcessStep num="03" title="Consult" desc="Visit in person or connect via HD video call." delay={0.2} />
              </div>
            </div>

            {/* Floating UI mockup */}
            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease }}
            >
              <motion.div
                className="relative z-10 bg-white rounded-[2.5rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 max-w-md mx-auto"
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Upcoming
                    </p>
                    <h4 className="text-xl font-bold text-slate-800">
                      General Checkup
                    </h4>
                  </div>
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Calendar className="w-6 h-6 text-slate-900" />
                  </motion.div>
                </div>

                {/* Doctor info */}
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <div>
                    <p className="font-bold text-slate-900">Dr. Emily Chen</p>
                    <p className="text-sm text-slate-500">Tomorrow, 10:00 AM</p>
                  </div>
                  <motion.div
                    className="ml-auto flex items-center gap-1 text-amber-500"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-bold">4.9</span>
                  </motion.div>
                </div>

                {/* CTA button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 transition-colors relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-primary-hover"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Start Video Call</span>
                </motion.button>

                {/* Status chips */}
                <motion.div
                  className="flex gap-2 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {["Confirmed", "Insured", "HD Video"].map((chip) => (
                    <span
                      key={chip}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {chip}
                    </span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Decorative radial glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-primary/20 to-transparent rounded-full blur-3xl -z-10" />

              {/* Floating accent cards */}
              <motion.div
                className="absolute -top-8 -right-8 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2 z-20"
                initial={{ opacity: 0, y: 20, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 6 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, ease }}
                animate={{
                  y: [0, -6, 0],
                  rotate: [6, 4, 6],
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">Verified</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-8 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-2 z-20"
                initial={{ opacity: 0, y: -20, rotate: 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6, ease }}
                animate={{
                  y: [0, 6, 0],
                  rotate: [-6, -4, -6],
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">Instant Booking</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER CTA
      ══════════════════════════════ */}
      <section className="py-32 container mx-auto px-6">
        <motion.div
          className="bg-primary/10 border border-primary/20 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-bold"
            >
              <Award className="w-4 h-4 text-primary" />
              Nepal&apos;s most trusted health platform
            </motion.div>

            <motion.h2
              className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease }}
            >
              Ready to upgrade your health?
            </motion.h2>

            <motion.p
              className="text-xl text-slate-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Join the network that puts you first. Premium care, standard price.
            </motion.p>

            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 px-12 rounded-full bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-primary-hover"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Get Started Now</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}