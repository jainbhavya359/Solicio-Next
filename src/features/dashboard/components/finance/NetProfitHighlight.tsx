"use client";

import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

interface Props {
  data: any;
}

export default function NetProfitHighlight({ data }: Props) {
  if (!data) return null;

  const isProfitable = data.netProfit >= 0;
  const gradient = isProfitable ? "from-emerald-500 to-emerald-700" : "from-rose-500 to-rose-700";
  const glow = isProfitable ? "shadow-[0_0_40px_rgba(52,211,153,0.2)]" : "shadow-[0_0_40px_rgba(244,63,94,0.2)]";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative overflow-hidden w-full rounded-[2.5rem] p-8 sm:p-12 mb-6 ${glow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
      <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-2xl border ${isProfitable ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-rose-500/20 border-rose-500/40 text-rose-400"}`}>
          <DollarSign className="w-8 h-8" />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Absolute Net Yield</h3>
        <p className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter ${isProfitable ? "text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]" : "text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]"}`}>
          ₹{Math.abs(data.netProfit).toLocaleString('en-IN')}
        </p>
        <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
           {isProfitable ? "Final Retained Earnings post taxes and depreciation" : "Capital Deficit post operations and deductions"}
        </div>
      </div>
    </motion.div>
  );
}
