"use client";

import { motion } from "framer-motion";
import { Filter, Search, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface Props {
  filter: "All" | "Credit" | "Debit";
  setFilter: (val: "All" | "Credit" | "Debit") => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export default function LedgerFilterBar({ filter, setFilter, searchTerm, setSearchTerm }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a0a0a] border border-white/10 p-2 sm:p-4 rounded-3xl mb-4">
      
      {/* Search Bar */}
      <div className="relative w-full md:w-1/3">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search product, voucher, party..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 md:hidden">
          <Filter size={18} />
        </div>
        
        <FilterBtn 
          label="All Activity" 
          active={filter === "All"} 
          onClick={() => setFilter("All")} 
        />
        <FilterBtn 
          label="Inbound (Debit)" 
          active={filter === "Debit"} 
          onClick={() => setFilter("Debit")} 
          icon={<ArrowDownRight size={14} />} 
          color="emerald"
        />
        <FilterBtn 
          label="Outbound (Credit)" 
          active={filter === "Credit"} 
          onClick={() => setFilter("Credit")} 
          icon={<ArrowUpRight size={14} />} 
          color="rose"
        />
      </div>
    </div>
  );
}

function FilterBtn({ label, active, onClick, icon, color }: any) {
  const activeColor = 
    color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
    color === "rose" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
    "bg-white/10 text-white border-white/20";

  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all
        ${active ? activeColor : "bg-transparent text-slate-500 border-transparent hover:bg-white/5"}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
