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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden flex flex-col justify-between">
         <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-20 bg-blue-500 pointer-events-none`} />

         <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${creditBg} ${creditColor}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Credit Rating</h3>
              <p className="text-sm text-slate-400">Solicio Trust Score</p>
            </div>
          </div>
          <a href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
            Details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative flex items-center justify-center">
            {/* simple arc for credit score */}
            <svg className="w-full h-full -rotate-180 transform" viewBox="0 0 160 160">
              <path d="M 20 80 a 60 60 0 0 1 120 0" stroke="#1f2937" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path 
                d="M 20 80 a 60 60 0 0 1 120 0" 
                stroke={score >= 700 ? "#34d399" : score >= 600 ? "#fbbf24" : "#fb7185"} 
                strokeWidth="12" 
                strokeLinecap="round" 
                fill="none" 
                strokeDasharray={Math.PI * 60}
                strokeDashoffset={Math.PI * 60 * (1 - Math.min((score - 300) / 600, 1))}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
              <span className={`text-3xl font-extrabold tracking-tighter ${creditColor}`}>{score}</span>
            </div>
          </div>

          <div>
             <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${creditBg} ${creditColor} border-white/10 mb-2 uppercase tracking-wide`}>
                {creditLabel}
             </span>
             <p className="text-sm text-slate-400 leading-relaxed font-medium">
               {score >= 700 ? "You qualify for premium rates and zero-friction capital access." : "Improve operations to unlock better rates."}
             </p>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
