"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { DashboardData } from "../types/dashboard";

import AlertsHero from "../components/alerts/AlertsHero";
import PriorityScoreStrip from "../components/alerts/PriorityScoreStrip";
import DecisionStack from "../components/alerts/DecisionStack";
import DecisionFeed from "../components/alerts/DecisionFeed";
import SlowMovingStockContainer from "../../Insights/SlowMovingStockContainer";

interface Props {
  dashboardData: DashboardData | null;
  email: string;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AlertsSection({ dashboardData, email }: Props) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [healthSignals, setHealthSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync the AI Engine remotely
  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/alerts?email=${email}`)
      .then((res) => {
        setAlerts(res.data.alerts || []);
        setHealthSignals(res.data.healthSignals || []);
      })
      .finally(() => setLoading(false));
  }, [email]);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto relative z-10 mb-10 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {loading ? (
           <motion.div 
             key="loading"
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="bg-[#050505] rounded-[2rem] border border-white/5 p-24 shadow-sm flex flex-col items-center justify-center"
           >
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                 <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="mt-8 text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Synching Neural Engine...</p>
           </motion.div>
        ) : (
           <motion.div
             key="engine"
             variants={staggerContainer}
             initial="hidden"
             animate="visible"
             className="space-y-6"
           >
              {/* 1. Hero Block */}
              <AlertsHero alerts={alerts} />
              
              {/* 2. Systems Diagnostics Strip */}
              <PriorityScoreStrip alerts={alerts} healthSignals={healthSignals} />

              {/* Legacy Requirement: Preserve Stock Signals */}
              {dashboardData?.slowMoving && dashboardData.slowMoving.length > 0 && (
                 <div className="bg-[#050505] rounded-2xl border border-white/5 p-4 sm:p-6">
                   <SlowMovingStockContainer data={dashboardData.slowMoving} />
                 </div>
              )}

              {/* 3. Top Execution Decisions */}
              <div className="mt-4">
                 <DecisionStack alerts={alerts} />
              </div>

              {/* 4. Complete Action Flow Map */}
              <div className="mt-8">
                 <DecisionFeed alerts={alerts} />
              </div>

           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
