"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import LedgerFilterBar from "./LedgerFilterBar";
import TransactionRow from "./TransactionRow";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface Props {
  rows: any[];
  hasMore: boolean;
  page: number;
  setPage: (p: number | ((p: number) => number)) => void;
  loading: boolean;
  onReverseTarget: (row: any) => void;
}

export default function TransactionFeed({ rows = [], hasMore, page, setPage, loading, onReverseTarget }: Props) {
  const [filter, setFilter] = useState<"All" | "Credit" | "Debit">("All");
  const [searchTerm, setSearchTerm] = useState("");

  const reversedMap = useMemo(() => {
    const s = new Set<string>();
    rows.forEach(r => r.reversedEntryId && s.add(r.reversedEntryId));
    return s;
  }, [rows]);

  const filteredRows = rows.filter(r => {
    if (filter === "Credit" && r.voucherType !== "Sale") return false;
    if (filter === "Debit" && r.voucherType !== "Purchase") return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return r.itemName.toLowerCase().includes(q) || 
             r.partyName.toLowerCase().includes(q) || 
             r.voucherNo.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col bg-[#050505] rounded-3xl border border-white/10 shadow-2xl overflow-hidden mt-6">
      <div className="p-6 border-b border-white/10 bg-white/5">
        <h3 className="text-xl font-bold text-white mb-4">Transaction Feed</h3>
        <LedgerFilterBar 
          filter={filter} 
          setFilter={setFilter} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </div>

      <div className="flex-1 w-full min-h-[400px] overflow-hidden p-6 relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-sm z-10"
            >
              <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin" />
              <p className="mt-4 text-[10px] font-black tracking-widest uppercase text-slate-500">Syncing Feed...</p>
            </motion.div>
          ) : filteredRows.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 opacity-50"
            >
               <Search className="w-16 h-16 text-slate-600 mb-4" />
               <p className="text-lg font-bold text-white">No Transactions Match Filter</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="flex flex-col gap-3"
            >
              {filteredRows.map(row => {
                const inactive = row.isReversal || reversedMap.has(row._id);
                return (
                  <TransactionRow 
                    key={row._id} 
                    row={row} 
                    inactive={inactive} 
                    onReverse={onReverseTarget} 
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(p => p - 1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-xs font-bold text-slate-300 uppercase tracking-widest hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-xs font-black text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5 tracking-[0.2em]">
          PAGE {page}
        </span>
        <button
          disabled={!hasMore || loading}
          onClick={() => setPage(p => p + 1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-xs font-bold text-white uppercase tracking-widest hover:bg-white/10 hover:border-indigo-500/30 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
