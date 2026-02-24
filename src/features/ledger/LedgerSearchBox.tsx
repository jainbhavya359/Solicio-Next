"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UniversalSearchBox from "./SearchBox";
import ConfirmReversalModal from "./ConfirmReversal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  History,
  Package,
  User,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Hash,
  ShoppingBag,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import Link from "next/link";

type LedgerRow = {
  _id: string;
  date: string;
  voucherType: string;
  partyName: string;
  partyType: string;
  voucherNo: string;
  itemName: string;
  unit: string;
  debitQty: number;
  creditQty: number;
  isReversal: boolean;
  reversedEntryId?: string | null;
};

const PAGE_SIZE = 10;

export default function LedgerSearchBox({ email }: { email: string }) {
  const [allResults, setAllResults] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  /* pagination */
  const [page, setPage] = useState(1);

  /* reversal */
  const [reverseTarget, setReverseTarget] = useState<LedgerRow | null>(null);
  const [reversing, setReversing] = useState(false);

  /* reversed map */
  const reversedMap = useMemo(() => {
    const s = new Set<string>();
    allResults.forEach(r => r.reversedEntryId && s.add(r.reversedEntryId));
    return s;
  }, [allResults]);

  /* -------------------- SEARCH -------------------- */
  const handleSearch = async (q: string) => {
    if (!q) {
      setAllResults([]);
      setQuery("");
      setPage(1);
      return;
    }

    setQuery(q);
    setLoading(true);
    setPage(1);

    try {
      const { data } = await axios.post("/api/search", {
        email,
        query: q,
      });

      setAllResults(data.results || []);
    } catch {
      toast.error("Search failed");
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- PAGINATED VIEW -------------------- */
  const totalPages = Math.ceil(allResults.length / PAGE_SIZE);

  const visibleResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allResults.slice(start, start + PAGE_SIZE);
  }, [allResults, page]);

  /* -------------------- REVERSAL -------------------- */
  const confirmReversal = async () => {
    if (!reverseTarget) return;

    try {
      setReversing(true);
      await axios.post("/api/ledger/reverse", {
        ledgerId: reverseTarget._id,
        reason: "Manual reversal",
      });

      toast.success("Ledger entry reversed");
      setReverseTarget(null);

      // 🔁 re-run same search
      handleSearch(query);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to reverse entry");
    } finally {
      setReversing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* SEARCH HEADER */}
      {/* SEARCH HEADER */}
      <div className="w-full">
        <UniversalSearchBox
          placeholder="Search items, parties, or voucher numbers…"
          onSubmit={handleSearch}
          autoFocus={false}
        />
      </div>

      <AnimatePresence mode="wait">
        {query && !loading && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4"
          >
            <div className="p-1 px-3 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
              Results
            </div>
            <p className="text-sm font-bold text-slate-500">
              Found <span className="text-slate-900">{allResults.length}</span> matches for <span className="text-emerald-600">“{query}”</span>
            </p>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning ledger...</p>
          </motion.div>
        ) : query && visibleResults.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-50 text-emerald-300 flex items-center justify-center mb-6">
              <Search size={40} />
            </div>
            <p className="text-slate-900 font-bold text-xl tracking-tight">No records found</p>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">We couldn't find any ledger entries matching your search criteria.</p>
          </motion.div>
        ) : visibleResults.length > 0 ? (
          <motion.div
            key="results"
            className="space-y-6"
          >
            <div className="rounded-2xl sm:rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="w-full">
                <div className="w-full sm:min-w-[1200px] p-0 sm:p-6">
                  {/* HEAD */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 mb-4">
                    <div className="col-span-1">Date</div>
                    <div className="col-span-3">Product Information</div>
                    <div className="col-span-2">Party Details</div>
                    <div className="col-span-1">Type</div>
                    <div className="col-span-1 text-right">Debit</div>
                    <div className="col-span-1 text-right">Credit</div>
                    <div className="col-span-2 text-center">Reference</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>

                  {/* ROWS */}
                  <motion.div
                    key={page}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } }
                    }}
                    className="space-y-3 p-4 sm:p-0"
                  >
                    {visibleResults.map(row => {
                      const inactive = row.isReversal || reversedMap.has(row._id);

                      return (
                        <motion.div
                          key={row._id}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          className={`
                            relative overflow-hidden transition-all
                            sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6 sm:py-4 sm:rounded-2xl sm:border
                            rounded-xl border p-4 flex flex-col gap-3
                            ${inactive ? "bg-slate-50 opacity-60 grayscale grayscale-[0.8]" : "bg-white border-slate-100 hover:border-emerald-100 hover:shadow-md group"}
                          `}
                        >
                          {/* Mobile Header Row */}
                          <div className="flex justify-between items-start sm:hidden">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{row.date.slice(0, 10)}</span>
                              <span className="text-[10px] font-medium text-slate-400">Transaction Date</span>
                            </div>
                            <div className={`inline-flex px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                            ${row.voucherType === "Purchase" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}
                          `}>
                              {row.voucherType}
                            </div>
                          </div>

                          <div className="col-span-1 font-bold text-xs text-slate-900 uppercase hidden sm:block">
                            {row.date.slice(0, 10)}
                          </div>

                          <div className="col-span-3 w-full sm:w-auto">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className={`p-2 rounded-xl bg-slate-50 text-slate-400 ${!inactive && "group-hover:bg-emerald-50 group-hover:text-emerald-600"} transition-colors hidden sm:block`}>
                                <Package size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 leading-none truncate">{row.itemName}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.unit}</p>
                                  <span className="text-slate-300 text-[10px] sm:hidden">•</span>
                                  <p className="text-[10px] font-bold text-slate-600 truncate sm:hidden">{row.partyName || "General Store"}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2 text-sm hidden sm:block">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              <p className="font-bold text-slate-700">{row.partyName || "General Store"}</p>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3.5 mt-0.5">{row.partyType || "Customer"}</p>
                          </div>

                          <div className="col-span-1 hidden sm:block">
                            <div className={`inline-flex px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                            ${row.voucherType === "Purchase" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}
                          `}>
                              {row.voucherType}
                            </div>
                          </div>

                          {/* Mobile: Financials Row */}
                          <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50 sm:hidden">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</span>
                              <span className={`text-sm font-black ${row.debitQty ? "text-emerald-600" : "text-rose-600"}`}>
                                {row.debitQty ? `+${row.debitQty}` : `-${row.creditQty}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-end mr-2">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ref</span>
                                <span className="text-xs font-mono font-bold text-slate-500">{row.voucherNo}</span>
                              </div>
                              <Link
                                href={row.voucherType === "Sale" ? `/invoice/${row.voucherNo}` : `/bill/${row.voucherNo}`}
                                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                              >
                                <Eye size={16} />
                              </Link>
                            </div>
                          </div>

                          <div className="col-span-1 text-right font-black text-sm text-emerald-600 hidden sm:block">
                            {row.debitQty ? `+${row.debitQty}` : "—"}
                          </div>

                          <div className="col-span-1 text-right font-black text-sm text-rose-600 hidden sm:block">
                            {row.creditQty ? `-${row.creditQty}` : "—"}
                          </div>

                          <div className="col-span-2 text-center hidden sm:block">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono font-bold text-slate-500 uppercase">
                              <Hash size={10} />
                              {row.voucherNo}
                            </div>
                          </div>

                          <div className="col-span-1 text-right hidden sm:flex items-center justify-end gap-2">
                            <Link
                              href={row.voucherType === "Sale" ? `/invoice/${row.voucherNo}` : `/bill/${row.voucherNo}`}
                              className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                              title="View Document"
                            >
                              <Eye size={16} />
                            </Link>

                            {!inactive ? (
                              <button
                                onClick={() => setReverseTarget(row)}
                                className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                title="Reverse Transaction"
                              >
                                <RotateCcw size={16} />
                              </button>
                            ) : (
                              <div className="p-2 text-slate-300 italic text-[10px] font-bold">
                                REV
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* PAGINATION */}
                  <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:border-emerald-600 hover:text-emerald-600 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                    >
                      <ChevronLeft size={14} />
                      Prev
                    </button>

                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
                    </div>

                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:border-emerald-600 hover:text-emerald-600 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* REVERSAL MODAL */}
      <AnimatePresence>
        {reverseTarget && (
          <ConfirmReversalModal
            open
            voucherNo={reverseTarget.voucherNo}
            itemName={reverseTarget.itemName}
            loading={reversing}
            onClose={() => setReverseTarget(null)}
            onConfirm={confirmReversal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
