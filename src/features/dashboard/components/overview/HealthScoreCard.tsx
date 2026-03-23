"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface HealthData {
  healthScore: number;
  status: string;
  breakdown: Record<string, number | string>;
}

export default function HealthScoreCard({ data }: { data?: HealthData }) {
  if (!data) return null;

  const score = data.healthScore;
  let statusColor = "text-emerald-400";
  let statusBg = "bg-emerald-400/10 border-emerald-400/20";
  let glowColor = "bg-emerald-500";
  let strokeColor = "#34d399"; // emerald-400

  if (score < 40) {
    statusColor = "text-rose-400";
    statusBg = "bg-rose-400/10 border-rose-400/20";
    glowColor = "bg-rose-500";
    strokeColor = "#fb7185"; // rose-400
  } else if (score < 70) {
    statusColor = "text-amber-400";
    statusBg = "bg-amber-400/10 border-amber-400/20";
    glowColor = "bg-amber-500";
    strokeColor = "#fbbf24"; // amber-400
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-10 ${glowColor} pointer-events-none`} />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className={`p-2.5 rounded-xl border ${statusBg} ${statusColor}`}>
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Health</h2>
          <p className="text-sm text-slate-400">Real-time diagnostic overview</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10">
        {/* Radial Score */}
        <div className="relative flex-shrink-0">
          <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center relative">
            {/* Inner Glow */}
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${glowColor}`} />
            
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" stroke="#1f2937" strokeWidth="10" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={strokeColor}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - score / 100)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-white tracking-tighter">
                {score}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 ${statusColor}`}>
                {score >= 70 ? "Healthy" : score >= 40 ? "Warning" : "Critical"}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Status:</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full border ${statusBg} ${statusColor}`}>
              {data.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(data.breakdown).map(([key, value]) => (
              <div key={key} className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {key.replace("Score", "")}
                </span>
                <span className="text-lg font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
