"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface UniversalSearchBoxProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  debounceMs?: number;
  autoFocus?: boolean;
}

export default function UniversalSearchBox({
  placeholder = "Search...",
  onChange,
  onSubmit,
  debounceMs = 300,
  autoFocus = false,
}: UniversalSearchBoxProps) {
  const [value, setValue] = useState("");

  // 🔁 Debounced change emitter
  useEffect(() => {
    if (!onChange) return;

    const timer = setTimeout(() => {
      onChange(value.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onChange]);

  // ⌨️ Enter key submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(value.trim());
    }
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3
      rounded-2xl bg-black/40 border border-white/10
      focus-within:border-indigo-400
      hover:border-white/20
      transition"
    >
      <Search className="w-4 h-4 text-slate-400" />

      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none
        text-white placeholder:text-slate-500 text-sm"
      />

      {onSubmit && value && (
        <button
          onClick={() => onSubmit(value.trim())}
          className="text-xs px-3 py-1 rounded-full
          bg-indigo-500/20 text-indigo-400
          hover:bg-indigo-500/30 transition"
        >
          Search
        </button>
      )}
    </div>
  );
}
