"use client";

import { motion } from "framer-motion";
import { Activity, ShieldAlert, Sparkles } from "lucide-react";

interface Props {
  alerts: any[];
  healthSignals: any[];
}

export default function PriorityScoreStrip({ alerts = [], healthSignals = [] }: Props) {
  // Synthesize metrics
  const criticalCount = alerts.filter(a => a.type === 'danger').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  
  // Base health is 100. -15 for each critical, -5 for each warning, +5 for each healthy check
  let healthScore = 100 - (criticalCount * 15) - (warningCount * 5) + (healthSignals.length * 5);
  healthScore = Math.max(0, Math.min(100, healthScore));

  let riskLevel = "Low";
  let riskColor = "emerald";
  let riskPercent = 10;
  
  if (healthScore < 50) {
      riskLevel = "Critical"; 
      riskColor = "rose";
      riskPercent = 90;
  } else if (healthScore < 80) {
      riskLevel = "Elevated"; 
      riskColor = "amber";
      riskPercent = 60;
  }

  const oppScore = Math.min(100, (alerts.filter(a => a.type === 'info').length * 20) + 20);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 relative z-10">
       
       {/* Health Index */}
       <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Health Index</span>
             </div>
             <span className="text-xl font-black text-white">{healthScore}/100</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${healthScore}%` }} 
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" 
             />
          </div>
       </div>

       {/* Risk Level */}
       <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 text-${riskColor}-500`} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Risk Level</span>
             </div>
             <span className={`text-xl font-black text-${riskColor}-400 uppercase tracking-wider`}>{riskLevel}</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${riskPercent}%` }} 
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full bg-gradient-to-r from-${riskColor}-600 to-${riskColor}-400 rounded-full`}
             />
          </div>
       </div>

       {/* Opportunity Score */}
       <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimization Score</span>
             </div>
             <span className="text-xl font-black text-indigo-400">{oppScore}/100</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${oppScore}%` }} 
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full" 
             />
          </div>
       </div>

    </div>
  );
}
