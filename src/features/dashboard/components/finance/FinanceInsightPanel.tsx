"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

interface Props {
  data: any;
}

export default function FinanceInsightPanel({ data }: Props) {
  if (!data) return null;

  // AI Logic generation (mocked intelligence layer based on real math)
  const margin = data.grossMarginPct;
  const isBleeding = data.netProfit < 0;
  
  const totalRev = Math.max(data.sales, 1);
  const expRatio = (data.expenses / totalRev) * 100;
  
  let primaryInsight = "";
  let secondaryInsight = "";

  if (isBleeding) {
    primaryInsight = `Capital deficit detected. Operational costs and COGS (₹${(data.cogs + data.expenses).toLocaleString('en-IN')}) are currently outpacing inbound sales revenue. Immediate cost reduction required.`;
  } else if (margin > 40) {
    primaryInsight = `Strong gross profitability maintained at ${margin}%. Your pricing architecture and procurement costs are highly optimized.`;
  } else {
    primaryInsight = `Gross margin is compressed at ${margin}%. Consider auditing supplier COGS or exploring minor price elasticity to breach the 40% optimal threshold.`;
  }

  if (data.inventoryWriteDowns > (data.sales * 0.05)) {
    secondaryInsight = `Critical alert: Inventory write-downs (₹${data.inventoryWriteDowns.toLocaleString()}) are consuming more than 5% of gross revenue, severely dragging net yield.`;
  } else if (expRatio > 35) {
    secondaryInsight = `Enterprise OpEx is currently operating at ${expRatio.toFixed(1)}% of total revenue. Ensure this burn rate is supporting direct growth initiatives.`;
  } else {
    secondaryInsight = "Operational expense ratio is well within healthy SaaS benchmarks (<35%). Capital allocation is efficient.";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative overflow-hidden mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-3xl" />
      
      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center">
        {/* Sparkle Node */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
           <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
           <div className="relative w-12 h-12 rounded-xl bg-[#0a0a0a] border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-6 h-6 text-indigo-400" />
           </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 space-y-4">
           <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-1">
                Automated Financial Synthesis
              </h3>
              <p className="text-sm text-indigo-100/70 font-medium leading-relaxed">
                {primaryInsight}
              </p>
           </div>
           
           <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0a0a]/50 border border-white/5">
              {isBleeding || data.inventoryWriteDowns > (data.sales * 0.05) || expRatio > 35 ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <p className="text-xs text-slate-400 font-semibold">
                {secondaryInsight}
              </p>
           </div>
        </div>

      </div>
    </motion.div>
  );
}
