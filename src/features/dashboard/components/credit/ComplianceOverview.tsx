"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Activity } from "lucide-react";
import CredentialCard from "./CredentialCard";

interface Props {
  licenses: any[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function ComplianceOverview({ licenses = [], loading, onDelete }: Props) {
  if (loading) {
    return (
      <div className="bg-[#050505] rounded-[2rem] border border-white/5 p-24 shadow-sm flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-8 text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Synchronizing Registry...</p>
      </div>
    );
  }

  const activeCount = licenses.filter((l) => {
    const d = Math.ceil((new Date(l.expiryDate || l.date).getTime() - new Date().getTime()) / 86400000);
    return d > 30;
  }).length;

  return (
    <section className="space-y-8 mt-12 pt-12 border-t border-white/5">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-sm border border-indigo-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              Regulatory Overview
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Active Operational Credentials
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {activeCount === licenses.length ? "Integrity: Verified" : "Action Required"}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {licenses.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#050505] rounded-[3rem] border border-white/5 p-24 shadow-sm text-center flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none text-indigo-500">
              <Zap className="w-64 h-64" />
            </div>

            <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-10 ring-1 ring-inset ring-indigo-500/20">
              <ShieldCheck size={48} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Registry Offline</h3>
            <p className="text-slate-500 mt-4 max-w-sm font-medium leading-relaxed italic">
              "No active credentials synchronized. Initialize compliance monitoring to mitigate regulatory risks."
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {licenses.map((lic) => (
              <CredentialCard
                key={lic._id}
                license={lic}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
