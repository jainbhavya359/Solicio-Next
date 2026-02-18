"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Lightbulb,
  Wallet,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  CreditCard
} from "lucide-react";

const ICONS: Record<string, any> = {
  danger: Wallet,
  warning: AlertTriangle,
  info: Lightbulb,
};

const STYLES: Record<
  string,
  { border: string; bg: string; icon: string; accent: string; dark: string }
> = {
  danger: {
    border: "border-rose-100",
    bg: "bg-rose-50/50",
    icon: "bg-rose-50 text-rose-600 border-rose-100/50",
    accent: "text-rose-600",
    dark: "bg-rose-600"
  },
  warning: {
    border: "border-amber-100",
    bg: "bg-amber-50/50",
    icon: "bg-amber-50 text-amber-600 border-amber-100/50",
    accent: "text-amber-600",
    dark: "bg-amber-600"
  },
  info: {
    border: "border-emerald-100",
    bg: "bg-emerald-50/50",
    icon: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    accent: "text-emerald-600",
    dark: "bg-emerald-600"
  },
};

export default function AlertCard({ alert }: { alert: any }) {
  const Icon = ICONS[alert.type] || Lightbulb;
  const style = STYLES[alert.type] || STYLES.info;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group rounded-2xl sm:rounded-[2rem] border ${style.border} ${style.bg} p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
    >
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 opacity-20 transition-transform group-hover:scale-110 duration-500 ${style.dark}`} />

      {/* HEADER */}
      <div className="flex items-start gap-3 sm:gap-4 transition-all relative z-10">
        <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shadow-sm border ${style.icon} shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1 sm:gap-0">
            <h4 className="font-black text-slate-900 tracking-tight text-base sm:text-lg leading-tight">
              {alert.title}
            </h4>
            {alert.confidence && (
              <span className="w-fit px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-white/50 text-slate-500 border border-slate-100 truncate">
                {alert.confidence} Confidence
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
            {alert.summary || alert.why}
          </p>
        </div>
      </div>

      {/* IMPACT & META */}
      <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 relative z-10">
        {alert.impact && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-white/80 shadow-sm transition-colors group-hover:bg-white">
            <TrendingUp size={12} className={`sm:w-[14px] sm:h-[14px] ${style.accent}`} />
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-700">
              <span className="text-slate-400 uppercase tracking-widest text-[8px] sm:text-[9px] mr-1.5 font-black">Impact</span>
              {alert.impact}
            </p>
          </div>
        )}

        {alert.meta && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/60 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-white/80 shadow-sm transition-colors group-hover:bg-white">
            <CreditCard size={12} className="text-slate-400 sm:w-[14px] sm:h-[14px]" />
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-700">
              {alert.meta.marginPercent ? (
                <>Margin {alert.meta.marginPercent}% · {alert.meta.unitsSold} units</>
              ) : alert.meta.totalPending ? (
                <>₹{alert.meta.totalPending.toLocaleString()} · {alert.meta.oldestDays}d overdue</>
              ) : "Check details"}
            </p>
          </div>
        )}
      </div>

      {/* ACTION */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-slate-100/50 flex items-center justify-between relative z-10">
        <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] ${style.accent}`}>
          <Zap size={12} className="sm:w-[14px] sm:h-[14px]" />
          Recommended Action
        </div>
        <div className="flex items-center gap-2 group/action">
          <p className="text-xs sm:text-sm font-black text-slate-900 group-hover/action:text-emerald-600 transition-colors text-right leading-tight max-w-[150px] sm:max-w-none">
            {alert.action}
          </p>
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover/action:bg-emerald-600 transition-all active:scale-90 shadow-md transform group-hover/action:translate-x-1">
            <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
