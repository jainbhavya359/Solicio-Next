"use client";

import { motion } from "framer-motion";
import { Activity, Calendar } from "lucide-react";

interface Props {
  from: string;
  to: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  onRecalculate: () => void;
  loading: boolean;
}

export default function FinanceHeaderControls({ from, to, setFrom, setTo, onRecalculate, loading }: Props) {
  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setFrom(start.toISOString().split("T")[0]);
    setTo(end.toISOString().split("T")[0]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Financial Intelligence</h2>
          <p className="text-sm text-slate-400 font-medium">Real-time profitability, cost breakdown, and cash insights</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto p-2 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between gap-2 px-2 pb-2 border-b border-white/5">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timeframe Select</span>
           <div className="flex gap-2">
             <button onClick={() => handlePreset(7)} className="text-[9px] font-bold uppercase text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 px-2 py-0.5 rounded">7D</button>
             <button onClick={() => handlePreset(30)} className="text-[9px] font-bold uppercase text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 px-2 py-0.5 rounded">30D</button>
           </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex flex-col px-2 flex-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">From</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <input
                  type="date"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="text-xs font-bold text-white border-none bg-transparent p-0 focus:ring-0 cursor-pointer [color-scheme:dark] w-full min-w-[100px]"
                />
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 shrink-0" />
            <div className="flex flex-col px-2 flex-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">To</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="text-xs font-bold text-white border-none bg-transparent p-0 focus:ring-0 cursor-pointer [color-scheme:dark] w-full min-w-[100px]"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={onRecalculate}
            disabled={loading}
            className={`w-full sm:w-auto h-10 px-5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)] flex items-center justify-center gap-2
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]'}
            `}
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                Syncing...
              </>
            ) : "Calculate"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
