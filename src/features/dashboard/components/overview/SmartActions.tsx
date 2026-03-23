"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

export default function SmartActions({ data }: { data?: any }) {
  if (!data || !data.consistency) return null;

  const actions: { message: string, type: "warning" | "success" | "action", cta: string }[] = [];

  if (data.consistency.volatilityRatio > 0.9)
    actions.push({ message: "Sales are highly volatile this period.", type: 'warning', cta: "Review Strategy" });

  if (data.inventoryImpact.inventoryToSalesDays > 60)
    actions.push({ message: "Reduce inventory to free up capital.", type: 'action', cta: "Adjust Orders" });

  if (data.profitability.grossMargin < 8)
    actions.push({ message: "Profit margins are critically slim.", type: 'warning', cta: "Analyze Costs" });

  if (data.inventoryImpact.stockValue > 500000)
    actions.push({ message: "Unusual chunk of capital tied in dead stock.", type: 'action', cta: "Discount Stock" });

  const isHealthy = actions.length === 0;

  if (isHealthy)
    actions.push({ message: "All metrics optimal. Business scaling beautifully.", type: 'success', cta: "View Projections" });

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="mt-6 p-6 sm:p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none ${isHealthy ? "bg-emerald-500" : "bg-indigo-500"}`} />

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <Sparkles className={`w-6 h-6 ${isHealthy ? "text-emerald-400" : "text-indigo-400"}`} />
        <h2 className="text-xl font-bold text-white tracking-tight">AI Recommendations</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {actions.map((action, i) => {
          const isSuccess = action.type === 'success';
          const isWarning = action.type === 'warning';
          
          let colorClass = "text-indigo-400";
          let bgClass = "bg-indigo-500/10 hover:bg-indigo-500/20";
          let borderClass = "border-indigo-500/20";
          let Icon = Sparkles;

          if (isSuccess) {
            colorClass = "text-emerald-400";
            bgClass = "bg-emerald-500/10 hover:bg-emerald-500/20";
            borderClass = "border-emerald-500/20";
            Icon = ShieldCheck;
          } else if (isWarning) {
            colorClass = "text-amber-400";
            bgClass = "bg-amber-500/10 hover:bg-amber-500/20";
            borderClass = "border-amber-500/20";
            Icon = AlertTriangle;
          }

          return (
             <div key={i} className={`p-5 rounded-2xl border ${bgClass} ${borderClass} transition-colors flex flex-col justify-between items-start group cursor-pointer`}>
               <div className="flex items-start gap-3 mb-4">
                 <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colorClass}`} />
                 <p className="font-semibold text-white/90 text-sm">{action.message}</p>
               </div>
               
               <button className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pl-8 ${colorClass}`}>
                 {action.cta}
                 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
               </button>
             </div>
          );
        })}
      </div>
    </motion.section>
  );
}
