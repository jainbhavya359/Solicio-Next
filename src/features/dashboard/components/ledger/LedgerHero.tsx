"use client";

import { motion } from "framer-motion";
import { Activity, ArrowDownRight, ArrowUpRight, Sigma } from "lucide-react";

interface Props {
  stockHistory: any[]; // Using stock history for financial valuation
  ledgerRows: any[];   // Using ledger for transaction count
}

export default function LedgerHero({ stockHistory = [], ledgerRows = [] }: Props) {
  // Aggregate financials from stock history since it contains pricing
  const purchases = stockHistory.filter(r => r.voucher === "Purchase" || r.type === "Purchase");
  const sales = stockHistory.filter(r => r.voucher === "Sale" || r.type === "Sale");

  const totalDebit = purchases.reduce((sum, r) => sum + (r.quantity * (r.price || 0)), 0);
  const totalCredit = sales.reduce((sum, r) => sum + (r.quantity * (r.price || 0)), 0);
  const netFlow = totalCredit - totalDebit;

  const txCount = ledgerRows.length > 0 ? ledgerRows.length : stockHistory.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Transactions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity size={64} className="text-blue-500" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Transactions</p>
        <p className="text-3xl font-black text-white">{txCount.toLocaleString()}</p>
        <p className="text-xs text-blue-400 mt-2 flex items-center gap-1 font-medium">
          <Activity size={14} /> Active Ledger Entries
        </p>
      </motion.div>

      {/* Total Credit (Inbound Cash from Sales) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <ArrowUpRight size={64} className="text-emerald-500" />
        </div>
        <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Total Credit (Inflows)</p>
        <p className="text-3xl font-black text-emerald-400">₹{totalCredit.toLocaleString('en-IN')}</p>
        <p className="text-xs text-emerald-500/70 mt-2 flex items-center gap-1 font-medium">
          <ArrowUpRight size={14} /> Gross capital acquired
        </p>
      </motion.div>

      {/* Total Debit (Outbound Cash for Purchases) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-rose-500/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <ArrowDownRight size={64} className="text-rose-500" />
        </div>
        <p className="text-[10px] font-bold text-rose-500/70 uppercase tracking-widest mb-1">Total Debit (Outflows)</p>
        <p className="text-3xl font-black text-rose-400">₹{totalDebit.toLocaleString('en-IN')}</p>
        <p className="text-xs text-rose-500/70 mt-2 flex items-center gap-1 font-medium">
          <ArrowDownRight size={14} /> Capital deployed
        </p>
      </motion.div>

      {/* Net Flow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-indigo-500/5 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sigma size={64} className="text-indigo-500" />
        </div>
        <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest mb-1">Net Flow Trajectory</p>
        <p className="text-3xl font-black text-white">
          {netFlow > 0 ? "+" : ""}₹{netFlow.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1 font-medium">
          <Sigma size={14} /> Net retained capitalization
        </p>
        
        {/* Glow */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
      </motion.div>
    </div>
  );
}
