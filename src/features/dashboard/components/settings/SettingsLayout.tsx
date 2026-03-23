"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsHero from "./SettingsHero";
import SettingsSidebar, { SettingsTab } from "./SettingsSidebar";
import CompanyProfilePanel from "./CompanyProfilePanel";
import AccountSecurityPanel from "./AccountSecurityPanel";
import IntegrationsPanel from "./IntegrationsPanel";

interface Props {
  email: string;
}

export default function SettingsLayout({ email }: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Derive mock metrics for Hero based on real interactions if needed, hardcoded to display visual logic for now
  const profileCompleteness = 85; 
  const securityScore = 95;

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto relative z-10 mb-20 overflow-x-hidden">
      
      {/* Dynamic Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <SettingsHero 
          profileCompleteness={profileCompleteness} 
          securityScore={securityScore}
          activeIntegrations={1}
        />
      </motion.div>

      {/* Control Navigation & Editor Grid */}
      <div className="flex flex-col lg:flex-row gap-8 mt-4">
         
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
         </motion.div>

         <motion.div 
           className="flex-1 min-w-0"
           initial={{ opacity: 0, x: 20 }} 
           animate={{ opacity: 1, x: 0 }} 
           transition={{ duration: 0.5, delay: 0.2 }}
         >
            <AnimatePresence mode="wait">
               {activeTab === 'profile' && (
                 <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <CompanyProfilePanel email={email} />
                 </motion.div>
               )}

               {activeTab === 'security' && (
                 <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <AccountSecurityPanel />
                 </motion.div>
               )}

               {activeTab === 'integrations' && (
                 <motion.div key="integrations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <IntegrationsPanel />
                 </motion.div>
               )}

               {activeTab === 'preferences' && (
                 <motion.div key="preferences" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <div className="bg-[#050505] rounded-[2rem] border border-white/5 p-12 flex flex-col items-center justify-center text-center">
                       <h3 className="text-xl font-bold text-white mb-2">Preferences Locked</h3>
                       <p className="text-sm text-slate-500 max-w-sm">Application-wide UI and notification limits are currently managed centrally via the super-admin configurations.</p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </motion.div>
         
      </div>

    </div>
  );
}
