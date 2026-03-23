"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Layers, Settings2 } from "lucide-react";

interface Props {
  profileCompleteness: number; // 0-100
  securityScore: number;       // 0-100
  activeIntegrations: number;
}

export default function SettingsHero({ profileCompleteness = 100, securityScore = 90, activeIntegrations = 2 }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 p-8 lg:p-12 z-20">
      
      {/* Cinematic Pulse Backgrounds */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Title Block */}
        <div className="max-w-xl">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Settings2 className="w-3.5 h-3.5" />
              Core Mechanics
           </div>
           
           <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
             System <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Control Center.</span>
           </h1>
           <p className="mt-4 text-base font-medium text-slate-400 leading-relaxed max-w-lg">
             Manage your business identity, authentication layers, security constraints, and external operational integrations.
           </p>
        </div>

        {/* Real-time System Status Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 shrink-0 mt-6 lg:mt-0">
           
           <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
             className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
           >
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-3">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${profileCompleteness}%` }} transition={{ duration: 1 }} className="h-full bg-emerald-500 rounded-full" />
              </div>
              <p className="text-2xl font-black text-white">{profileCompleteness}%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Identity Complete</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
             className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
           >
              <div className="flex items-center gap-2 mb-3">
                 <ShieldCheck className={`w-4 h-4 ${securityScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`} />
                 <span className={`text-[10px] font-black uppercase tracking-widest ${securityScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {securityScore > 80 ? 'Secure' : 'Review'}
                 </span>
              </div>
              <p className="text-2xl font-black text-white">{securityScore}/100</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Security Rating</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
             className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 col-span-2 sm:col-span-1 shadow-[0_0_20px_rgba(99,102,241,0.1)] flex flex-col justify-between"
           >
              <Layers className="w-5 h-5 text-indigo-400 mb-3" />
              <p className="text-2xl font-black text-indigo-300">{activeIntegrations}</p>
              <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest mt-1">Active Hooks</p>
           </motion.div>

        </div>

      </div>
    </div>
  );
}
