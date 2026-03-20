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
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full mix-blend-screen pointer-events-none" />
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

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-bold tracking-tighter text-white mb-6 leading-[1.05]">
            Run Your Business.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Not Your Software.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#A1A1AA] font-light max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            The premier AI operating system for small businesses. Automate inventory, sync billing, and stop doing manual paperwork — all in one beautifully intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              href="/signup"
              className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
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
                <button
                  key={slide.id}
                  onClick={() => {
                    setActiveSlide(idx);
                    setProgress(0);
                  }}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105"
                    : "bg-white/5 text-[#A1A1AA] border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <slide.icon className={`w-4 h-4 ${isActive ? "text-emerald-500" : ""}`} />
                  {slide.title}

                  {/* Subtle Progress Bar for Active Pill */}
                  {isActive && !isHovered && (
                    <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 rounded-b-full transition-all ease-linear" style={{ width: `${progress}%` }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Mockup Container */}
          <div className="relative group rounded-2xl w-full aspect-[4/3] max-h-[75vh] bg-[#0A0A0A] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:shadow-[0_0_80px_rgba(16,185,129,0.15)] hover:border-white/20 mx-auto lg:ml-auto">

            {/* Mockup Toolbar (Mac style) */}
            <div className="h-10 border-b border-white/10 bg-[#111] flex items-center px-4 gap-2 relative z-20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-[#71717A] max-w-[250px] truncate">
                solicio.app/app/{SLIDES[activeSlide].id}
              </div>
            </div>

            {/* Slide Images */}
            <div className="relative w-full h-[calc(100%-40px)] bg-[#050505] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 0.98, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Fallback pattern if image is missing, otherwise Next/Image */}
                  <div className="w-full h-full relative p-2 bg-white flex items-center justify-center">
                    {/* Note: using native img for demo to ensure fast load, can swap to next/image */}
                    <img
                      src={SLIDES[activeSlide].image}
                      alt={SLIDES[activeSlide].title}
                      className="w-full h-full object-cover object-left-top rounded-lg border border-slate-200 shadow-inner"
                    />

                    {/* Floating UI Elements (Micro-interactions) */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute bottom-6 right-6 bg-white border border-slate-200 shadow-xl rounded-xl p-4 flex items-start gap-4 w-72"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-slate-900">{SLIDES[activeSlide].caption}</div>
                        <div className="text-xs text-slate-500 mt-1">{SLIDES[activeSlide].description}</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Glow overlay inside the mockup frame */}
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none z-10" />
          </div>

        </motion.div>

      </div>
    </section>
  );
}
