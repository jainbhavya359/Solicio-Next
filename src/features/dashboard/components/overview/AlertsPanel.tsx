"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";

interface Alert {
  type: "danger" | "warning" | "info" | string;
  message: string;
  suggestion: string;
}

export default function AlertsPanel({ alerts }: { alerts?: Alert[] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Requires Attention</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
          {alerts.length} Issues
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((a, i) => {
          const isDanger = a.type === "danger";
          const bgColor = isDanger ? "bg-rose-500/10 hover:bg-rose-500/20" : "bg-amber-500/10 hover:bg-amber-500/20";
          const borderColor = isDanger ? "border-rose-500/20" : "border-amber-500/20";
          const iconColor = isDanger ? "text-rose-400" : "text-amber-400";
          const iconBg = isDanger ? "bg-rose-500/20" : "bg-amber-500/20";

          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              key={i}
              className={`group flex items-start sm:items-center gap-4 p-5 rounded-2xl border ${bgColor} ${borderColor} backdrop-blur-sm transition-all cursor-pointer`}
            >
              <div className={`mt-0.5 sm:mt-0 p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <p className="font-semibold text-white/90 text-sm">{a.message}</p>
                <p className="text-xs text-slate-400 mt-1">{a.suggestion}</p>
              </div>

              <div className={`p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity ${iconColor}`}>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
