"use client";

import { motion } from "framer-motion";

export default function SocialProofDivider() {
  return (
    <section className="py-20 bg-[#050505] border-y border-white/5 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center pt-8 md:pt-0 px-4"
        >
          <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">10,000+</div>
          <div className="text-sm uppercase tracking-[0.2em] font-medium text-emerald-500">Businesses Powered</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center text-center pt-8 md:pt-0 px-4"
        >
          <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">₹5B+</div>
          <div className="text-sm uppercase tracking-[0.2em] font-medium text-cyan-500">Transactions Handled</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center text-center pt-8 md:pt-0 px-4"
        >
          <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">99.9%</div>
          <div className="text-sm uppercase tracking-[0.2em] font-medium text-emerald-500">System Uptime</div>
        </motion.div>

      </div>
    </section>
  );
}
