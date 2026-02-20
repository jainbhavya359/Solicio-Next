"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value.trim());
    }
  };

  const handleClear = () => {
    setValue("");
    onSubmit?.(""); // Optional: clear results on clear
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative group flex items-center gap-4 px-6 py-4 rounded-2xl
        transition-all duration-300 ease-out
        ${isFocused
          ? "bg-white shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/50"
          : "bg-white/80 hover:bg-white shadow-sm hover:shadow-md border border-slate-200/60 hover:border-emerald-500/30"
        }
      `}
    >
      <Search
        className={`w-5 h-5 transition-colors duration-300 ${isFocused ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500/70"}`}
      />

      <input
        ref={inputRef}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || "Search ledger records…"}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-base font-medium"
      />

      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="p-1 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <X size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="h-6 w-px bg-slate-200 mx-2" />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className={`
          px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
          ${value
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
            : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }
        `}
        disabled={!value}
      >
        Search
      </motion.button>
    </motion.div>
  );
}
