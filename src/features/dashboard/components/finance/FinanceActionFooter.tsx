"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChartHorizontal } from "lucide-react";
import Link from "next/link";

export default function FinanceActionFooter() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
    >
      <Link 
        href="/insights"
        className="group relative overflow-hidden flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-indigo-500/30 transition-all text-sm font-bold text-white shadow-sm"
      >
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
        <BarChartHorizontal className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
        Analyze Granular Trajectories
      </Link>
      
      <Link 
        href="/ledger"
        className="group relative overflow-hidden flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/30 transition-all text-sm font-bold text-white shadow-sm"
      >
        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
        Investigate Base Ledger Logs
        <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
