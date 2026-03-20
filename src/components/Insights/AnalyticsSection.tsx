"use client";
import { motion } from "framer-motion";

export function AnalyticsSection({ 
  title, 
  icon, 
  subtitle, 
  colorClass, 
  children 
}: { 
  title: string, 
  icon: React.ReactNode, 
  subtitle: string, 
  colorClass: "emerald" | "blue" | "rose" | "amber", 
  children: React.ReactNode 
}) {
  
  const borderColors = {
     emerald: "border-emerald-500/20",
     blue: "border-blue-500/20",
     rose: "border-rose-500/20",
     amber: "border-amber-500/20"
  }
  
  const bgColors = {
     emerald: "bg-emerald-500/10",
     blue: "bg-blue-500/10",
     rose: "bg-rose-500/10",
     amber: "bg-amber-500/10"
  }

  const textColors = {
     emerald: "text-emerald-400",
     blue: "text-blue-400",
     rose: "text-rose-400",
     amber: "text-amber-400"
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-[1400px] mx-auto w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-10 mb-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-white/20 hover:shadow-[0_0_60px_rgba(16,185,129,0.05)] transition-all duration-500"
    >
       <div className="relative flex items-center justify-between mb-8 z-10 border-b border-white/5 pb-6">
         <div className="flex flex-col gap-3">
           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgColors[colorClass]} ${borderColors[colorClass]} ${textColors[colorClass]} text-[10px] font-bold uppercase tracking-[0.2em] w-fit shadow-[0_0_15px_rgba(255,255,255,0.02)]`}>
              {icon}
              {subtitle}
           </div>
           <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{title}</h2>
         </div>
       </div>

       <div className="relative z-10 w-full">
         {children}
       </div>
    </motion.div>
  )
}
