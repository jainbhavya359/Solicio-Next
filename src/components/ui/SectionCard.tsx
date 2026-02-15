"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
        </div>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition"
          >
            {actionLabel} →
          </button>
        )}
      </div>

      <div className="p-6">{children}</div>
    </motion.div>
  );
}
