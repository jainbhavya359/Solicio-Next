"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Layers, Users } from "lucide-react";

interface Props {
  parties: any[];
}

export default function PartiesHero({ parties = [] }: Props) {
  const totalToTake = parties.reduce((sum, party) => sum + ((party.totalSales || 0) - (party.totalReceived || 0)), 0);
  const totalToGive = parties.reduce((sum, party) => sum + ((party.totalPurchases || 0) - (party.totalPaid || 0)), 0);
  const netBalance = totalToTake - totalToGive;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Receivables */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.0 }}
        className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp size={64} className="text-emerald-500" />
        </div>
        <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Total Receivables</p>
        <p className="text-3xl font-black text-emerald-400">₹{totalToTake.toLocaleString('en-IN')}</p>
        <p className="text-xs text-emerald-500/70 mt-2 flex items-center gap-1 font-medium">
          <TrendingUp size={14} /> To Take from Customers
        </p>
      </motion.div>

      {/* Payables */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-rose-500/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingDown size={64} className="text-rose-500" />
        </div>
        <p className="text-[10px] font-bold text-rose-500/70 uppercase tracking-widest mb-1">Total Payables</p>
        <p className="text-3xl font-black text-rose-400">₹{totalToGive.toLocaleString('en-IN')}</p>
        <p className="text-xs text-rose-500/70 mt-2 flex items-center gap-1 font-medium">
          <TrendingDown size={14} /> To Give to Suppliers
        </p>
      </motion.div>

      {/* Net Balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Layers size={64} className="text-indigo-500" />
        </div>
        <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest mb-1">Net Flow Balance</p>
        <p className="text-3xl font-black text-indigo-400">{netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toLocaleString('en-IN')}</p>
        <p className="text-xs text-indigo-500/70 mt-2 flex items-center gap-1 font-medium">
          <Layers size={14} /> Aggregate Liquid Position
        </p>
      </motion.div>

      {/* Active Parties */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={"bg-[#050505] border border-white/10 rounded-3xl p-6 relative overflow-hidden group transition-all"}
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users size={64} className={"text-slate-500"} />
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-500`}>Active Network</p>
        <p className={`text-3xl font-black text-white`}>{parties.length}</p>
        <p className={`text-xs mt-2 flex items-center gap-1 font-medium text-slate-400`}>
          <Users size={14} /> Registered Entities
        </p>
      </motion.div>

    </div>
  );
}
