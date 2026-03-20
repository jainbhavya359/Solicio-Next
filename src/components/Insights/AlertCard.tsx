"use client";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function AlertCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-[1px] rounded-3xl bg-gradient-to-r from-amber-500/40 to-orange-600/40 max-w-5xl mx-auto w-full shadow-[0_0_60px_rgba(245,158,11,0.1)] mb-12"
    >
       <div className="rounded-[23px] bg-[#0A0A0A] p-6 md:p-10 w-full relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border border-amber-500/10">
          <div className="absolute top-0 right-0 w-[500px] h-full bg-amber-500/10 blur-[100px] pointer-events-none" />
          
          <div className="flex-1 space-y-4 relative z-10 w-full">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,158,11,0.2)]">
               <AlertCircle className="w-3.5 h-3.5" /> Priority Alert
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dynamic Stock Alerts</h2>
             <p className="text-[#A1A1AA] leading-relaxed text-sm md:text-base max-w-sm">
               Vital inventory signals demanding immediate logistical intervention to prevent out-of-stock scenarios.
             </p>
          </div>
          
          <div className="flex-[1.5] w-full relative z-10">
             {children}
          </div>
       </div>
    </motion.div>
  )
}
