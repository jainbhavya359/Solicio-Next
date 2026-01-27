"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
        <p className="text-sm text-slate-400">Searching…</p>
      )}

      {visibleResults.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* HEADER */}
          <div className="grid grid-cols-13 px-5 py-3 text-xs font-semibold text-slate-600 bg-slate-50 border-b">
            <div>Date</div>
            <div className="col-span-2">Product</div>
            <div className="col-span-2">Party</div>
            <div>Type</div>
            <div className="text-right">Dr</div>
            <div className="text-right">Cr</div>
            <div className="col-span-3 text-center">Entry No</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* ROWS */}
          {visibleResults.map(row => {
            const inactive =
              row.isReversal || reversedMap.has(row._id);

            return (
              <div
                key={row._id}
                className={`grid grid-cols-13 px-5 py-3 text-sm border-b
                  ${inactive ? "bg-slate-50 text-slate-400" : "hover:bg-slate-50"}
                `}
              >
                <div className="font-medium tabular-nums">
                  {row.date.slice(0, 10)}
                </div>

                <div className="col-span-2">
                  <div className="font-semibold">
                    {row.itemName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.unit}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="font-medium">
                    {row.partyName || "Cash"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.partyType || "Cash"}
                  </div>
                </div>

                <div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-semibold
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

                <div className="text-right text-emerald-600">
                  {row.debitQty || "—"}
                </div>

                <div className="text-right text-rose-600">
                  {row.creditQty || "—"}
                </div>

                <div className="col-span-3 text-center font-mono text-xs text-slate-500">
                  {row.voucherNo}
                </div>

                <div className="col-span-2 text-center">
                  {!inactive ? (
                    <button
                      onClick={() => setReverseTarget(row)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Reverse
                    </button>
                  ) : (
                    <span className="text-xs italic">
                      Reversed
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-5 py-3 border-t text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              ← Previous
            </button>

            <span className="text-slate-500">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}

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
