"use client";
import { motion } from "framer-motion";
import { Sparkles, Zap, Layout } from "lucide-react";

export default function FloatingActionBar({ 
   onPurchase, onSale, onStock 
}: { 
   onPurchase: () => void, 
   onSale: () => void, 
   onStock: () => void 
}) {
  return (
    <div className="fixed bottom-8 z-50 flex justify-center w-full pointer-events-none px-4 left-0 right-0">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-full p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center gap-2 pointer-events-auto"
      >
        <button
          onClick={onPurchase}
          className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest transition-all drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Add Purchase</span>
          <span className="inline sm:hidden">Buy</span>
        </button>

        <button
          onClick={onSale}
          className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest transition-all drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
        >
          <Zap className="w-4 h-4" />
          <span className="hidden sm:inline">Record Sale</span>
          <span className="inline sm:hidden">Sell</span>
        </button>

        <div className="w-px h-8 bg-white/10 mx-2" />

        <button
          onClick={onStock}
          className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
        >
          <Layout className="w-4 h-4 text-slate-300" />
          <span className="hidden sm:inline text-slate-300">Inventory Map</span>
          <span className="inline sm:hidden text-slate-300">Map</span>
        </button>
      </motion.div>
    </div>
  )
}
