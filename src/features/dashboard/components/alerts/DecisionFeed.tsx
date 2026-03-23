"use client";

import { motion } from "framer-motion";
import DecisionCard from "./DecisionCard";

interface Props {
  alerts: any[];
}

export default function DecisionFeed({ alerts = [] }: Props) {
  // Categorically isolate into Priority Blocks
  const critical = alerts.filter(a => a.type === 'danger');
  const warning = alerts.filter(a => a.type === 'warning');
  const info = alerts.filter(a => a.type === 'info');

  return (
    <div className="space-y-12 relative z-10 w-full">

      {critical.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 w-full border-b border-white/5 pb-2">
             <div className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-500 uppercase tracking-widest border border-rose-500/20">High Priority</div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Immediate Actions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {critical.map((c, i) => <DecisionCard key={i} alert={c} />)}
          </div>
        </section>
      )}

      {warning.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 w-full border-b border-white/5 pb-2">
             <div className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-500 uppercase tracking-widest border border-amber-500/20">Medium Priority</div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optimization Opportunities</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {warning.map((w, i) => <DecisionCard key={i} alert={w} />)}
          </div>
        </section>
      )}

      {info.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 w-full border-b border-white/5 pb-2">
             <div className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Low Priority</div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Strategic Suggestions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
            {info.map((infoAlert, i) => <DecisionCard key={i} alert={infoAlert} />)}
          </div>
        </section>
      )}

    </div>
  );
}
