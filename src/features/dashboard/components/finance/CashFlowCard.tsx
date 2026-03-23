"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ShieldCheck, AlertTriangle } from "lucide-react";

interface CashFlowData {
  purchases: number;
  sales: number;
  period: string;
}

interface Props {
  data?: CashFlowData;
}

export default function CashFlowCard({ data }: Props) {
  if (!data) return null;

  const isHealthy = data.sales >= data.purchases;
  const netCash = data.sales - data.purchases;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
    >
      <div className={`relative overflow-hidden w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a0a] border ${isHealthy ? "border-emerald-500/20" : "border-amber-500/20"} rounded-3xl p-6 sm:p-8 backdrop-blur-md`}
      >
         {/* Subtle Under-Glow map depending on healthy status */}
         <div className={`absolute -top-32 -right-32 w-64 h-64 blur-[100px] rounded-full mix-blend-screen pointer-events-none ${isHealthy ? "bg-emerald-500/20" : "bg-amber-500/20"}`} />

         {/* Left Status Group */}
         <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${isHealthy ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]" : "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]"}`}>
               {isHealthy ? <ShieldCheck className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>
            <div>
               <h3 className="text-sm font-bold text-white uppercase tracking-widest text-opacity-80 flex items-center gap-2">
                 Liquidity Line <span className="opacity-50">—</span> {data.period}
               </h3>
               <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${isHealthy ? "text-emerald-500" : "text-amber-500"}`}>
                 {isHealthy ? "Cash Flow Stable" : "Negative Cash Velocity Detected"}
               </p>
            </div>
         </div>

         {/* Right Metric Group */}
         <div className="flex flex-wrap md:flex-nowrap w-full md:w-auto items-center gap-4 sm:gap-6 bg-white/5 border border-white/5 rounded-2xl p-3 sm:p-4">
            
            {/* Inflow vs Outflow small markers */}
            <div className="flex flex-col gap-2 flex-1 md:flex-none">
               <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
                    <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none">Inflow</p>
                    <p className="text-sm font-bold text-white leading-tight">₹{data.sales.toLocaleString('en-IN')}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-rose-500/10 text-rose-400 shrink-0">
                    <ArrowDownRight className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none">Outflow</p>
                    <p className="text-sm font-bold text-white leading-tight">₹{data.purchases.toLocaleString('en-IN')}</p>
                  </div>
               </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-white/10" />

            {/* Main Net Net cash block */}
            <div className="flex-1 md:flex-none bg-[#050505] rounded-xl border border-white/5 p-3 sm:min-w-[140px]">
               <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isHealthy ? "text-emerald-400/60" : "text-amber-400/60"}`}>
                 Net Cash Trajectory
               </p>
               <p className={`text-xl font-black ${isHealthy ? "text-emerald-400" : "text-amber-400"} truncate`}>
                 {netCash >= 0 ? "+" : "-"}₹{Math.abs(netCash).toLocaleString('en-IN')}
               </p>
            </div>

         </div>
      </div>
    </motion.div>
  );
}
