"use client";

import { motion } from "framer-motion";
import { User, Shield, Compass, Layers, Sliders } from "lucide-react";

export type SettingsTab = 'profile' | 'security' | 'integrations' | 'preferences';

interface Props {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsSidebar({ activeTab, onTabChange }: Props) {
  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Compass, description: 'Business identity & tax details' },
    { id: 'security', label: 'Account & Security', icon: Shield, description: 'Authentication & sessions' },
    { id: 'integrations', label: 'Integrations', icon: Layers, description: 'External API connections' },
    { id: 'preferences', label: 'Preferences', icon: Sliders, description: 'UI & notification config' },
  ] as const;

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-2">
       {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
             <button
               key={tab.id}
               onClick={() => onTabChange(tab.id as SettingsTab)}
               className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group outline-none ${
                 isActive 
                   ? 'bg-white/5 border-white/10 shadow-sm' 
                   : 'bg-transparent hover:bg-white/[0.02] border border-transparent'
               }`}
             >
                {/* Active Indicator Line */}
                {isActive && (
                   <motion.div 
                     layoutId="settings-active-tab-line"
                     className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
                   />
                )}

                <div className={`p-2.5 rounded-xl border shrink-0 transition-colors duration-300 ${
                  isActive 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-[#0a0a0a] border-white/5 text-slate-500 group-hover:text-slate-300 group-hover:border-white/10'
                }`}>
                   <Icon className="w-5 h-5" />
                </div>

                <div>
                   <h3 className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                      {tab.label}
                   </h3>
                   <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">{tab.description}</p>
                </div>
             </button>
          )
       })}
    </aside>
  );
}
