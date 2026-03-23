"use client";

import { Search, Plus, Filter } from "lucide-react";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  filterType: "All" | "Customer" | "Supplier";
  setFilterType: (v: "All" | "Customer" | "Supplier") => void;
  sortBy: "Recent" | "HighValue" | "Overdue";
  setSortBy: (v: "Recent" | "HighValue" | "Overdue") => void;
  onNew: () => void;
}

export default function PartiesFilterBar({ search, setSearch, filterType, setFilterType, sortBy, setSortBy, onNew }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#050505] border border-white/5 rounded-2xl p-4 mt-8 relative z-20">
      
      {/* Search Input */}
      <div className="relative w-full lg:w-[400px] group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search corporate directory..."
          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-bold text-white placeholder:text-slate-500 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
         {/* Category Filter */}
         <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
            {["All", "Customer", "Supplier"].map((type) => (
               <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterType === type ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
               >
                  {type}
               </button>
            ))}
         </div>

         {/* Sort By */}
         <div className="relative group">
             <div className="flex items-center gap-2 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">
                <Filter size={14} />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent outline-none appearance-none cursor-pointer pr-4 hover:text-white transition-colors"
                >
                   <option value="Recent" className="bg-[#0a0a0a]">Sort: Last Active</option>
                   <option value="HighValue" className="bg-[#0a0a0a]">Sort: High Value</option>
                   <option value="Overdue" className="bg-[#0a0a0a]">Sort: Overdue Risk</option>
                </select>
             </div>
         </div>

         {/* New Contact CTA */}
         <button
            onClick={onNew}
            className="h-12 px-5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)] flex items-center gap-2 ml-auto lg:ml-0"
         >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Party</span>
         </button>
      </div>

    </div>
  );
}
