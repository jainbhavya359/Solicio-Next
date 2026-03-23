"use client";

import { motion } from "framer-motion";

interface Props {
  data: any;
}

export default function ProfitDistributionVisual({ data }: Props) {
  if (!data) return null;

  // We map out the pure outflow components vs profit against total revenue
  const totalRev = Math.max(data.sales, 1); // Avoid 0 division
  
  const cogsPct = Math.min((Math.abs(data.cogs) / totalRev) * 100, 100);
  const expPct = Math.min((Math.abs(data.expenses) / totalRev) * 100, 100);
  const taxPct = Math.min((Math.abs(data.taxesPaid) / totalRev) * 100, 100);
  const writeDownPct = Math.min((Math.abs(data.inventoryWriteDowns) / totalRev) * 100, 100);
  const netPct = Math.min((Math.max(data.netProfit, 0) / totalRev) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 sm:p-8"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Revenue Allocation</h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
          Visual distribution of every inbound Rupee
        </p>
      </div>

      {/* Stacked Bar Visual */}
      <div className="w-full h-8 sm:h-12 bg-white/5 rounded-full overflow-hidden flex mb-8 border border-white/5 shadow-inner">
        {data.sales > 0 ? (
          <>
            {cogsPct > 0 && <motion.div initial={{width:0}} animate={{width:`${cogsPct}%`}} transition={{duration:1}} className="h-full bg-indigo-500/80 border-r border-indigo-900 shadow-[0_0_10px_rgba(99,102,241,0.5)]" title="COGS" />}
            {expPct > 0 && <motion.div initial={{width:0}} animate={{width:`${expPct}%`}} transition={{duration:1, delay:0.2}} className="h-full bg-amber-500/80 border-r border-amber-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]" title="Expenses" />}
            {(taxPct > 0 || writeDownPct > 0) && <motion.div initial={{width:0}} animate={{width:`${taxPct + writeDownPct}%`}} transition={{duration:1, delay:0.4}} className="h-full bg-rose-500/80 border-r border-rose-900 shadow-[0_0_10px_rgba(244,63,94,0.5)]" title="Taxes & Write-offs" />}
            {netPct > 0 && <motion.div initial={{width:0}} animate={{width:`${netPct}%`}} transition={{duration:1, delay:0.6}} className="h-full bg-emerald-500/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" title="Retained Profit" />}
          </>
        ) : (
          <div className="w-full h-full bg-white/5" />
        )}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Cost of Goods", pct: cogsPct, color: "bg-indigo-500", text: "text-indigo-400", val: Math.abs(data.cogs) },
          { label: "Opex", pct: expPct, color: "bg-amber-500", text: "text-amber-400", val: Math.abs(data.expenses) },
          { label: "Losses & Taxes", pct: taxPct + writeDownPct, color: "bg-rose-500", text: "text-rose-400", val: Math.abs(data.taxesPaid) + Math.abs(data.inventoryWriteDowns) },
          { label: "Retained Profit", pct: netPct, color: "bg-emerald-500", text: "text-emerald-400", val: Math.max(data.netProfit, 0) },
        ].map(item => (
          <div key={item.label} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5">
             <div className="flex items-center gap-2 mb-1">
               <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_5px_currentColor]`} />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{item.label}</span>
             </div>
             <p className={`text-lg font-bold ${item.text} leading-none`}>₹{item.val.toLocaleString('en-IN')}</p>
             <p className="text-[10px] font-medium text-slate-400">{item.pct.toFixed(1)}% footprint</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
