"use client";
import React, { useState, useEffect } from "react";
import { animate, motion, useMotionValue, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, Zap } from "lucide-react";
import { scores_rate } from "../../../../utils/store";

function AnimatedScore({ value, className = "" }: { value: number; className?: string }) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: [0.23, 1, 0.32, 1],
    });

    const unsub = motionValue.on("change", (v) => setDisplay(Math.round(v)));
    return () => { controls.stop(); unsub(); };
  }, [value, motionValue]);

  return <span className={`text-7xl font-extrabold tracking-tightest ${className}`}>{display}</span>;
}

export default function OutcomePanel({ show, score, tierIndex }: { show: boolean, score: number, tierIndex: number }) {
  const min = 300;
  const max = 850;
  const radius = 90;
  const stroke = 12;
  const circumference = Math.PI * radius;

  const isUnrated = !score || score === 0;
  const validScore = Math.max(min, Math.min(score, max));
  const progress = isUnrated ? 0 : (validScore - min) / (max - min);
  const dashOffset = circumference * (1 - progress);

  const getScoreDetails = () => {
    if (isUnrated) return { label: "Unrated", color: "#64748b", text: "text-slate-500", bg: "bg-slate-800", feedback: "Start building your credit history to unlock growth capital." };
    if (score < 600) return { label: "Needs Work", color: "#f43f5e", text: "text-rose-500", bg: "bg-rose-500/10", feedback: "High risk profile. Focus on stabilizing debt obligations before seeking capital." };
    if (score < 700) return { label: "Fair", color: "#f59e0b", text: "text-amber-500", bg: "bg-amber-500/10", feedback: "Balanced profile. Opportunities for improvement exist to secure optimal rates." };
    if (score < 750) return { label: "Good", color: "#22d3ee", text: "text-cyan-400", bg: "bg-cyan-500/10", feedback: "Solid capital health. You qualify for standard rates and multiple lending options." };
    return { label: "Excellent", color: "#10b981", text: "text-emerald-500", bg: "bg-emerald-500/10", feedback: "Optimal credit strength. Primed for maximum leverage and the lowest interest rates." };
  };

  const { label, color, text, bg, feedback } = getScoreDetails();

  return (
    <div className="h-full w-full min-w-0">
      <AnimatePresence mode="wait">
        {show ? (
          <motion.div
            key="gauge"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full flex flex-col w-full min-w-0 gap-6"
          >
            {/* Main AI Explanation & Radial Panel */}
            <div className="bg-[#0A0A0A] rounded-3xl border border-white/10 p-8 flex flex-col relative overflow-hidden group flex-grow shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {/* Ambient Glow tied to score tier */}
              <div 
                className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000"
                style={{ background: color }}
              />

              <div className="relative z-10 w-full flex flex-col items-center h-full">
                <div className="flex items-center justify-between w-full mb-8">
                   <div className="flex items-center gap-3">
                     <div className={`p-2.5 rounded-xl ${bg} ${text} border border-white/5`}>
                       <Zap className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Projected Outcome</h3>
                       <p className="text-sm font-bold text-white uppercase tracking-widest">Simulation Result</p>
                     </div>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 ${bg} ${text}`}>
                      {label}
                   </div>
                </div>

                {/* Animated Radial Chart */}
                <div className="relative mt-4 flex flex-col items-center w-full max-w-[320px] shrink-0">
                  <svg viewBox="0 0 220 130" className="w-full overflow-visible">
                    {/* Track */}
                    <path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="#1a1a1a" strokeWidth={stroke} strokeLinecap="round" />
                    {/* Animated Fill */}
                    <motion.path
                      d="M20 110 A90 90 0 0 1 200 110"
                      fill="none"
                      stroke={color}
                      strokeWidth={stroke}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: dashOffset }}
                      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                      style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
                    />
                    {/* Score label centered inside the arc bowl */}
                    <foreignObject x="10" y="45" width="200" height="80">
                      <div className="w-full h-full flex flex-col items-center justify-center pt-2">
                        {isUnrated ? (
                          <span className="text-5xl font-extrabold text-slate-700 leading-none">---</span>
                        ) : (
                          <AnimatedScore value={score} className="text-white drop-shadow-lg leading-none" />
                        )}
                      </div>
                    </foreignObject>
                  </svg>
                  <div className="flex justify-between w-[90%] -mt-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <span>300</span>
                    <span>850</span>
                  </div>
                </div>

                {/* AI Explanation Text Box */}
                <div className="mt-auto pt-8 w-full">
                  <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 hover:border-white/20 transition-all">
                    <ShieldCheck className={`w-5 h-5 mt-0.5 shrink-0 ${text}`} />
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">AI Capital Analysis</h4>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed">
                        {feedback}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interest Rate Guidance Strip */}
            <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/10 w-full min-w-0 flex items-center gap-5 hover:border-cyan-500/30 transition-all group">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Estimated Base Rate Adjustment</p>
                <p className="text-white text-lg font-bold leading-relaxed">
                  {scores_rate[tierIndex] || "Run simulation to calculate Base Rate"}
                </p>
              </div>
            </div>

          </motion.div>
        ) : (
          <div className="h-full min-h-[500px] border border-dashed border-white/10 rounded-3xl bg-[#0A0A0A] flex flex-col items-center justify-center text-slate-500 gap-6 w-full min-w-0">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
               <Activity className="w-10 h-10 opacity-40" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Awaiting Neural Link Configuration</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
