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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">{Icons.calendar}</div>
        <h2 className="text-sm font-semibold text-stone-700">Filter Range</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-xs font-medium text-stone-400">From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-stone-50 border-none text-sm font-medium text-stone-700 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-xs font-medium text-stone-400">To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-stone-50 border-none text-sm font-medium text-stone-700 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}
