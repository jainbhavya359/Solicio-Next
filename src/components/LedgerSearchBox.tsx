"use client";

import { useState } from "react";
import axios from "axios";
import UniversalSearchBox from "./SearchBox";

export default function LedgerSearchBox({ email }: { email: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

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

  return (
    <div className="space-y-6">

      {/* 🔍 Search Box */}
      <UniversalSearchBox
        placeholder="Search ledger..."
        onSubmit={handleSearch}
      />

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-sm text-slate-400">Searching...</p>
      )}

      {/* 📋 Results */}
      {results.length > 0 && (
        <div
            className="rounded-2xl border border-white/10
            bg-black/40 backdrop-blur-xl
            overflow-hidden"
        >
            {/* Header */}
            <div className="px-5 py-3 text-xs text-slate-400
            border-b border-white/10
            flex items-center justify-between"
            >
            <span>Search Results</span>
            <span>{results.length} matches</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
            {results.map((row) => (
                <div
                key={row._id}
                className="grid grid-cols-12 gap-4 px-5 py-4
                hover:bg-white/5 transition"
                >
                {/* Date */}
                <div className="col-span-2 text-xs text-slate-400">
                    {row.date?.slice(0, 10)}
                </div>

                {/* Item */}
                <div className="col-span-3">
                    <div className="text-white font-medium">
                    {row.itemName}
                    </div>
                    <div className="text-xs text-slate-500">
                    {row.unit}
                    </div>
                </div>

                {/* Party */}
                <div className="col-span-3">
                    <div className="text-white">
                    {row.partyName || "—"}
                    </div>
                    <div className="text-xs text-slate-500">
                    {row.partyType}
                    </div>
                </div>

                {/* Voucher */}
                <div className="col-span-2">
                    <span
                    className={`inline-flex items-center px-3 py-1
                    rounded-full text-xs font-medium
                    ${
                        row.voucherType === "Purchase"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                    >
                    {row.voucherType}
                    </span>
                </div>

                {/* Qty */}
                <div className="col-span-1 text-right">
                    {row.debitQty ? (
                    <span className="text-emerald-400">
                        +{row.debitQty}
                    </span>
                    ) : (
                    <span className="text-rose-400">
                        −{row.creditQty}
                    </span>
                    )}
                </div>

                {/* Score (optional but powerful) */}
                <div className="col-span-1 text-right text-xs text-slate-500">
                    {row.score}
                </div>
                </div>
            ))}
            </div>
        </div>
        )}


      {/* ❌ No results */}
      {!loading && results.length === 0 && (
        <p className="text-sm text-slate-500">
          No search results
        </p>
      )}
    </div>
  );
}
