"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Zap, Clock, Info, CheckCircle, ArrowRight } from "lucide-react";

interface Props {
  alert: any;
}

const STYLES: Record<string, { border: string; bg: string; iconBg: string; accent: string; DarkGlow: string }> = {
  danger: {
    border: "border-rose-500/20",
    bg: "bg-[#050505]",
    iconBg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    accent: "text-rose-500",
    DarkGlow: "bg-rose-500/5",
  },
  warning: {
    border: "border-amber-500/20",
    bg: "bg-[#050505]",
    iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    accent: "text-amber-500",
    DarkGlow: "bg-amber-500/5",
  },
  info: {
    border: "border-emerald-500/20",
    bg: "bg-[#050505]",
    iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    accent: "text-emerald-400",
    DarkGlow: "bg-emerald-500/5",
  },
};

export default function DecisionCard({ alert }: Props) {
  const style = STYLES[alert.type] || STYLES.info;
  const Icon = alert.type === 'danger' ? AlertTriangle : alert.type === 'warning' ? Zap : TrendingUp;

  // Deriving Action & Impact Metrics from payload
  let visualImpact = alert.impact || "High Leverage";
  if (alert.meta?.totalPending) {
    visualImpact = `₹${alert.meta.totalPending.toLocaleString('en-IN')}`;
  } else if (alert.meta?.marginPercent) {
    visualImpact = `${alert.meta.marginPercent}% Margin`;
  }

  let urgency = alert.type === 'danger' ? 'Immediate' : alert.type === 'warning' ? 'Standard' : 'Optimization';
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group rounded-2xl border ${style.border} ${style.bg} p-6 relative overflow-hidden flex flex-col`}
    >
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-24 -mt-24 blur-3xl opacity-50 transition-transform group-hover:scale-125 duration-1000 ${style.DarkGlow} pointer-events-none`} />

      <div className="relative z-10 flex items-start gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${style.iconBg} shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between mb-2">
            <h4 className="text-lg font-black text-white tracking-tight">
              {alert.title}
            </h4>
            <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${style.iconBg}`}>
               Decision Proxy
            </div>
          </div>
          
          <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-2xl">
            {alert.summary}
          </p>
        </div>
      </div>

      {/* Mini Visual Impact & AI Reasoning block */}
      <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
         
         <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><TrendingUp className="w-3 h-3 text-emerald-500" /> Estimated Impact</p>
            <p className="text-lg font-black text-white">{visualImpact}</p>
         </div>
         
         <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><Clock className="w-3 h-3 text-amber-500" /> Execution Urgency</p>
            <p className="text-lg font-black text-white">{alert.meta?.oldestDays ? `${alert.meta.oldestDays} Days Overdue` : urgency}</p>
         </div>

      </div>

      <div className="relative z-10 mt-4 p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5">
         <p className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5"><Info className="w-3 h-3" /> System Reasoning</p>
         <p className="text-xs text-indigo-200/70 font-medium">This active event is currently blocking capital velocity. Resolving this will incrementally improve your Business Health Index by +15 pts.</p>
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
         <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
            View Details
         </button>

         <button className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn ${style.type === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(5,150,105,0.2)]'}`}>
            <span>Execute Action</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
         </button>
      </div>

    </motion.div>
  );
}
