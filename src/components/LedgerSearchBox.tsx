"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import UniversalSearchBox from "./SearchBox";
import ConfirmReversalModal from "./ConfirmReversal";

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
    <div className="space-y-4">
      {/* SEARCH */}
      <UniversalSearchBox
        placeholder="Search ledger by party, product, voucher…"
        onSubmit={handleSearch}
        autoFocus
      />

      {query && (
        <p className="text-xs text-slate-500">
          Showing results for{" "}
          <span className="font-semibold text-slate-700">
            “{query}”
          </span>
        </p>
      )}

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/60"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full"
          />
          <p className="text-sm text-indigo-600 font-medium">Searching ledger...</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {visibleResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-premium overflow-x-auto"
          >
          {/* PREMIUM HEADER */}
          <div className="min-w-[900px] grid grid-cols-13 px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-zinc-50 border-b border-slate-200/60">
            <div>Date</div>
            <div className="col-span-2">Product</div>
            <div className="col-span-2">Party</div>
            <div>Type</div>
            <div className="text-right">Dr</div>
            <div className="text-right">Cr</div>
            <div className="col-span-3 text-center">Entry No</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* PREMIUM ROWS with Stagger Animation */}
          {visibleResults.map((row, idx) => {
            const inactive =
              row.isReversal || reversedMap.has(row._id);

            return (
              <motion.div
                key={row._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`min-w-[900px] grid grid-cols-13 px-6 py-4 text-sm border-b border-slate-100 transition-all duration-200
                  ${inactive 
                    ? "bg-slate-50/50 text-slate-400 opacity-60" 
                    : "hover:bg-indigo-50/30 hover:border-indigo-100"}
                `}
              >
                <div className="font-semibold tabular-nums text-slate-700">
                  {row.date.slice(0, 10)}
                </div>

                <div className="col-span-2">
                  <div className="font-bold text-slate-900">
                    {row.itemName}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {row.unit}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="font-bold text-slate-900">
                    {row.partyName || "Cash"}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {row.partyType || "Cash"}
                  </div>
                </div>

                <div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border
                      ${
                        row.voucherType === "Purchase"
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200/60"
                          : "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-200/60"
                      }
                    `}
                  >
                    {row.voucherType}
                  </span>
                </div>

                <div className="text-right text-emerald-600 font-bold tabular-nums">
                  {row.debitQty || "—"}
                </div>

                <div className="text-right text-rose-600 font-bold tabular-nums">
                  {row.creditQty || "—"}
                </div>

                <div className="col-span-3 text-center font-mono text-xs text-slate-500 font-semibold">
                  {row.voucherNo}
                </div>

                <div className="col-span-2 text-center">
                  {!inactive ? (
                    <button
                      onClick={() => setReverseTarget(row)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all duration-200 border border-transparent hover:border-rose-200"
                    >
                      Reverse
                    </button>
                  ) : (
                    <span className="text-xs italic font-medium text-slate-400">
                      Reversed
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* PREMIUM PAGINATION */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-zinc-50">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-slate-200/60 bg-white font-semibold text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              ← Previous
            </button>

            <span className="text-slate-600 font-semibold text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-slate-200/60 bg-white font-semibold text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              Next →
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
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
    </div>
  );
}
