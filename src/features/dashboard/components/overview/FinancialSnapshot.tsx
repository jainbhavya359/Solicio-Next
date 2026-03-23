"use client";

import { motion } from "framer-motion";
import { useCreditStore } from "@/src/store/useCreditStore";
import { Wallet, ShieldCheck, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

interface CashFlowData {
  sales: number;
  purchases: number;
  period: string;
}

export default function FinancialSnapshot({ cashFlow }: { cashFlow?: CashFlowData }) {
  const { score } = useCreditStore();

  if (!cashFlow) return null;

  const netCash = cashFlow.sales - cashFlow.purchases;
  const isHealthy = netCash >= 0;

  // Credit Score coloring
  const creditColor = score >= 700 ? "text-emerald-400" : score >= 600 ? "text-amber-400" : "text-rose-400";
  const creditBg = score >= 700 ? "bg-emerald-500/20" : score >= 600 ? "bg-amber-500/20" : "bg-rose-500/20";
  const creditLabel = score >= 700 ? "Excellent" : score >= 600 ? "Fair" : "Poor";

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
    >
      {/* CASH FLOW PANEL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden">
        <div className={`absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-[60px] opacity-20 ${isHealthy ? "bg-emerald-500" : "bg-rose-500"} pointer-events-none`} />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-blue-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Net Cash Flow</h3>
              <p className="text-sm text-slate-400">{cashFlow.period} period</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-end gap-3 mb-6">
            <span className={`text-4xl font-extrabold tracking-tighter ${isHealthy ? "text-emerald-400" : "text-rose-400"}`}>
              {netCash >= 0 ? "+" : "-"}₹{Math.abs(netCash).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> Inflow
              </p>
              <p className="text-sm font-bold text-emerald-400 truncate">₹{cashFlow.sales.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-rose-400" /> Outflow
              </p>
              <p className="text-sm font-bold text-rose-400 truncate">₹{cashFlow.purchases.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CREDIT SCORE PANEL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group/card -translate-y-0 hover:-translate-y-1 hover:shadow-2xl">
         {/* Dynamic Glow Background */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[100px] opacity-10 ${score >= 700 ? "bg-emerald-500" : score >= 600 ? "bg-amber-500" : "bg-rose-500"} pointer-events-none transition-all duration-700 group-hover/card:scale-110 group-hover/card:opacity-15`} />

         <div className="flex justify-between items-start mb-8 relative z-10 w-full">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 ${creditColor}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Credit Rating</h3>
              <p className="text-sm text-slate-400">Solicio Trust Score</p>
            </div>
          </div>
          <a href="/dashboard" className="text-xs font-semibold text-white/40 hover:text-white transition-colors flex items-center gap-1 group">
            Details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full gap-2 mt-4">
          {/* Gauge and Score Area */}
          <div className="w-full max-w-[240px] aspect-[2/1] relative flex items-end justify-center mb-6">
            <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(52,211,153,0.15)]" viewBox="0 0 160 90">
              <defs>
                 <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={score >= 700 ? "#fbbf24" : score >= 600 ? "#fb7185" : "#e11d48"} />
                    <stop offset="50%" stopColor={score >= 700 ? "#34d399" : score >= 600 ? "#fbbf24" : "#fb7185"} />
                    <stop offset="100%" stopColor={score >= 700 ? "#10b981" : score >= 600 ? "#f59e0b" : "#e11d48"} />
                 </linearGradient>
              </defs>
              {/* Background Track */}
              <path d="M 20 80 a 60 60 0 0 0 120 0" stroke="#1f2937" strokeWidth="12" strokeLinecap="round" fill="none" />
              {/* Foreground Track (Animated) */}
              <motion.path 
                initial={{ strokeDashoffset: Math.PI * 60 }}
                animate={{ strokeDashoffset: Math.PI * 60 * (1 - Math.min((score - 300) / 600, 1)) }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                d="M 20 80 a 60 60 0 0 0 120 0" 
                stroke="url(#scoreGradient)" 
                strokeWidth="12" 
                strokeLinecap="round" 
                fill="none" 
                strokeDasharray={Math.PI * 60}
              />
            </svg>
            <div className="absolute bottom-[-10px] flex flex-col items-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-[56px] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 drop-shadow-md"
              >
                {score}
              </motion.span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center mt-2 relative z-20">
             <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black ${score >= 700 ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]" : score >= 600 ? "bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/30" : "bg-rose-500/15 text-rose-400 ring-1 ring-inset ring-rose-500/30"} mb-3 uppercase tracking-widest`}>
                {creditLabel}
             </span>
             <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-[280px]">
               {score >= 700 ? "Top-tier standing. You've unlocked our lowest rates and instant capital access." : "Improve operational cash flow to unlock better rates and higher limits."}
             </p>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
