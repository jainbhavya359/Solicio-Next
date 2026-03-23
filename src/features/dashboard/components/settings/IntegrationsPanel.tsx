"use client";

import { motion } from "framer-motion";
import { Plug, Zap, ExternalLink, Activity, ArrowRight } from "lucide-react";

export default function IntegrationsPanel() {
  
  const integrations = [
      {
          id: 'google',
          name: 'Google Workspace',
          description: 'Sink your data with Docs and Drive automatically.',
          icon: <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-xs">G</div>,
          status: 'connected',
          lastSync: '2 hrs ago'
      },
      {
          id: 'stripe',
          name: 'Stripe Billing',
          description: 'Route real-time transactions and net profit directly into the engine.',
          icon: <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center font-black text-white text-xs">S</div>,
          status: 'disconnected',
          lastSync: 'Never'
      },
      {
          id: 'slack',
          name: 'Slack Alerts',
          description: 'Push critical Danger priority decisions to your #ops channel.',
          icon: <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center font-black text-white text-xs">#</div>,
          status: 'disconnected',
          lastSync: 'Never'
      }
  ];

  return (
    <div className="space-y-6">
        
        {/* Context Head */}
        <div className="bg-[#050505] rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3">
                   <Plug className="w-3.5 h-3.5" /> Webhooks & Events
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">External System Connectors</h2>
                <p className="text-sm text-slate-400 font-medium mt-2">Scale the engine by piping outside data inwards. We actively secure these bridges with end-to-end encryption.</p>
            </div>
            
            <button className="relative z-10 shrink-0 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-colors flex items-center gap-2">
               <Zap className="w-4 h-4 text-emerald-400" /> Browse Catalog
            </button>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((app) => (
               <div key={app.id} className="bg-[#050505] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-colors flex flex-col justify-between">
                  <div>
                      <div className="flex items-start justify-between mb-4">
                         <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                            {app.icon}
                         </div>
                         {app.status === 'connected' ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5">
                               <Activity className="w-3 h-3" /> Active
                            </span>
                         ) : (
                            <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg">
                               Inactive
                            </span>
                         )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-1.5">{app.name}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{app.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sync: {app.lastSync}</p>
                      
                      <button className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${app.status === 'connected' ? 'text-rose-400 hover:text-rose-300' : 'text-white hover:text-emerald-400'}`}>
                         {app.status === 'connected' ? 'Disconnect' : 'Connect'}
                         {app.status !== 'connected' && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                  </div>
               </div>
            ))}
        </div>

    </div>
  );
}
