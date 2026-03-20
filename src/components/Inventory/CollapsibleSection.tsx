"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] overflow-hidden hover:border-white/20 transition-all duration-300">
      
      {/* Header — always visible, tap to expand */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 sm:p-8 text-left group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-white/90 transition-colors">
                {title}
              </h2>
              {badge && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:bg-white/10 group-hover:text-white transition-all"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Content — animated expand/collapse */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 sm:px-8 sm:pb-8 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
