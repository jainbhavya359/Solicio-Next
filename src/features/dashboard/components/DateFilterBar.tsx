"use client";

import Icons from "../constants/icons";

interface Props {
  fromDate: string;
  toDate: string;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;
}

export default function DateFilterBar({ fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{Icons.calendar}</div>
        <h2 className="text-sm font-bold text-white">Filter Range</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 relative z-10">
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0a0a0a] border border-white/5 text-sm font-medium text-slate-200 focus:bg-white/[0.02] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0a0a0a] border border-white/5 text-sm font-medium text-slate-200 focus:bg-white/[0.02] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>
    </div>
  );
}
