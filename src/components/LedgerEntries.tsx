"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import ConfirmReversalModal from "./ConfirmReversal";

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
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Stock Ledger
        </h2>
        <p className="text-sm text-slate-500">
          Purchase & sale ledger (debit / credit)
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* HEAD */}
          <div className="grid grid-cols-9 px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-50 border-b">
            <div>Date</div>
            <div>Product</div>
            <div>Party</div>
            <div>Type</div>
            <div className="text-right">Dr</div>
            <div className="text-right">Cr</div>
            <div className="text-right">Balance</div>
            <div className="text-center">Entry No</div>
            <div className="text-center">Action</div>
          </div>

          {/* ROWS */}
          {loading ? (
            <div className="p-6 text-sm text-slate-400">
              Loading ledger…
            </div>
          ) : (
            rows.map(row => {
              const inactive =
                row.isReversal || reversedMap.has(row._id);

              return (
                <div
                  key={row._id}
                  className={`grid grid-cols-9 px-6 py-3 text-sm border-b border-slate-100
                    ${
                      inactive
                        ? "bg-slate-50 text-slate-400"
                        : "hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="font-medium">
                    {row.date.slice(0, 10)}
                  </div>

                  <div>
                    <div className="font-semibold">
                      {row.itemName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {row.unit}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium">
                      {row.partyName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {row.partyType}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium
                        ${
                          row.voucherType === "Purchase"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }
                      `}
                    >
                      {row.voucherType}
                    </span>
                  </div>

                  <div className="text-right text-emerald-700 font-semibold">
                    {row.debitQty || "—"}
                  </div>

                  <div className="text-right text-rose-600 font-semibold">
                    {row.creditQty || "—"}
                  </div>

                  <div className="text-right font-bold">
                    {row.balance}
                  </div>

                  <div className="text-center text-xs font-mono text-slate-500">
                    {row.voucherNo}
                  </div>

                  <div className="text-center">
                    {!inactive ? (
                      <button
                        onClick={() => setReverseTarget(row)}
                        className="text-xs font-medium text-rose-600 hover:underline"
                      >
                        Reverse
                      </button>
                    ) : (
                      <span className="text-xs italic text-slate-400">
                        Reversed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 rounded-lg border disabled:opacity-40"
        >
          ← Previous
        </button>

        <span className="text-slate-500">
          Page {page}
        </span>

        <button
          disabled={!hasMore}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 rounded-lg border disabled:opacity-40"
        >
          Next →
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
