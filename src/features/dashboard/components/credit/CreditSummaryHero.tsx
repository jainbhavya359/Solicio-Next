"use client";

import { motion } from "framer-motion";
import { Building, Calculator, AlertTriangle, ShieldCheck } from "lucide-react";
import { Loan } from "../../../loan_licenses/ActiveLoans";

interface Props {
  loans: Loan[];
}

export default function CreditSummaryHero({ loans = [] }: Props) {
  const activeLoans = loans.filter(l => l.status === "active" || l.status === "overdue");
  const overdueLoans = loans.filter(l => l.status === "overdue");
  
  const totalDebt = activeLoans.reduce((sum, l) => sum + (l.principalAmount || 0), 0);
  const totalEmi = activeLoans.reduce((sum, l) => sum + (l.emiAmount || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Outstanding Debt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Building size={64} className="text-slate-300" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Outstanding Debt</p>
        <p className="text-3xl font-black text-white">₹{totalDebt.toLocaleString('en-IN')}</p>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-medium">
          <Building size={14} /> Aggregated Principal
        </p>
      </motion.div>

      {/* Monthly EMI Total */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Calculator size={64} className="text-indigo-500" />
        </div>
        <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest mb-1">Monthly EMI Total</p>
        <p className="text-3xl font-black text-indigo-400">₹{totalEmi.toLocaleString('en-IN')}</p>
        <p className="text-xs text-indigo-500/70 mt-2 flex items-center gap-1 font-medium">
          <Calculator size={14} /> Fixed Capital Drain
        </p>
      </motion.div>

      {/* Active Loans */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <ShieldCheck size={64} className="text-emerald-500" />
        </div>
        <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Active Facilities</p>
        <p className="text-3xl font-black text-emerald-400">{activeLoans.length}</p>
        <p className="text-xs text-emerald-500/70 mt-2 flex items-center gap-1 font-medium">
          <ShieldCheck size={14} /> Credit lines maintained
        </p>
      </motion.div>

      {/* Overdue Loans */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`${overdueLoans.length > 0 ? "bg-rose-500/10 border-rose-500/40" : "bg-white/5 border-white/10"} rounded-3xl p-6 relative overflow-hidden group transition-all`}
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <AlertTriangle size={64} className={overdueLoans.length > 0 ? "text-rose-500" : "text-slate-500"} />
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${overdueLoans.length > 0 ? "text-rose-400" : "text-slate-500"}`}>Default Risk / Overdue</p>
        <p className={`text-3xl font-black ${overdueLoans.length > 0 ? "text-rose-500" : "text-white"}`}>{overdueLoans.length}</p>
        <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${overdueLoans.length > 0 ? "text-rose-500/70" : "text-slate-400"}`}>
          <AlertTriangle size={14} /> {overdueLoans.length > 0 ? "Immediate Action Required" : "Zero active defaults"}
        </p>
        
        {/* Glow */}
        {overdueLoans.length > 0 && (
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/20 blur-[50px] rounded-full pointer-events-none" />
        )}
      </motion.div>
    </div>
  );
}
