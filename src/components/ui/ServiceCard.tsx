"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";

type ServiceCardProps = {
  img: string;
  title: string;
  description: string;
  to?: string;      // optional
  reverse?: boolean; // optional
};

export default function ServiceCard({
  img,
  title,
  description,
  to,
  reverse = false,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`grid items-center gap-12 md:grid-cols-[1fr_2fr] lg:gap-20 ${reverse ? "md:grid-cols-[2fr_1fr]" : ""
        } group font-outfit`}
    >
      {/* Visual / Image Container */}
      <div className={`relative ${reverse ? "md:order-last" : ""}`}>
        {/* Neural Accent Background */}
        <div className="absolute inset-0 bg-emerald-100/30 blur-[60px] rounded-full scale-75 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

        <div className="relative flex items-center justify-center w-full aspect-square max-w-[200px] mx-auto rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group-hover:shadow-emerald-200/50 transition-all duration-500 overflow-hidden ring-1 ring-inset ring-slate-100">
          <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
            <Sparkles className="w-12 h-12 rotate-12" />
          </div>

          <div className="relative z-10 p-8 transform group-hover:scale-110 transition-transform duration-500">
            <Image
              src={img}
              alt={title}
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-2xl text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100 mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
          Solicio Protocol
        </div>

        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tightest group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>

        <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
          {description}
        </p>

        {to && (
          <Link
            href={to}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 shadow-xl shadow-slate-900/20 hover:shadow-emerald-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Dashboard <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
