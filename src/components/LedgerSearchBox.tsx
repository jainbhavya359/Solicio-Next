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
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {results.map((row) => (
            <div
              key={row._id}
              className="grid grid-cols-6 gap-4 px-4 py-3
              bg-black/30 border-b border-white/5
              hover:bg-white/5 transition"
            >
              <div className="text-slate-300">
                {row.date?.slice(0, 10)}
              </div>

              <div className="text-white font-medium">
                {row.itemName}
                <div className="text-xs text-slate-400">
                  {row.unit}
                </div>
              </div>

              <div className="text-white">
                {row.partyName}
                <div className="text-xs text-slate-400">
                  {row.partyType}
                </div>
              </div>

              <div
                className={`font-semibold ${
                  row.voucherType === "Purchase"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {row.voucherType}
              </div>

              <div className="text-right text-emerald-400">
                {row.debitQty || ""}
              </div>

              <div className="text-right text-rose-400">
                {row.creditQty || ""}
              </div>
            </div>
          ))}
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
