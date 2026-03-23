"use client";

import { motion } from "framer-motion";
import { Coins, AlertTriangle, Activity } from "lucide-react";

interface Props {
  inventoryData?: any;
  slowStockData?: any;
  healthData?: any;
}

export default function InventorySummaryCards({ inventoryData, slowStockData, healthData }: Props) {
  
  // Safely extract data, fallback to 0
  const totalValue = inventoryData?.stockValuation?.totalValue || 0;
  
  const lowStockCount = healthData?.lowStock?.length || 0;
  const criticalCount = slowStockData?.deadStockCount || 0;
  const itemsAtRisk = lowStockCount + criticalCount;
  
  const fastCount = healthData?.stockMovement?.breakdown?.filter((b: any) => b.category === "fast").length || 0;
  const totalTracked = healthData?.stockMovement?.productCount || 1;
  const velocityScore = Math.round((fastCount / totalTracked) * 100) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
      
      {/* TOTAL STOCK VALUE */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative overflow-hidden p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 group hover:border-white/20 transition-all"
      >
        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-[40px] group-hover:bg-emerald-500/20 transition-colors" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-emerald-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Stock Value</p>
          <p className="text-3xl font-bold text-white tracking-tight">₹{totalValue.toLocaleString('en-IN')}</p>
        </div>
      </motion.div>

      {/* ITEMS AT RISK */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="relative overflow-hidden p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 group hover:border-white/20 transition-all"
      >
        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-rose-500/10 blur-[40px] group-hover:bg-rose-500/20 transition-colors" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">Critical</span>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Items at Risk</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white tracking-tight">{itemsAtRisk}</p>
            <p className="text-xs font-medium text-slate-400">SKUs</p>
          </div>
        </div>
      </motion.div>

      {/* MOVEMENT VELOCITY */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="relative overflow-hidden p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 group hover:border-white/20 transition-all"
      >
        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-violet-500/10 blur-[40px] group-hover:bg-violet-500/20 transition-colors" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-violet-400">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">Fast Ratio</span>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Movement Velocity</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white tracking-tight">{velocityScore}%</p>
            <p className="text-xs font-medium text-slate-400">Fast moving</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
