"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import ConfirmReversalModal from "./ConfirmReversal";
import Link from "next/link";
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Package,
  User,
  Calendar,
  Hash,
  Search
} from "lucide-react";

/* -------------------- TYPES -------------------- */
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
  balance: number;
  isReversal: boolean;
  reversedEntryId?: string | null;
};

/* -------------------- COMPONENT -------------------- */
export default function StockLedger() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);

  /* pagination */
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);

  /* reversal */
  const [reverseTarget, setReverseTarget] = useState<LedgerRow | null>(null);
  const [reversing, setReversing] = useState(false);
  const [reversalError, setReversalError] = useState<string | null>(null);

  /* -------------------- FETCH -------------------- */
  const fetchLedger = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await axios.get("/api/ledger", {
        params: { email, page, limit },
      });

      setRows(res.data.rows || []);
      setHasMore(res.data.hasMore);
    } catch {
      toast.error("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [email, page]);

  /* -------------------- REVERSED MAP -------------------- */
  const reversedMap = useMemo(() => {
    const s = new Set<string>();
    rows.forEach(r => r.reversedEntryId && s.add(r.reversedEntryId));
    return s;
  }, [rows]);

  /* -------------------- CONFIRM REVERSAL -------------------- */
  const confirmReversal = async () => {
    if (!reverseTarget) return;
    try {
      setReversing(true);
      setReversalError(null);

      await axios.post("/api/ledger/reverse", {
        ledgerId: reverseTarget._id,
        reason: "Manual reversal",
      });

      toast.success("Ledger entry reversed");
      setReverseTarget(null);
      await fetchLedger();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "This entry cannot be reversed";
      setReversalError(msg);
      toast.error(msg);
    } finally {
      setReversing(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
    >
      {/* HEADER */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
            <History className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              Stock Ledger
            </h2>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">
              Transaction History (Debit / Credit)
            </p>
          </div>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="flex-1 w-full overflow-x-auto">
        <div className="min-w-[1200px] p-6">
          {/* HEAD */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 mb-4">
            <div className="col-span-1">Date</div>
            <div className="col-span-3">Product Information</div>
            <div className="col-span-2">Party Details</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1 text-right">Debit</div>
            <div className="col-span-1 text-right">Credit</div>
            <div className="col-span-1 text-center">Balance</div>
            <div className="col-span-1 text-right">Action</div>
            <div className="col-span-1 text-right">Reverse</div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 flex flex-col items-center justify-center"
              >
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling history...</p>
              </motion.div>
            ) : rows.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 text-slate-300 flex items-center justify-center mb-6">
                  <Search size={40} />
                </div>
                <p className="text-slate-500 font-bold text-lg">No transactions found</p>
                <p className="text-sm text-slate-400 mt-2">Start registering purchases or sales to see history</p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="space-y-3"
              >
                {rows.map(row => {
                  const inactive = row.isReversal || reversedMap.has(row._id);

                  return (
                    <motion.div
                      key={row._id}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      className={`grid grid-cols-12 items-center gap-4 px-6 py-4 rounded-2xl border transition-all hover:shadow-md
                        ${inactive ? "bg-slate-50/50 border-slate-100 opacity-60 grayscale" : "bg-white border-slate-100 hover:border-indigo-100 group"}
                      `}
                    >
                      <div className="col-span-1">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{row.date.slice(0, 10)}</span>
                          <span className="text-[10px] font-medium text-slate-400">Transaction Date</span>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl bg-slate-100 text-slate-500 ${!inactive && "group-hover:bg-indigo-50 group-hover:text-indigo-600"} transition-colors`}>
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 capitalize leading-tight">{row.itemName}</p>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">{row.unit}</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-300" />
                          <div>
                            <p className="text-sm font-bold text-slate-700">{row.partyName}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{row.partyType}</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                          ${row.voucherType === "Purchase" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}
                        `}>
                          {row.voucherType}
                        </span>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className={`text-sm font-black ${row.debitQty ? "text-emerald-600" : "text-slate-300"}`}>
                          {row.debitQty ? `+${row.debitQty}` : "—"}
                        </span>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className={`text-sm font-black ${row.creditQty ? "text-rose-600" : "text-slate-300"}`}>
                          {row.creditQty ? `-${row.creditQty}` : "—"}
                        </span>
                      </div>

                      <div className="col-span-1 text-center">
                        <div className="inline-flex flex-col px-3 py-1 rounded-xl bg-slate-900 text-white shadow-sm">
                          <span className="text-xs font-black tracking-tighter">{row.balance}</span>
                          <span className="text-[8px] font-bold uppercase opacity-60">Bal</span>
                        </div>
                      </div>

                      <div className="col-span-1 text-right">
                        {row.voucherType === "Sale" ? (
                          <Link
                            href={`/invoice/${row.voucherNo}`}
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all group/btn shadow-sm"
                            title="View Invoice"
                          >
                            <Eye size={18} />
                          </Link>
                        ) : (
                          <Link
                            href={`/bill/${row.voucherNo}`}
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all group/btn shadow-sm"
                            title="View Bill"
                          >
                            <Eye size={18} />
                          </Link>
                        )}
                      </div>

                      <div className="col-span-1 text-right">
                        {!inactive ? (
                          <button
                            onClick={() => setReverseTarget(row)}
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm group/rev"
                            title="Reverse Entry"
                          >
                            <RotateCcw size={18} />
                          </button>
                        ) : (
                          <div className="flex flex-col items-end opacity-40">
                            <span className="text-[10px] font-black uppercase text-slate-400">Reversed</span>
                            <Hash size={12} className="mt-0.5" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all shadow-sm active:scale-95"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-4">
          <div className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg">
            Page {page}
          </div>
        </div>

        <button
          disabled={!hasMore}
          onClick={() => setPage(p => p + 1)}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all shadow-sm active:scale-95"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* REVERSAL MODAL */}
      {reverseTarget && (
        <ConfirmReversalModal
          open
          voucherNo={reverseTarget.voucherNo}
          itemName={reverseTarget.itemName}
          loading={reversing}
          error={reversalError}
          onClose={() => {
            setReverseTarget(null);
            setReversalError(null);
          }}
          onConfirm={confirmReversal}
        />
      )}
    </motion.section>
  );
}
