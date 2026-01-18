"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ConfirmReversalModal from "./ConfirmReversal";

/* -------------------- TYPES -------------------- */

type LedgerRow = {
  _id: string;
  date: string;
  voucherType: string;
  partyName: string,
  partyType: string
  voucherNo: string;
  itemName: string;
  unit: string;
  debitQty: number;
  creditQty: number;
  rate: number;
  balance: number;
  amount: number;
  isReversal: boolean;
  reversedEntryId?: string | null;
};

/* -------------------- COMPONENT -------------------- */

export default function LedgerEntries() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [data, setData] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);

  const [reverseTarget, setReverseTarget] = useState<LedgerRow | null>(null);
  const [reversing, setReversing] = useState(false);
  const [reversalError, setReversalError] = useState<string | null>(null);

  /* -------------------- FETCH LEDGER -------------------- */

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/ledger", {
        params: { email, page, limit },
      });

      setData(res.data.rows);
      setHasMore(res.data.hasMore);
    } catch {
      setError("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email) return;


    fetchLedger();
  }, [email, page]);


  /* -------------------- DERIVED: REVERSED MAP -------------------- */
  /**
   * Contains IDs of original entries that have been reversed
   */
  const reversedMap = useMemo(() => {
    const map = new Set<string>();
    data.forEach((row) => {
      if (row.reversedEntryId) {
        map.add(row.reversedEntryId);
      }
    });
    return map;
  }, [data]);

  /* -------------------- REVERSAL HANDLERS -------------------- */

  const openReversal = (row: LedgerRow) => {
    setReverseTarget(row);
  };

  const confirmReversal = async () => {
    if (!reverseTarget || !email) return;

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
        "This entry cannot be reversed.";

      setReversalError(msg);
      toast.error(msg);
    } finally {
      setReversing(false);
    }
  };


  /* -------------------- UI -------------------- */

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="backdrop-blur-xl bg-white/5 border border-white/10
      rounded-3xl p-6 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-1">
        Stock Ledger
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Purchase & Sale ledger (debit / credit)
      </p>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-slate-400">No ledger entries found.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* HEADER */}
          <div
            className="grid grid-cols-16 gap-2 text-xs text-slate-400
            bg-black/40 border border-white/10 rounded-t-xl
            px-4 py-3 sticky top-0 z-10"
          >
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Particulars</div>
            <div className="col-span-3">Party</div>
            <div className="col-span-1">Voucher</div>
            <div className="col-span-1 text-right">Debit</div>
            <div className="col-span-1 text-right">Credit</div>
            <div className="col-span-1 text-right">Balance</div>
            <div className="col-span-3 mx-4">Entry No</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* ROWS */}
          <div className="border border-white/10 border-t-0 rounded-b-xl overflow-hidden">
            {data.map((row, i) => {
              const isAlreadyReversed = reversedMap.has(row._id);
              const isInactive = row.isReversal || isAlreadyReversed;

              return (
                <div
                  key={row._id}
                  className={`grid grid-cols-16 gap-2 px-4 py-2 text-sm
                    border-t border-white/5
                    transition
                    ${
                      isInactive
                        ? "bg-black/10 text-slate-500 opacity-60"
                        : i % 2 === 0
                          ? "bg-black/30 hover:bg-white/5"
                          : "bg-black/20 hover:bg-white/5"
                    }`}
                >

                  {/* DATE */}
                  <div className="col-span-2 text-slate-300">
                    {new Date(row.date).toISOString().split("T")[0]}
                  </div>

                  {/* PARTICULARS */}
                  <div className="col-span-3 text-white font-medium">
                    {row.itemName}
                    <div className="text-xs text-slate-400">
                      {row.unit}
                    </div>
                  </div>

                  {/* Party Name */}
                  <div className="col-span-3 text-white font-medium">
                    {row.partyName}
                    <div className="text-xs text-slate-400">
                      {row.partyType}
                    </div>
                  </div>

                  {/* VOUCHER */}
                  <div
                    className={`col-span-1 font-semibold
                      ${
                        row.voucherType === "Purchase"
                          ? isInactive
                            ? "text-emerald-400/40"
                            : "text-emerald-400"
                          : isInactive
                            ? "text-rose-400/40"
                            : "text-rose-400"
                      }`}
                  >
                    {row.voucherType}
                  </div>


                  {/* DEBIT */}
                  <div className={`col-span-1 text-right ${
                    isInactive ? "text-emerald-400/40" : "text-emerald-400"
                  }`}>
                    {row.debitQty || ""}
                  </div>

                  {/* CREDIT */}
                  <div className={`col-span-1 text-right ${
                    isInactive ? "text-rose-400/40" : "text-rose-400"
                  }`}>
                    {row.creditQty || ""}
                  </div>


                  {/* BALANCE */}
                  <div className={`col-span-1 text-right font-semibold ${
                    isInactive ? "text-white/40" : "text-white"
                  }`}>
                    {row.balance}
                  </div>


                  {/* ENTRY NO */}
                  <div className="col-span-3 mx-4 text-xs text-slate-400">
                    {row.voucherNo}
                  </div>

                  {/* ACTION */}
                  <div className="col-span-1 text-center">
                    {row.isReversal ? (
                      <span className="text-xs text-slate-500">
                        Reversal
                      </span>
                    ) : isAlreadyReversed ? (
                      <span className="text-xs text-slate-500">
                        Reversed
                      </span>
                    ) : (
                      <button
                        disabled={reversing}
                        onClick={() => openReversal(row)}
                        className="text-xs px-3 py-1 rounded-full
                        border border-rose-400 text-rose-400
                        hover:bg-rose-400/10 transition
                        disabled:opacity-50"
                      >
                        Reverse
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 text-sm text-slate-400">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 rounded-lg border border-white/10
            disabled:opacity-40 hover:bg-white/5"
        >
          ← Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={!hasMore}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 rounded-lg border border-white/10
            disabled:opacity-40 hover:bg-white/5"
        >
          Next →
        </button>
      </div>


      {/* CONFIRM MODAL */}
      {reverseTarget && (
        <ConfirmReversalModal
          open={true}
          voucherNo={reverseTarget.voucherNo}
          itemName={reverseTarget.itemName}
          onClose={() => {
            setReverseTarget(null);
            setReversalError(null);
          }}
          onConfirm={confirmReversal}
          loading={reversing}
          error={reversalError}
        />
      )}

    </motion.section>
  );
}
