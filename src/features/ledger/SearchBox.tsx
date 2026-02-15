"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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
    onSubmit?.(value.trim());
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl
      bg-slate-900 border border-slate-700 shadow-sm
      focus-within:border-indigo-400 transition"
    >
      <Search className="w-4 h-4 text-slate-400" />

      <input
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder || "Search…"}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        className="flex-1 bg-transparent outline-none
        text-slate-100 placeholder:text-slate-400 text-sm"
      />

      {value && (
        <button
          onClick={handleSubmit}
          className="px-4 py-1.5 rounded-md text-xs
          bg-indigo-600 text-white hover:bg-indigo-500 transition"
        >
          Search
        </button>
      )}
    </div>
  );
}
