"use client";

import { motion } from "framer-motion";
import { Package, ArrowDownRight, ArrowUpRight, RotateCcw, Hash, AlertTriangle } from "lucide-react";

interface Props {
  row: any;
  inactive: boolean;
  onReverse: (row: any) => void;
}

export default function TransactionRow({ row, inactive, onReverse }: Props) {
  // Determine Cash Impact. 
  // Sale (Credit Qty) = Cash Inbound (Positive Financial Impact, Emerald)
  // Purchase (Debit Qty) = Cash Outbound (Negative Financial Impact, Rose)
  const isSale = row.voucherType === "Sale";
  const cashImpactColor = isSale ? "text-emerald-400" : "text-rose-400";
  const bgBadgeColor = isSale ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20";
  const Icon = isSale ? ArrowUpRight : ArrowDownRight;

  // Amount is technically stock units, so we prefix it with Units, but colour it by financial impact.
  const displayAmount = isSale ? `-${row.creditQty} ${row.unit}` : `+${row.debitQty} ${row.unit}`;
  
  // Highlight if it's an unusually large transaction
  const isHighValue = (row.creditQty > 500) || (row.debitQty > 500);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
      }}
      className={`
        relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all group
        ${inactive ? "bg-[#050505] border-white/5 opacity-50 grayscale" : "bg-white/5 border-white/10 hover:bg-white/10"}
        ${!inactive && isHighValue ? "shadow-[0_0_20px_rgba(99,102,241,0.15)] border-indigo-500/30" : ""}
      `}
    >
      {/* LEFT: Identity */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`p-3 rounded-xl border ${bgBadgeColor} ${cashImpactColor} shadow-sm hidden sm:block`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-bold truncate capitalize text-base">{row.itemName}</h4>
            {isHighValue && !inactive && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/30">
                <AlertTriangle size={10} /> High Volume
              </span>
            )}
            {inactive && (
               <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                 Reversed
               </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate flex items-center gap-2">
            <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">#{row.voucherNo}</span>
            <span>{row.partyName} ({row.partyType})</span>
          </p>
        </div>
      </div>

      {/* RIGHT: Financials & Meta */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
        
        {/* Date */}
        <div className="flex flex-col text-left sm:text-right w-24">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</span>
          <span className="text-sm text-slate-200 mt-0.5">{row.date.slice(0, 10)}</span>
        </div>

        {/* Transaction Flow */}
        <div className="flex flex-col text-right w-24">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cash Impact</span>
          <span className={`text-base font-black ${cashImpactColor} mt-0.5`}>
             {isSale ? "Inbound" : "Outbound"}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Stock: {displayAmount}</span>
        </div>

        {/* Balance Impact */}
        <div className="flex flex-col text-right w-16">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Bal</span>
          <span className="text-base font-black text-white bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-center mt-0.5 line-clamp-1">{row.balance}</span>
        </div>

        {/* Action Reversal */}
        <div className="w-10 flex justify-end">
          {!inactive && (
            <button
              onClick={() => onReverse(row)}
              className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl border border-rose-500/20 transition-all active:scale-95"
              title="Reverse Entry"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
