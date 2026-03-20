"use client";
import { motion } from "framer-motion";
import { Sparkles, Activity, AlertTriangle, TrendingUp } from "lucide-react";

export default function InsightHero({ data, loading }: { data: any, loading: boolean }) {
  // calculate stats from snapshot
  const lowStockCount = data?.lowStock?.length || 0;
  const slowStockCount = data?.slowMoving?.length || 0;
  const riskSignals = lowStockCount + slowStockCount;
  
  return (
     <section className="relative w-full pt-32 pb-16 overflow-hidden flex flex-col items-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-repeat pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10 px-6 w-full">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.1)]">
             <Activity className="w-4 h-4" /> Neural Analysis Center
           </div>
           
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
             Your Business,<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Decoded in Real Time.</span>
           </h1>
           <p className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto font-light mb-16 leading-relaxed">
             Strategic real-time view of operation risks, inventory health, and neural cash exposure forecasting.
           </p>
           
           {/* Metric Cards Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1400px] mx-auto px-4 sm:px-8">
             
             {/* Card 1 */}
             <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-start shadow-[0_0_50px_rgba(16,185,129,0.02)] text-left relative overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cash Flow Pulse</div>
                <div className="text-3xl md:text-4xl font-black text-white flex items-end gap-3">
                   {loading ? <div className="h-10 w-24 bg-white/10 animate-pulse rounded" /> : <><span className="text-emerald-400">Stable</span></>}
                </div>
             </div>

             {/* Card 2 */}
             <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-start shadow-[0_0_50px_rgba(6,182,212,0.02)] text-left relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-6 text-cyan-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Inventory Health</div>
                <div className="text-3xl md:text-4xl font-black text-white flex items-baseline gap-2">
                   {loading ? <div className="h-10 w-32 bg-white/10 animate-pulse rounded" /> : (lowStockCount > 3 ? <span className="text-amber-400">Attention</span> : <span className="text-cyan-400">Optimal</span>)}
                </div>
             </div>

             {/* Card 3 */}
             <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-start shadow-[0_0_50px_rgba(244,63,94,0.02)] text-left relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-6 text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Risk Signals</div>
                <div className="text-3xl md:text-4xl font-black text-white">
                   {loading ? <div className="h-10 w-16 bg-white/10 animate-pulse rounded" /> : <span className={riskSignals > 0 ? "text-rose-400" : "text-white"}>{riskSignals}</span>}
                </div>
             </div>

           </div>
        </motion.div>
     </section>
  )
}
