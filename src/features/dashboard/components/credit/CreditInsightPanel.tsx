"use client";

import { Sparkles } from "lucide-react";
import { Loan } from "../../../loan_licenses/ActiveLoans";

interface Props {
  loans: Loan[];
}

export default function CreditInsightPanel({ loans = [] }: Props) {
  if (!loans || loans.length === 0) return null;

  const activeLoans = loans.filter(l => l.status === "active" || l.status === "overdue");
  
  if (activeLoans.length === 0) return null;

  // Insight 1: Highest Interest Rate
  const highestInterestLoan = [...activeLoans].sort((a, b) => (b.interestRate || 0) - (a.interestRate || 0))[0];
  
  // Insight 2: Total monthly drain
  const totalEmi = activeLoans.reduce((sum, l) => sum + (l.emiAmount || 0), 0);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Sparkles className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Neural Liability Synthesis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {highestInterestLoan && highestInterestLoan.interestRate! > 10 && (
              <div className="bg-[#050505]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Refinance Opportunity</p>
                <p className="text-sm text-slate-300">
                  High-interest facility detected (<span className="text-amber-400 font-bold">{highestInterestLoan.interestRate}%</span> on {highestInterestLoan.loanType}). Consider capital restructuring or refinancing.
                </p>
              </div>
            )}
            
            <div className="bg-[#050505]/50 border border-white/5 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Liquidity Impact</p>
              <p className="text-sm text-slate-300">
                Fixed credit obligations actively draining <span className="text-rose-400 font-bold">₹{totalEmi.toLocaleString('en-IN')}</span> per month in operational liquidity.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
