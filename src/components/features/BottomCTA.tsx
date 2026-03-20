"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BottomCTA() {
  return (
    <section className="relative py-32 bg-[#050505] overflow-hidden flex justify-center px-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/20 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col items-center text-center p-12 md:p-20 group"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none mix-blend-screen" />
        
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-8 z-10">
          Tactical Synchronization
        </div>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 z-10 leading-[1.1]">
          One Neural Hub. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Full Control.</span>
        </h2>

        <p className="text-lg text-[#A1A1AA] max-w-xl mb-12 z-10">
          Experience full operational parity across all modules. Synchronized metadata flows seamlessly between logistics, capital, and intelligence hubs.
        </p>

        <Link
          href="/signup"
          className="relative z-10 group/btn flex items-center justify-center gap-2 px-10 py-5 bg-emerald-500 text-black font-bold text-lg rounded-full overflow-hidden transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10">Explore Full Suite</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
