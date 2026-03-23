"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles, LayoutDashboard, Users, Receipt, FileText, Package, Bell } from "lucide-react";

const SLIDES = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    image: "/hero/slide-1.png",
    caption: "Real-time Analytics",
    description: "Monitor stock and cash flow instantly.",
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: Package,
    image: "/hero/slide-2.png",
    caption: "Smart Management",
    description: "Track staff and hours efficiently.",
  },
  {
    id: "paperwork",
    title: "Paperwork",
    icon: FileText,
    image: "/hero/slide-3.png",
    caption: "Document Sync",
    description: "Never lose a receipt again.",
  },
  {
    id: "alerts",
    title: "Alerts",
    icon: Bell,
    image: "/hero/slide-4.png",
    caption: "Automated Alerts",
    description: "Get notified about low stock and other important updates.",
  },
];

const AUTOPLAY_DELAY = 4000;

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play logic
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
      setProgress(0); // reset progress bar on slide change
    }, AUTOPLAY_DELAY);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return p + (100 / (AUTOPLAY_DELAY / 50));
      });
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isHovered, activeSlide]);

  return (
    <section className="relative min-h-[90vh] bg-[#050505] flex items-center justify-center pt-32 pb-20 overflow-hidden font-sans">

      {/* AMBIENT BACKGROUND EFFECTS */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full mix-blend-screen pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-repeat pointer-events-none" />

      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-6 md:px-12 2xl:px-24 mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12">

        {/* LEFT: TEXT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-[45rem] text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-4 h-4" />
            AI-Powered Productivity
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-bold tracking-tighter text-white mb-6 leading-[1.05] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Run Your Business.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Not Your Software.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#A1A1AA] font-light max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            The premier AI operating system for small businesses. Automate inventory, sync billing, and stop doing manual paperwork — all in one beautifully intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              href="/signup"
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] w-full sm:w-auto active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shine_1s_ease-in-out] pointer-events-none" />
              <span className="relative z-10">Get Started Free <ArrowRight className="inline w-5 h-5 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" /></span>
            </Link>

            <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 hover:border-white/20 transition-all w-full sm:w-auto">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3 h-3 text-emerald-400 fill-emerald-400 ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-sm font-medium text-[#71717A]">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" /> No credit card required</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>

        {/* RIGHT: AUTO-SLIDER SHOWCASE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-none lg:max-w-auto min-w-[50%] relative perspective-[2000px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Slider Navigation Pills */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-start gap-2 mb-6">
            {SLIDES.map((slide, idx) => {
              const isActive = activeSlide === idx;
              return (
                <motion.button
                  key={slide.id}
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveSlide(idx);
                    setProgress(0);
                  }}
                  className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 overflow-hidden ${isActive
                    ? "bg-white text-slate-900 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.3),0_5px_10px_-5px_rgba(0,0,0,0.5)]"
                    : "bg-[#111]/60 backdrop-blur-md border border-white/5 text-zinc-400 hover:text-white hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    }`}
                >
                  <slide.icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-emerald-500" : "text-zinc-500 group-hover:text-emerald-400"}`} />
                  <span className="relative z-10">{slide.title}</span>

                  {/* Subtle Progress Bar for Active Pill */}
                  {isActive && !isHovered && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/5 overflow-hidden">
                      <motion.span 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                        className="absolute inset-y-0 left-0 bg-emerald-500 shadow-[0_0_10px_#10B981]" 
                      />
                    </span>
                  )}
                  
                  {/* Subtle Glow behind icon in active state */}
                  {isActive && (
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 w-6 h-6 bg-emerald-500/20 blur-md rounded-full pointer-events-none" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Interactive Mockup Container */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative group rounded-2xl w-full aspect-[4/3] max-h-[75vh] bg-[#0A0A0A] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:shadow-[0_0_80px_rgba(16,185,129,0.15)] hover:border-white/20 mx-auto lg:ml-auto"
          >

            {/* Mockup Toolbar (Mac style) */}
            <div className="h-10 border-b border-white/10 bg-[#111]/90 backdrop-blur-md flex items-center px-4 gap-2 relative z-20">
              <div className="flex gap-1.5 grayscale opacity-50">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-[#71717A] max-w-[250px] truncate">
                <div className="w-2.5 h-2.5 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                solicio.app/app/{SLIDES[activeSlide].id}
              </div>
            </div>

            {/* Slide Images */}
            <div className="relative w-full h-[calc(100%-40px)] bg-[#050505] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Fallback pattern if image is missing, otherwise Next/Image */}
                  <div className="w-full h-full relative p-2 bg-[#0D0D0D] flex items-center justify-center">
                    {/* Note: using native img for demo to ensure fast load, can swap to next/image */}
                    <img
                      src={SLIDES[activeSlide].image}
                      alt={SLIDES[activeSlide].title}
                      className="w-full h-full object-cover object-left-top rounded-lg border border-white/10"
                    />

                    {/* Floating UI Elements (Micro-interactions) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute bottom-6 right-6 bg-[#111]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] rounded-xl p-4 flex items-start gap-4 w-72"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-white">{SLIDES[activeSlide].caption}</div>
                        <div className="text-xs text-[#A1A1AA] mt-1">{SLIDES[activeSlide].description}</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Glow overlay inside the mockup frame */}
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none z-10" />
          </motion.div>

        </motion.div>

      </div>

      <style jsx global>{`
        @keyframes shine {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
