"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

interface FeatureProps {
  title: string;
  tag: string;
  description: string;
  bullets: string[];
  reverse?: boolean;
  accent: string; // e.g., "from-emerald-500 to-teal-500"
  href?: string;
  children: React.ReactNode;
}

export default function FeatureShowcase({ title, tag, description, bullets, reverse, accent, href, children }: FeatureProps) {
  return (
    <section className="py-24 overflow-hidden relative border-t border-white/5 bg-[#050505]">
      <div className={`max-w-[1300px] mx-auto px-6 xl:px-12 flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
        
        {/* TEXT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 space-y-8"
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-300">
            {tag}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            {title}
          </h2>
          
          <p className="text-lg text-[#A1A1AA] leading-relaxed max-w-lg">
            {description}
          </p>
          
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-white/10 to-transparent my-8" />
          
          <ul className="space-y-5">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                <span className="text-slate-200 font-medium text-[15px] md:text-base leading-snug">{bullet}</span>
              </li>
            ))}
          </ul>
          
          {href && (
            <div className="pt-6">
              <Link 
                href={href}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group/link outline outline-1 outline-white/10 hover:outline-white/20`}
              >
                <span className="relative z-10">Explore Module</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </motion.div>
        
        {/* VISUAL MOCKUP */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="flex-1 w-full"
        >
          <div className="relative aspect-square md:aspect-[4/3] w-full max-w-2xl mx-auto rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center p-6 md:p-12 group">
             {/* Dynamic Accent Glow */}
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[120px] opacity-10 group-hover:opacity-25 transition-opacity duration-1000 bg-gradient-to-br ${accent} rounded-full z-0`} />
             
             {/* Internal Glass Wrapper */}
             <div className="relative z-10 w-full h-full bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
               {children}
             </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
