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
      className={`group rounded-[2rem] border ${style.border} ${style.bg} p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
    >
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-20 transition-transform group-hover:scale-110 duration-500 ${style.dark}`} />

      {/* HEADER */}
      <div className="flex items-start gap-4 transition-all relative z-10">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm border ${style.icon} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-black text-slate-900 tracking-tight text-lg">
              {alert.title}
            </h4>
            {alert.confidence && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/50 text-slate-500 border border-slate-100">
                {alert.confidence} Confidence
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            {alert.summary || alert.why}
          </p>
        </div>
      </div>

      {/* IMPACT & META */}
      <div className="mt-6 flex flex-wrap gap-4 relative z-10">
        {alert.impact && (
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white/80 shadow-sm transition-colors group-hover:bg-white">
            <TrendingUp size={14} className={style.accent} />
            <p className="text-[11px] font-bold text-slate-700">
              <span className="text-slate-400 uppercase tracking-widest text-[9px] mr-1.5 font-black">Impact</span>
              {alert.impact}
            </p>
          </div>
        )}

        {alert.meta && (
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white/80 shadow-sm transition-colors group-hover:bg-white">
            <CreditCard size={14} className="text-slate-400" />
            <p className="text-[11px] font-bold text-slate-700">
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
      <div className="mt-6 pt-5 border-t border-slate-100/50 flex items-center justify-between relative z-10">
        <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] ${style.accent}`}>
          <Zap size={14} />
          Recommended Action
        </div>
        <div className="flex items-center gap-2 group/action">
          <p className="text-sm font-black text-slate-900 group-hover/action:text-emerald-600 transition-colors">
            {alert.action}
          </p>
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover/action:bg-emerald-600 transition-all active:scale-90 shadow-md">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
