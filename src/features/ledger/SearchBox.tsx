"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function UniversalSearchBox({
  placeholder,
  onSubmit,
  autoFocus,
}: {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 px-5 py-4 rounded-2xl
        bg-slate-50 border border-slate-200 shadow-2xl
        focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300"
    >
      <Search className="w-5 h-5 text-slate-500" />

      <input
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder || "Search ledger records…"}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        className="flex-1 bg-transparent outline-none
        text-black placeholder:text-slate-500 text-base font-medium"
      />

      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleSubmit}
          className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest
          bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95"
        >
          Search
        </motion.button>
      )}
    </motion.div>
  );
}
