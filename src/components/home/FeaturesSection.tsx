"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Clock,
  Shield,
  Zap,
  Bell,
} from "lucide-react";
import clsx from "clsx";

const features = [
  {
    id: "real-time",
    icon: Package,
    title: "Real-Time Stock Tracking",
    desc: "Track every item with purchase & sale history. Know exactly what's in stock, what's moving, and what's sitting idle.",
    className: "lg:col-span-2",
    glowColor: "rgba(16,185,129,0.15)", // emerald
    visual: (
      <div className="mt-6 flex-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm relative group p-4">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">📦</div>
          <div>
            <div className="text-white text-sm font-medium">Premium Rice 25kg</div>
            <div className="text-slate-400 text-xs">SKU: RC-25-PR</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-emerald-400 text-sm font-medium">124 Units</div>
            <div className="text-slate-400 text-xs">In Stock</div>
          </div>
        </div>
        <div className="pt-3">
          <div className="flex gap-1 h-12 items-end">
             {[30,40,20,50,45,60,70,55,80].map((h, i) => (
                <div key={i} className="flex-1 bg-emerald-500/20 rounded-sm hover:bg-emerald-500/40 transition-colors" style={{ height: `${h}%` }} />
             ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: "profit-loss",
    icon: TrendingUp,
    title: "Instant Profit & Loss",
    desc: "See your profit, loss, and margins at a glance. No more waiting for month-end.",
    className: "lg:col-span-1",
    glowColor: "rgba(59,130,246,0.15)", // blue
    visual: (
      <div className="mt-6 flex flex-col justify-end bg-gradient-to-t from-blue-500/10 to-transparent border border-white/5 rounded-xl p-4 flex-1">
         <div className="text-white text-3xl font-bold mb-1">₹45,200</div>
         <div className="text-emerald-400 flex items-center gap-1 text-sm">
           <TrendingUp className="w-3 h-3" /> +12.5% this week
         </div>
      </div>
    )
  },
  {
    id: "smart-analytics",
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Understand trends, seasonal patterns, and customer behavior backed by data.",
    className: "lg:col-span-1",
    glowColor: "rgba(249,115,22,0.15)", // orange
  },
  {
    id: "insights",
    icon: Lightbulb,
    title: "Actionable Insights",
    desc: "Alerts about slow-moving stock, price opportunities, and cash flow issues.",
    className: "lg:col-span-1",
    glowColor: "rgba(16,185,129,0.15)", // emerald
  },
  {
    id: "automation",
    icon: Clock,
    title: "Time-Saving Automation",
    desc: "Automatic calculations, smart suggestions, and 1-click reports.",
    className: "lg:col-span-1",
    glowColor: "rgba(244,63,94,0.15)", // rose
  },
  {
    id: "security",
    icon: Shield,
    title: "Bank-Grade Security & Reliability",
    desc: "Your business data is encrypted, backed up, and safely stored in the cloud. Access it anytime, anywhere, on any device.",
    className: "lg:col-span-3 text-center items-center flex flex-col",
    glowColor: "rgba(99,102,241,0.15)", // indigo
  },
];

const BentoCard = ({ 
  feature, 
  index 
}: { 
  feature: typeof features[0], 
  index: number 
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={clsx(
        "relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 p-8 flex flex-col group",
        feature.className
      )}
    >
      {/* Dynamic Cursor Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${feature.glowColor}, transparent 40%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full w-full">
        {feature.id === "security" ? (
           <>
             <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <feature.icon className="w-8 h-8 text-indigo-400" />
             </div>
             <h3 className="text-2xl font-bold tracking-tight text-white mb-4">
               {feature.title}
             </h3>
             <p className="text-slate-400 max-w-xl text-center leading-relaxed">
               {feature.desc}
             </p>
           </>
        ) : (
           <>
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                 <feature.icon className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-semibold tracking-tight text-white">
                 {feature.title}
               </h3>
             </div>
             <p className="text-slate-400 leading-relaxed text-sm lg:text-base">
               {feature.desc}
             </p>
             {feature.visual}
           </>
        )}
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-28 bg-[#050505] relative overflow-hidden transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full point-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full point-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-medium mb-8 backdrop-blur-md">
            <Lightbulb className="w-4 h-4" />
            Powerful Features
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Everything You Need to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Grow Your Business</span>
          </h2>

          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Inspired by Tally &amp; Khatabook — without the complexity.
            Simple tools that give you clarity, not confusion.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm font-medium text-slate-400">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Zap className="w-4 h-4 text-emerald-400" />
              Setup in 5 minutes
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Bell className="w-4 h-4 text-emerald-400" />
              Smart notifications
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Bank-grade security
            </div>
          </div>
        </motion.div>

        {/* Cinematic Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, index) => (
            <BentoCard key={f.id} feature={f} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
