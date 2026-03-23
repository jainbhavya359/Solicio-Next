"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";

export default function CapitalCTASection() {
  return (
    <section className="w-full mt-24 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 sm:p-16 relative overflow-hidden flex flex-col items-center text-center group"
      >
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
           <Search className="w-8 h-8 text-emerald-400" />
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter mb-6">
          Unlock Better <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Capital Decisions</span>
        </h2>
        
        <p className="text-slate-400 text-lg font-medium max-w-2xl mb-12">
          Leverage our advanced multi-layered Intelligence models to find the right funding matches and optimize your credit deployment today.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] text-emerald-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2">
            Optimize Funding Plan <ArrowRight className="w-4 h-4" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2">
            Explore Lending Options
          </button>
        </div>
      </motion.div>
    </section>
  );
}
