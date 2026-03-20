"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

export default function FeaturesHero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-10 bg-[#050505]">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/15 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-repeat pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4" /> Seamless Ecosystem
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-white mb-8 max-w-5xl leading-[1.05]"
        >
          Unified modules built for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Scale and Velocity.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-[#A1A1AA] max-w-3xl font-light mb-16 leading-relaxed"
        >
          A synchronized tactical suite designed to automate logistics, clarify financial metadata, and accelerate your MSME growth entirely inside one platform.
        </motion.p>
        
        {/* Abstract Floating UI Hero Element */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 1 }}
           className="w-full max-w-4xl aspect-[21/9] md:aspect-[21/8] bg-[#0A0A0A] rounded-2xl md:rounded-[2rem] border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.05)] overflow-hidden relative flex items-center justify-center p-8 lg:p-12 group"
        >
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none z-20" />
          
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent top-1/2 left-0 -translate-y-1/2" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent left-1/2 top-0 -translate-x-1/2" />
          
          <div className="relative z-10 bg-[#111] border border-white/10 w-24 h-24 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-700">
             <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-32 h-20 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md" 
          />
          <motion.div 
            animate={{ y: [10, -10, 10] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-40 h-24 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md" 
          />
        </motion.div>
      </div>
      
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1.2, duration: 1 }}
         className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
         <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#71717A]">Explore Features</span>
         <ArrowDown className="w-4 h-4 text-[#71717A] animate-bounce" />
      </motion.div>
    </section>
  )
}
