"use client";

import { CheckCircle, ArrowUpRight } from "lucide-react";

interface Props {
  alerts: any[];
}

export default function DecisionStack({ alerts = [] }: Props) {
  if (alerts.length === 0) return null;

  // Synthesize top 3 actionable elements from the stack (prioritize danger flags immediately)
  const topActions = [...alerts]
    .sort((a, b) => {
       const wA = a.type === 'danger' ? 100 : a.type === 'warning' ? 50 : 10;
       const wB = b.type === 'danger' ? 100 : b.type === 'warning' ? 50 : 10;
       return wB - wA;
    })
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
         <div>
            <h3 className="text-xl font-black text-white tracking-tight">Top Actions Today</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Highest-leverage decisions mapped by Priority Score</p>
         </div>
         <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> AI Priority Ranking
         </div>
      </div>

      <div className="space-y-4 relative z-10">
         {topActions.map((action, i) => {
            const score = action.type === 'danger' ? 95 : action.type === 'warning' ? 70 : 45;
            const accentText = action.type === 'danger' ? "text-rose-400" : action.type === 'warning' ? "text-amber-500" : "text-emerald-400";
            const borderGlow = action.type === 'danger' ? "border-rose-500/30" : action.type === 'warning' ? "border-amber-500/30" : "border-emerald-500/30";

            return (
              <div key={i} className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050505] border ${borderGlow} shadow-[0_4px_20px_rgba(0,0,0,0.2)]`}>
                 <div className="flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${accentText}`}>Priority {score}/100</p>
                    <h4 className="text-base font-bold text-white mb-1">{action.title}</h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{action.action}</p>
                 </div>

                 <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-xl text-[10px] font-black text-white uppercase tracking-widest shrink-0">
                    Execute <ArrowUpRight className="w-3.5 h-3.5" />
                 </button>
              </div>
            )
         })}
      </div>
    </div>
  );
}
