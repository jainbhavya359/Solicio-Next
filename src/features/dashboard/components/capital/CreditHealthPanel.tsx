"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Activity, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

interface MetricProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  glowColor: string;
  delay: number;
}

const MetricCard = ({ label, value, icon, colorClass, glowColor, delay }: MetricProps) => {
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
      transition={{ delay, duration: 0.5 }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 flex flex-col group transition-transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className={clsx("w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300", colorClass)}>
              {icon}
            </div>
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
            {label}
          </h3>
          <p className={clsx("text-3xl font-extrabold tracking-tightest", colorClass)}>
            {value}
          </p>
      </div>
    </motion.div>
  );
};

export default function CreditHealthPanel({ score, tier, tierIndex }: { score: number, tier: string, tierIndex: number }) {
  const isUnrated = !score || score === 0;

  const riskLevels = ["Critical Risk", "High Risk", "Balanced", "Low Risk", "Minimal"];
  const probabilityLevels = ["12%", "34%", "68%", "89%", "98%"];
  const colors = ["text-rose-500", "text-amber-500", "text-blue-400", "text-emerald-400", "text-emerald-500"];
  
  const risk = riskLevels[tierIndex] || "Unknown";
  const prob = probabilityLevels[tierIndex] || "0%";
  const activeColor = isUnrated ? "text-slate-500" : colors[tierIndex];

  const metrics = [
    { label: "Neural Credit Score", value: isUnrated ? "---" : score, icon: <Target className="w-5 h-5" />, colorClass: activeColor, glowColor: "rgba(16,185,129,0.15)" },
    { label: "Tier Classification", value: isUnrated ? "---" : tier, icon: <TrendingUp className="w-5 h-5" />, colorClass: activeColor, glowColor: "rgba(59,130,246,0.15)" },
    { label: "Risk Exposure Level", value: isUnrated ? "---" : risk, icon: <Activity className="w-5 h-5" />, colorClass: activeColor, glowColor: "rgba(249,115,22,0.15)" },
    { label: "Approval Prob", value: isUnrated ? "---" : prob, icon: <CheckCircle2 className="w-5 h-5" />, colorClass: activeColor, glowColor: "rgba(16,185,129,0.15)" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-6xl mx-auto">
      {metrics.map((m, i) => (
        <MetricCard key={i} {...m} delay={i * 0.1} />
      ))}
    </div>
  );
}
