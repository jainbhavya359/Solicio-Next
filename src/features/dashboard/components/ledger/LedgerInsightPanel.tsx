"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  stockHistory: any[];
}

export default function LedgerInsightPanel({ stockHistory = [] }: Props) {
  if (!stockHistory || stockHistory.length === 0) return null;

  // Derive insights
  const purchases = stockHistory.filter(r => r.voucher === "Purchase" || r.type === "Purchase");
  const sales = stockHistory.filter(r => r.voucher === "Sale" || r.type === "Sale");

  // Insight 1: Most expenses coming from category/SKU X
  const skuExpenses = purchases.reduce((acc, curr) => {
    acc[curr.name] = (acc[curr.name] || 0) + (curr.quantity * (curr.price || 0));
    return acc;
  }, {} as Record<string, number>);
  const topExpenseSku = Object.keys(skuExpenses).sort((a, b) => skuExpenses[b] - skuExpenses[a])[0];

  // Insight 2: Top earning SKU
  const skuEarnings = sales.reduce((acc, curr) => {
    acc[curr.name] = (acc[curr.name] || 0) + (curr.quantity * (curr.price || 0));
    return acc;
  }, {} as Record<string, number>);
  const topEarningSku = Object.keys(skuEarnings).sort((a, b) => skuEarnings[b] - skuEarnings[a])[0];

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Sparkles className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Neural Ledger Synthesis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#050505]/50 border border-white/5 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Highest Capital Drain</p>
              <p className="text-sm text-slate-300">
                Most outbound capital deployment stems from restocking <span className="text-amber-400 font-bold capitalize">{topExpenseSku || "Unknown"}</span>.
              </p>
            </div>
            
            <div className="bg-[#050505]/50 border border-white/5 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Peak Yield Generator</p>
              <p className="text-sm text-slate-300">
                Top inbound cash flow today is generated exclusively by <span className="text-emerald-400 font-bold capitalize">{topEarningSku || "Unknown"}</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
