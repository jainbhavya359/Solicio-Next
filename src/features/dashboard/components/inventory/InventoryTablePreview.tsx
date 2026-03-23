"use client";

import { motion } from "framer-motion";
import { PackageOpen, Clock } from "lucide-react";

interface Props {
  data?: {
    breakdown?: any[];
  };
}

export default function InventoryTablePreview({ data }: Props) {
  const stockItems = data?.breakdown || [];
  
  // Condense to top 5 items by value for the preview
  const topItems = [...stockItems]
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 5);

  if (topItems.length === 0) {
    return (
      <div className="bg-[#0a0a0a] rounded-3xl p-10 border border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <PackageOpen className="w-10 h-10 text-slate-600 mb-3" />
        <p className="text-sm font-semibold text-slate-400">No strict inventory ledger detected.</p>
      </div>
    );
  }

  const statusMap: Record<string, string> = {
    fast: "Fast Moving",
    warning: "Low Stock",
    slow: "Slow Moving",
    dead: "Dead Stock",
    "never-sold": "Never Sold",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden relative flex flex-col h-full min-h-[300px]"
    >
      <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between">
         <h3 className="text-lg font-bold text-white tracking-tight">Stock Ledger Matrix</h3>
         <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/5">
           By Highest Locked Value
         </span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Product</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Stock Value</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Recency</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">Health Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {topItems.map((item: any, i: number) => {
                const isWarning = item.category === "warning" || item.category === "dead" || item.category === "slow";
                const isNeutral = item.category === "never-sold";
                const isFast = item.category === "fast";

                const statusColor = isWarning ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
                                  : isFast ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : "text-slate-400 bg-white/5 border-white/10";
                                  
                const statusText = statusMap[item.category] || item.category;

                return (
                  <motion.tr 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (i * 0.05) }}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <PackageOpen className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white whitespace-nowrap capitalize">{item.product}</p>
                            <p className="text-[10px] font-medium text-slate-500">{item.quantity} {item.unit} in vault</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <p className="text-sm font-bold text-emerald-400 whitespace-nowrap">₹{item.stockValue.toLocaleString('en-IN')}</p>
                       <p className="text-[10px] font-medium text-slate-500">₹{item.price} per {item.unit}</p>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 whitespace-nowrap">
                          {item.daysSinceLastSale === null ? (
                             "Never Sold"
                          ) : (
                             <>
                               <Clock className="w-3.5 h-3.5" /> 
                               {item.daysSinceLastSale === 0 ? "Liquid (0 days)" : `${item.daysSinceLastSale} days since sale`}
                             </>
                          )}
                       </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColor} whitespace-nowrap`}>
                          {statusText}
                       </span>
                    </td>
                  </motion.tr>
                );
             })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
