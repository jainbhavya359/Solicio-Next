"use client";
import { useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Sparkles, Activity, CheckCircle2 } from "lucide-react";
import { useCreditStore } from "../../../../store/useCreditStore";

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
    const unsub = motionValue.on("change", (v) => setDisplay(Math.round(v)));
    return () => { controls.stop(); unsub(); };
  }, [value, motionValue]);

  return <span>{display}</span>;
}

export default function CapitalHero() {
  const { score, index, show } = useCreditStore();
  const isUnrated = !show || !score || score === 0;
  
  const riskLevels = ["Critical Risk", "High Risk", "Balanced", "Low Risk", "Minimal Risk"];
  const probabilityLevels = ["12%", "34%", "68%", "89%", "98%"];
  const colors = ["text-rose-500", "text-amber-500", "text-blue-400", "text-emerald-400", "text-emerald-500"];
  const metrics = {
    risk: isUnrated ? "Analyzing..." : riskLevels[index],
    prob: isUnrated ? "---" : probabilityLevels[index],
    color: isUnrated ? "text-slate-400" : colors[index],
  };

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden pt-6 pb-12 w-full">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-500/15 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center w-full">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4" /> Capital Intelligence Engine
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-[4.5rem] font-bold tracking-tighter text-white mb-6 max-w-4xl leading-[1.05]"
        >
          Optimize your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">capital deployment.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl font-light mb-12 leading-relaxed"
        >
          A synchronized tactical suite designed to clarify financial metadata, predict approval likelihood, and accelerate your growth strategy in real time.
        </motion.p>
        
        {/* Floating UI Hero Element showing Live Score */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 1 }}
           className="w-full max-w-3xl aspect-[21/10] bg-[#0A0A0A] rounded-[2rem] border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.05)] overflow-hidden relative flex flex-col items-center justify-center p-8 group"
        >
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none z-20" />
          
          {/* Grid lines */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent top-1/2 left-0 -translate-y-1/2" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent left-1/2 top-0 -translate-x-1/2" />

          {/* Core Visual Display */}
          <div className="relative z-10 flex flex-col items-center">
             <div className="relative flex items-center justify-center w-32 h-32 rounded-full border border-white/10 bg-[#111] shadow-[0_0_50px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-700 mb-8 mt-2">
               <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500/40 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
               <div className="absolute inset-2 rounded-full border-[2px] border-dashed border-cyan-500/30 animate-[spin_6s_linear_infinite_reverse]" />
               <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">Live Score</span>
                  <span className={`text-4xl font-extrabold ${metrics.color} drop-shadow-md`}>
                    {isUnrated ? "---" : <AnimatedNumber value={score} />}
                  </span>
               </div>
             </div>

             <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-slate-300 backdrop-blur-md">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Risk Level: <span className="text-white">{metrics.risk}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-slate-300 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Approval: <span className="text-white">{metrics.prob}</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
