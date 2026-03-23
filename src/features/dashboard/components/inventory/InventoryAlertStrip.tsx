"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, ChevronDown, PackageMinus, PackageX } from "lucide-react";

interface Props {
  lowStock?: any[];
  slowMoving?: any[];
  slowMovingCount?: number;
  slowStockValue?: number;
}

export default function InventoryAlertStrip({ 
  lowStock = [], 
  slowMoving = [], 
  slowMovingCount = 0, 
  slowStockValue = 0 
}: Props) {
  const lowStockCount = lowStock.length;
  const hasAlerts = lowStockCount > 0 || slowMovingCount > 0;
  
  const [expanded, setExpanded] = useState<"low" | "slow" | null>(null);

  if (!hasAlerts) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-6"
    >
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Priority Badge */}
        <div className="flex items-center gap-2 shrink-0">
           <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold">
             !
           </span>
           <span className="text-sm font-bold text-white uppercase tracking-widest text-opacity-80">Priority Alerts</span>
        </div>

        {/* Alert Triggers */}
        <div className="flex-1 w-full bg-white/5 border border-white/5 rounded-2xl p-2 flex flex-wrap gap-2 items-center">
          {lowStockCount > 0 && (
            <button 
              onClick={() => setExpanded(expanded === "low" ? null : "low")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all border ${
                expanded === "low" 
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/15"
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">{lowStockCount} items critically low</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${expanded === "low" ? "rotate-180" : ""}`} />
            </button>
          )}
          
          {slowMovingCount > 0 && (
            <button 
              onClick={() => setExpanded(expanded === "slow" ? null : "slow")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all border ${
                expanded === "slow"
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/15"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-semibold">{slowMovingCount} slow-moving (₹{(slowStockValue / 1000).toFixed(1)}k locked)</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${expanded === "slow" ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Accordion Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-3"
          >
            <div className="p-4 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                {expanded === "low" ? <PackageMinus className="w-4 h-4" /> : <PackageX className="w-4 h-4" />}
                {expanded === "low" ? "Critical Restock Queue" : "Capital Trapped Assets"}
              </h4>
              <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                {(expanded === "low" ? lowStock : slowMoving).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                     <div>
                       <p className="text-sm font-bold text-white capitalize">{item.product_name || item.product}</p>
                       <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">
                         {expanded === "low" ? `Target: ${item.reorderPoint || 0}` : `Idle: ${item.daysSinceLastSale} days`}
                       </p>
                     </div>
                     <div className="text-right">
                       <p className={`text-sm font-bold ${expanded === "low" ? "text-rose-400" : "text-amber-400"}`}>
                         {item.quantity} {item.unit}
                       </p>
                       <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">
                         {expanded === "low" ? "Remaining" : `Locked: ₹${item.stockValue?.toLocaleString('en-IN')}`}
                       </p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
