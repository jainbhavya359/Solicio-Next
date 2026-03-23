"use client";

import { CreditCard, FileUp, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CreditActionFooter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pb-12">
      <Link
        href="/loans"
        className="group flex flex-col p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-center items-center justify-center min-h-[140px]"
      >
         <CreditCard size={24} className="text-emerald-400 mb-3" />
         <h4 className="text-base font-bold text-white">Make Payment</h4>
         <p className="text-[10px] font-medium text-emerald-400/50 uppercase tracking-widest mt-1">Settle EMI Dues</p>
      </Link>

      <button
        className="group relative overflow-hidden flex flex-col p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-center items-center justify-center min-h-[140px]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <FileUp size={24} className="text-indigo-400 mb-3" />
        <h4 className="text-base font-bold text-white">Upload Documents</h4>
        <p className="text-[10px] font-medium text-indigo-400/50 uppercase tracking-widest mt-1">Sync new credentials</p>
      </button>

      <Link
        href="/licenses"
        className="group flex flex-col p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all text-center items-center justify-center min-h-[140px]"
      >
         <ExternalLink size={24} className="text-amber-400 mb-3" />
         <h4 className="text-base font-bold text-white">Review Portfolios</h4>
         <p className="text-[10px] font-medium text-amber-400/50 uppercase tracking-widest mt-1">Full Credit Directory</p>
      </Link>
    </div>
  );
}
