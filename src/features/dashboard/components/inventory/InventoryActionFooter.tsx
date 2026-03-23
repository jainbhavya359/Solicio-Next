"use client";

import { motion } from "framer-motion";
import { ArrowRight, Maximize2 } from "lucide-react";

interface Props {
  onOpenFullInventory: () => void;
}

export default function InventoryActionFooter({ onOpenFullInventory }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
    >
      <button 
        onClick={onOpenFullInventory}
        className="group relative overflow-hidden flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/30 transition-all text-sm font-bold text-white shadow-sm"
      >
        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
        <Maximize2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        Expand Full Master Ledger View
      </button>
      
      <button 
        onClick={onOpenFullInventory}
        className="group relative overflow-hidden flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-amber-500/30 transition-all text-sm font-bold text-white shadow-sm"
      >
        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors" />
        Assess and Resolve Stock Incidents
        <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
