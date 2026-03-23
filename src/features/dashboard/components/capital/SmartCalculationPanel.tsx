"use client";
import React from "react";
import { ChevronRight, PieChart, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface SmartCalculationProps {
  emi: number;
  totalInterest: number;
  totalPayable: number;
  submitLoan: () => void;
  loading?: boolean;
}

export default function SmartCalculationPanel({
  emi, totalInterest, totalPayable, submitLoan, loading
}: SmartCalculationProps) {

  const isValid = emi > 0;
  // Calculate ratios for mini-charts
  const principalAmount = totalPayable > 0 ? totalPayable - totalInterest : 0;
  const interestRatio = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;
  const principalRatio = totalPayable > 0 ? (principalAmount / totalPayable) * 100 : 0;

  return (
    <div className="w-full flex md:flex-col flex-col gap-6 h-full">
      
      <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 relative overflow-hidden group w-full flex-grow flex flex-col justify-center">
        {/* Neon Gradient Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-8">
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-0.5">Impact Analysis</p>
              <h3 className="text-xl font-extrabold tracking-tight text-white">Capital Impact</h3>
            </div>
          </div>

          {isValid ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full text-left flex flex-col">
              
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Estimated Monthly EMI</p>
              <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-md tracking-tightest">
                ₹{emi.toLocaleString()}
              </p>
              
              <div className="w-full h-px bg-white/10 my-8 shadow-[0_2px_10px_rgba(16,185,129,0.2)]" />

               {/* Metrics with Mini Charts */}
              <div className="w-full flex flex-col gap-5">
                <div>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Total Obligation</span>
                      <span className="text-lg font-bold text-white">₹{totalPayable.toLocaleString()}</span>
                   </div>
                   <div className="w-full h-2 rounded-full border border-white/5 bg-[#111] overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${principalRatio}%` }} />
                      <div className="h-full bg-amber-500/80" style={{ width: `${interestRatio}%` }} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Principal</span>
                    <span className="block text-base font-bold text-emerald-400 mt-2">₹{principalAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Interest Yield</span>
                    <span className="block text-base font-bold text-amber-500 mt-2">₹{totalInterest.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
              <PieChart className="w-10 h-10 text-slate-600 mb-4 opacity-50" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Awaiting Capital Values...</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={submitLoan}
        disabled={loading || !isValid}
        className="w-full py-5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] disabled:shadow-none transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {loading ? (
          <span className="animate-pulse">Synchronizing...</span>
        ) : (
          <>Lock &amp; Deploy Strategy <ChevronRight className="w-4 h-4" /></>
        )}
      </button>

    </div>
  );
}
