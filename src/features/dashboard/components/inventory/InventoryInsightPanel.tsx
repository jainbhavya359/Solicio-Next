"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  slowStockValue?: number;
  topSkuRevenuePct?: number;
  healthLabel?: string;
}

export default function InventoryInsightPanel({ slowStockValue = 0, topSkuRevenuePct = 0, healthLabel = "Healthy" }: Props) {
  
  const insights = [];

  if (slowStockValue > 0) {
    insights.push(
      <p key="1" className="text-sm font-medium text-slate-300">
        <strong className="text-amber-400">₹{(slowStockValue / 1000).toFixed(1)}k</strong> is currently locked within slow-moving and dead inventory segments.
      </p>
    );
  }

  if (topSkuRevenuePct > 0) {
    insights.push(
      <p key="2" className="text-sm font-medium text-slate-300">
        Your top performing SKU drives <strong className="text-emerald-400">{topSkuRevenuePct.toFixed(1)}%</strong> of total volume this period.
      </p>
    );
  }

  insights.push(
    <p key="3" className="text-sm font-medium text-slate-300">
      Overall stock pipeline velocity is categorized as <strong className="text-indigo-400">{healthLabel}</strong>.
    </p>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 mb-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-2.5 mt-1">
          {insights}
        </div>
      </div>
    </motion.div>
  );
}
