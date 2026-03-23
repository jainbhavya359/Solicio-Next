"use client";

import { motion } from "framer-motion";
import { BrainCircuit, AlertTriangle, Zap, Target } from "lucide-react";

interface Props {
  alerts: any[];
}

export default function AlertsHero({ alerts = [] }: Props) {
  const criticalCount = alerts.filter(a => a.type === 'danger').length;
  const actionCount = alerts.length;
  
  // Calculate abstract financial impact by scanning `meta` fields from API responses
  const totalImpact = alerts.reduce((sum, a) => {
      if (a.meta && a.meta.totalPending) {
         return sum + a.meta.totalPending;
      }
      return sum;
  }, 0);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 p-8 lg:p-12 z-20">
      
      {/* Cinematic AI Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Title Block */}
        <div className="max-w-xl">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI Decision Engine Active
           </div>
           
           <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
             Prioritize your business <br className="hidden lg:block"/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">in real-time.</span>
           </h1>
           <p className="mt-4 text-base font-medium text-slate-400 leading-relaxed max-w-lg">
             Neural parsing of active operational signals. Prioritizing exactly what requires your immediate strategic execution today.
           </p>
        </div>

        {/* Real-time Impact Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 shrink-0">
           
           <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
             className="bg-white/5 border border-white/10 rounded-2xl p-5"
           >
              <AlertTriangle className="w-5 h-5 text-rose-500 mb-3" />
              <p className="text-3xl font-black text-white">{criticalCount}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Critical Issues</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
             className="bg-white/5 border border-white/10 rounded-2xl p-5"
           >
              <Zap className="w-5 h-5 text-amber-500 mb-3" />
              <p className="text-3xl font-black text-white">{actionCount}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Actions Required</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
             className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 col-span-2 sm:col-span-1 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
           >
              <Target className="w-5 h-5 text-emerald-500 mb-3" />
              <p className="text-3xl font-black text-emerald-400">
                {totalImpact >= 100000 
                   ? `₹${(totalImpact / 100000).toFixed(1)}L` 
                   : totalImpact > 0 
                      ? `₹${totalImpact.toLocaleString('en-IN')}` 
                      : '-'
                }
              </p>
              <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mt-1">Impact at Risk</p>
           </motion.div>

        </div>

      </div>
    </div>
  );
}
