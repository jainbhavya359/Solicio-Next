"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Activity, TrendingUp, ShieldCheck, Info } from "lucide-react";

interface SimulatorProps {
  paymentHistory: number; setPaymentHistory: (v: number) => void;
  ratio: number; setRatio: (v: number) => void;
  year: number; setYear: (v: number) => void;
  inquiries: number; setInquiries: (v: number) => void;
  calculateScore: () => void;
}

export default function SimulatorEngine({
  paymentHistory, setPaymentHistory,
  ratio, setRatio,
  year, setYear,
  inquiries, setInquiries,
  calculateScore
}: SimulatorProps) {
  
  const fields = [
    { label: "Operational Payment Success (%)", value: paymentHistory, setter: setPaymentHistory, max: 100, icon: <Zap className="w-5 h-5" />, tooltip: "Percentage of on-time payments. Higher is better." },
    { label: "Capital Utilization Ratio (%)", value: ratio, setter: setRatio, max: 100, icon: <Activity className="w-5 h-5" />, tooltip: "Amount of credit limits used. Keep under 30% for optimal score." },
    { label: "Financial Tenure Depth (Years)", value: year, setter: setYear, max: 30, icon: <TrendingUp className="w-5 h-5" />, tooltip: "Average age of your credit accounts." },
    { label: "Strategic Hard Inquiries", value: inquiries, setter: setInquiries, max: 20, icon: <ShieldCheck className="w-5 h-5" />, tooltip: "Recent applications for new credit. Lower is better." },
  ];

  return (
    <div className="text-left space-y-8 w-full min-w-0">
      <div className="w-full min-w-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6 backdrop-blur-md">
          <Activity className="w-4 h-4" /> Neural Simulator
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tightest mb-4">
          Capital <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Simulator Engine</span>
        </h2>
        <p className="text-slate-400 text-lg font-light leading-relaxed">
          Calibrate your credit variables to project future capital accessibility and interest rate outcomes dynamically.
        </p>
      </div>

      <div className="grid gap-6 w-full min-w-0">
        {fields.map((field, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.01 }}
            className="group w-full min-w-0 bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-6 w-full min-w-0">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors border border-white/5">
                  {field.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                     <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-200 transition-colors">
                       {field.label}
                     </label>
                     <div className="relative group/tooltip cursor-pointer">
                        <Info className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#111] border border-white/10 rounded-lg text-[10px] text-slate-300 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-20">
                           {field.tooltip}
                        </div>
                     </div>
                  </div>
                  <span className="text-2xl font-black text-white group-focus-within:text-emerald-400 transition-colors">
                    {field.value}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative w-full">
              <input
                type="range"
                value={field.value}
                onChange={(e) => {
                  field.setter(+e.target.value);
                  calculateScore(); // Real-time calculation on drag
                }}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer hover:bg-white/20 transition-all outline-none"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${(field.value / field.max) * 100}%, rgba(255,255,255,0.1) ${(field.value / field.max) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
                min={0}
                max={field.max}
              />
              {/* Custom thumb style via CSS typically, but inline styles cover the track */}
            </div>
            
            <div className="flex justify-between w-full mt-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <span>0</span>
              <span>{field.max}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
