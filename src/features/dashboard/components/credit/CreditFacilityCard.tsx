"use client";

import { motion } from "framer-motion";
import { Clock, Trash2, Wallet, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";

export interface Loan {
  _id: string;
  loanType?: string;
  lender?: string;
  status: "active" | "overdue" | "closed";
  emiAmount?: number;
  principalAmount?: number;
  tenure?: number;
  tenureUnit?: string;
  interestRate?: number;
  nextDueDate?: string;
}

interface Props {
  loan: Loan;
  onDelete: (id: string) => void;
}

const daysUntil = (date: string | undefined | null) => {
  if (!date) return undefined;
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export default function CreditFacilityCard({ loan, onDelete }: Props) {
  const daysLeft = daysUntil(loan.nextDueDate);
  
  // Health Colors per user request
  const isOverdue = daysLeft !== undefined && daysLeft <= 0;
  const isDueSoon = daysLeft !== undefined && daysLeft > 0 && daysLeft <= 7;
  const isHealthy = daysLeft === undefined || daysLeft > 7;

  const baseColor = isOverdue ? "rose" : isDueSoon ? "amber" : "emerald";
  const glowBorder = isOverdue ? "border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]" : "border-white/5";

  // Repayment mock progress (Hash of ID for constant visual demo)
  const mockProgress = Math.floor(Math.abs(loan._id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)) % 60) + 15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`group bg-[#050505] rounded-[2rem] border ${glowBorder} p-6 hover:border-${baseColor}-500/30 transition-all duration-300 flex flex-col relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${baseColor}-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700 blur-2xl`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-white/5 text-white group-hover:bg-${baseColor}-500/20 group-hover:text-${baseColor}-500 transition-colors border border-white/10`}>
             <Wallet size={18} />
          </div>
          <div>
            <h4 className="font-bold text-white tracking-tight capitalize">{loan.loanType || "Personal Loan"}</h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
               <ShieldCheck size={10} className={`text-${baseColor}-500`} />
               {loan.lender || "Financial Inst."}
            </p>
          </div>
        </div>
        
        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-${baseColor}-500/30 bg-${baseColor}-500/10 text-${baseColor}-400`}>
          {loan.status}
        </span>
      </div>

      {/* Principal & Interest Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t border-white/5 relative z-10">
         <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Principal</p>
            <p className="text-xl font-black text-white">₹{(loan.principalAmount || 0).toLocaleString('en-IN')}</p>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Interest</p>
            <p className="text-xl font-black text-white">{loan.interestRate}% <span className="text-[10px] text-slate-500">P.A.</span></p>
         </div>
      </div>

      {/* EMI & Tenure Strip */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-5 group-hover:bg-white/10 transition-colors relative z-10 flex items-center justify-between">
         <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Monthly EMI</p>
            <p className="text-2xl font-black text-indigo-400">₹{(loan.emiAmount || 0).toLocaleString('en-IN')}</p>
         </div>
         <div className="text-right flex flex-col items-end">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Tenure</p>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/5 px-2 py-1 rounded-lg border border-white/10">
               <ArrowRight size={12} className="text-indigo-500" />
               {loan.tenure} {loan.tenureUnit}
            </div>
         </div>
      </div>

      {/* Repayment Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Repayment Progress</p>
            <p className="text-[10px] font-black text-white">{mockProgress}%</p>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: `${mockProgress}%` }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.2 }}
             className={`h-full bg-gradient-to-r from-indigo-500 to-${baseColor}-500 rounded-full`} 
           />
        </div>
      </div>

      {/* Next Payment Identifier */}
      <div className={`mt-auto p-3 rounded-xl border bg-${baseColor}-500/10 border-${baseColor}-500/20 flex items-center gap-3 transition-all relative z-10`}>
         <div className={`h-8 w-8 rounded-lg bg-${baseColor}-500/20 text-${baseColor}-400 flex items-center justify-center`}>
            <Clock size={16} />
         </div>
         <div className="flex-1">
            <p className={`text-[10px] font-black uppercase tracking-widest leading-none text-${baseColor}-500`}>Next Payment</p>
            <p className="text-sm font-bold text-white mt-1">
               {isOverdue ? "Due Immediately" : isDueSoon ? `In ${daysLeft} Days` : `Valid for ${daysLeft} days`}
            </p>
         </div>
         {isOverdue && <AlertCircle size={18} className="text-rose-500 absolute right-4 animate-pulse" />}
      </div>

      {/* Hover Actions */}
      <div className="absolute top-6 right-20 opacity-0 group-hover:opacity-100 transition-opacity z-20">
         <button
           onClick={(e) => { e.stopPropagation(); onDelete(loan._id); }}
           className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-[0_4px_10px_rgba(244,63,94,0.3)] backdrop-blur-md border border-rose-500/30"
           title="Terminate Loan Facility"
         >
           <Trash2 size={14} />
         </button>
      </div>

    </motion.div>
  );
}
