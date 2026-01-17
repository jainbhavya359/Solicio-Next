"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import UniversalSearchBox from "./SearchBox";
import toast from "react-hot-toast";
import { Query } from "mongoose";


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
  amount: number;
  isReversal: boolean;
  reversedEntryId?: string | null;
};

export default function LedgerSearchBox({ email }: { email: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

    const [reverseTarget, setReverseTarget] = useState<LedgerRow | null>(null);
    const [reversing, setReversing] = useState(false);
    const [ reload, setReload] = useState(false);
    const [prevQuery, setPrevQuery] = useState("");
  
     /* -------------------- REVERSAL HANDLERS -------------------- */

  const openReversal = (row: LedgerRow) => {
    setReverseTarget(row);
  };

  const confirmReversal = async () => {
    if (!reverseTarget || !email) return;

    try {
      setReversing(true);

      await axios.post("/api/ledger/reverse", {
        ledgerId: reverseTarget._id,
        reason: "Manual reversal",
      });

      toast.success("Ledger entry reversed");
      setReverseTarget(null);
      setReload(!reload);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to reverse entry"
      );
    } finally {
      setReversing(false);
    }
  };

  /* -------------------- DERIVED: REVERSED MAP -------------------- */
    /**
     * Contains IDs of original entries that have been reversed
     */
    const reversedMap = useMemo(() => {
      const map = new Set<string>();
      results.forEach((row) => {
        if (row.reversedEntryId) {
          map.add(row.reversedEntryId);
        }
      });
      return map;
    }, [results]);


  const handleSearch = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    setPrevQuery(query);

    try {
      setLoading(true);
      const { data } = await axios.post("/api/search", {
        email,
        query,
      });
      setResults(data.results || []);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    handleSearch(prevQuery);
  }, [reload]);

  return (
    <div className="space-y-6">
      {/* 🔍 Search */}
      <UniversalSearchBox
        placeholder="Search ledger..."
        onSubmit={handleSearch}
      />

      {loading && (
        <p className="text-sm text-slate-400">Searching…</p>
      )}

      {results.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-13 px-5 py-3 text-xs text-slate-400 border-b border-white/10">
            <div>Date</div>
            <div className="col-span-2">Particulars</div>
            <div className="col-span-2">Party</div>
            <div>Voucher</div>
            <div className="text-right">Debit</div>
            <div className="text-right">Credit</div>
            <div className="col-span-3 text-center mx-4">Entry No</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* Rows */}
          {results.map((row) => {
            const isPurchase = row.voucherType === "Purchase";
            const isSale = row.voucherType === "Sale";
            const isReversed = row.isReversal;
            const isAlreadyReversed = reversedMap.has(row._id);
            const isInactive = row.isReversal || isAlreadyReversed;

            return (
              <div
                key={row._id}
                className={`grid grid-cols-13 px-5 py-4 text-sm border-b border-white/5
                ${isReversed ? "opacity-50" : "hover:bg-white/5"} transition`}
              >
                {/* Date */}
                <div className="text-slate-300">
                  {row.date?.slice(0, 10)}
                </div>

                {/* Item */}
                <div className="col-span-2">
                  <div className="text-white font-medium">
                    {row.itemName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.unit}
                  </div>
                </div>

                {/* Party */}
                <div className="col-span-2">
                  <div className="text-white">
                    {row.partyName || "Cash"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.partyType || "Cash"}
                  </div>
                </div>

                {/* Voucher */}
                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                    ${
                      isPurchase
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {row.voucherType}
                  </span>
                </div>

                {/* Debit */}
                <div className="text-right text-emerald-400">
                  {row.debitQty > 0 ? row.debitQty : ""}
                </div>

                {/* Credit */}
                <div className="text-right text-rose-400">
                  {row.creditQty > 0 ? row.creditQty : ""}
                </div>

                {/* ENTRY NO */}
                  <div className="col-span-3 text-center mx-4 text-xs text-slate-400">
                    {row.voucherNo}
                  </div>

                {/* Action */}
                <div className="col-span-2 text-center">
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
      )}

      {!loading && results.length === 0 && (
        <p className="text-sm text-slate-500">
          No search results
        </p>
      )}
    </div>
  );
}
