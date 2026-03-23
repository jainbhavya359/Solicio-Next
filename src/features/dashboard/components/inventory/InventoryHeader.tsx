"use client";

import { motion } from "framer-motion";
import { Package, Plus, Expand } from "lucide-react";

interface Props {
  onNewPurchase: () => void;
  onNewSale: () => void;
  onOpenFullInventory: () => void;
}

export default function InventoryHeader({ onNewPurchase, onNewSale, onOpenFullInventory }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Intelligence</h2>
          <p className="text-sm text-slate-400 font-medium">Real-time stock health, risk signals, and movement insights</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={onNewPurchase}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Record Purchase
        </button>
        <button 
          onClick={onNewSale}
           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Record Sale
        </button>
        <button 
          onClick={onOpenFullInventory}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-bold shadow-[0_0_10px_rgba(52,211,153,0.1)] shadow-emerald-500/5"
        >
          Full Ledger <Expand className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
