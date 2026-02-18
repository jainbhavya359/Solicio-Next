"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, TrendingUp, AlertCircle, Info, ArrowUpRight, ShieldCheck, CreditCard } from "lucide-react";

const PRIORITY_STYLES: Record<
  string,
  { border: string; bg: string; accent: string; dark: string; iconBg: string }
> = {
  danger: {
    border: "border-rose-100",
    bg: "bg-rose-50/30",
    accent: "text-rose-600",
    dark: "bg-rose-600",
    iconBg: "bg-rose-50 text-rose-600"
  },
  warning: {
    border: "border-amber-100",
    bg: "bg-amber-50/30",
    accent: "text-amber-600",
    dark: "bg-amber-600",
    iconBg: "bg-amber-50 text-amber-600"
  },
  info: {
    border: "border-emerald-100",
    bg: "bg-emerald-50/30",
    accent: "text-emerald-600",
    dark: "bg-emerald-600",
    iconBg: "bg-emerald-50 text-emerald-600"
  },
};

export default function DecisionAlertCard({ alert }: { alert: any }) {
  const [open, setOpen] = useState(false);
  const style = PRIORITY_STYLES[alert.type] || PRIORITY_STYLES.info;

  return (
    <motion.div
      layout
      className={`rounded-2xl sm:rounded-3xl border ${style.border} ${style.bg} p-4 sm:p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden`}
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 relative z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/50 ${style.iconBg}`}>
            {alert.type === "danger" ? <AlertCircle size={16} className="sm:w-5 sm:h-5" /> : alert.type === "warning" ? <Info size={16} className="sm:w-5 sm:h-5" /> : <Zap size={16} className="sm:w-5 sm:h-5" />}
          </div>
          <div>
            <h3 className="font-black text-slate-900 tracking-tight leading-none text-sm sm:text-base">
              {alert.title}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1.5 sm:mt-2 leading-relaxed">
              {alert.summary || alert.why}
            </p>
          </div>
        </div>

        {alert.priority && (
          <span className="self-start sm:self-auto px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/50 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100/50 whitespace-nowrap">
            Priority {alert.priority}
          </span>
        )}
      </div>

      {/* IMPACT & ACTION ROW */}
      <div className="mt-4 sm:mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 relative z-10 pt-3 sm:pt-5 border-t border-slate-900/5">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 sm:p-2 rounded-lg bg-white/50 ${style.accent}`}>
            <TrendingUp size={14} className="sm:w-4 sm:h-4" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Strategic Impact</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 sm:mt-1">{alert.impact}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl transition-transform active:scale-95 group/action cursor-pointer w-full md:w-auto">
          <div className="flex-1">
            <p className="text-[8px] sm:text-[9px] font-black text-white/50 uppercase tracking-[0.2em] leading-none">Execute Action</p>
            <p className="text-xs sm:text-sm font-black mt-0.5 sm:mt-1 group-hover:text-emerald-400 transition-colors line-clamp-1">{alert.action}</p>
          </div>
          <ArrowUpRight size={16} className="text-emerald-400 sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>

      {/* DETAILS TOGGLE */}
      {alert.meta && (
        <button
          onClick={() => setOpen(v => !v)}
          className="mt-3 sm:mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900/5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900/10 transition-colors group"
        >
          {open ? "Hide Strategic Details" : "View Supporting Metrics"}
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {/* META CONTENT */}
      <AnimatePresence>
        {open && alert.meta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-2xl bg-white/80 border border-white/50 space-y-3 sm:space-y-4 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {alert.meta.marginPercent && (
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Margin Performance</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-base sm:text-lg font-black text-slate-900">{alert.meta.marginPercent}%</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400">on {alert.meta.unitsSold} units</p>
                    </div>
                  </div>
                )}

                {alert.meta.totalPending && (
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Blocked Capital</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-base sm:text-lg font-black text-rose-600">₹{alert.meta.totalPending.toLocaleString()}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400">{alert.meta.oldestDays}d stalled</p>
                    </div>
                  </div>
                )}
              </div>

              {alert.meta.topDefaulters && (
                <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    Top Defaulters Listed
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.meta.topDefaulters.map((d: any, i: number) => (
                      <span key={i} className="px-2 py-1 rounded-lg bg-white text-[9px] sm:text-[10px] font-bold text-slate-700 border border-slate-100 shadow-sm">
                        {d.partyName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
