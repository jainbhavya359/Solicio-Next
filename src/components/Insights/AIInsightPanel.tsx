"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AIInsightPanel({ text }: { text: React.ReactNode }) {
  return (
     <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-[1400px] mx-auto my-12 px-6 relative z-10"
     >
        <div className="w-full p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.05)] group">
           <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex flex-shrink-0 items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
             <Sparkles className="w-5 h-5" />
           </div>
           <div>
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5">Synapse Intelligence</div>
              <p className="text-slate-300 font-medium text-sm md:text-base leading-relaxed">{text}</p>
           </div>
        </div>
     </motion.div>
  )
}
