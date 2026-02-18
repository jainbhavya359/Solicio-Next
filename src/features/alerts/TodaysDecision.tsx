"use client";

import { motion } from "framer-motion";
import { Zap, Target } from "lucide-react";
import DecisionAlertCard from "./DecisionAlertCard";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
} as any;

export default function TodaysDecisions({ alerts }: { alerts: any[] }) {
  return (
    <motion.section
      variants={fadeInUp}
      className="group rounded-2xl sm:rounded-[2.5rem] border border-emerald-100 bg-emerald-50/20 p-4 sm:p-8 relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 bg-emerald-100/30 blur-3xl opacity-50 sm:opacity-100" />

      <div className="relative z-10 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
              <Target size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Decision Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter leading-none">
            Today’s Strategic Decisions
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2 sm:mt-3 max-w-xl leading-relaxed">
            Prioritize these <span className="text-emerald-600 font-black">{alerts.length} high-impact</span> items to optimize your business performance and capitalize on current market signals.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-emerald-100">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          AI-Driven Priority Ranking
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 relative z-10">
        {alerts.map((alert, index) => (
          <DecisionAlertCard key={alert.title || index} alert={alert} />
        ))}
      </div>

      {/* Footer reassurance */}
      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-emerald-100/50 flex items-center gap-2 sm:gap-3 relative z-10">
        <Zap size={14} className="text-emerald-500 sm:w-4 sm:h-4" />
        <p className="text-[9px] sm:text-[10px] font-black text-emerald-700/60 uppercase tracking-widest">
          Resolving these actions improves Business Health Score by +12 pts
        </p>
      </div>
    </motion.section>
  );
}
