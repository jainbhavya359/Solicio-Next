"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import ProfitLossWheel from "./ProfitLossWheel";

export default function ProfitLossReport() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-01-31");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!email) return;
    setLoading(true);
    const res = await axios.get("/api/profit-loss", {
      params: { email, from, to },
    });
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [email]);

  if (loading || !data) {
    return (
      <div className="text-sm text-slate-400">
        Preparing profit & loss statement…
      </div>
    );
  }

  const s = data.summary;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Profit & Loss
          </h2>
          <p className="text-sm text-slate-500">
            From {from} to {to}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <span className="text-slate-400">→</span>
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={load}
            className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* TRADING ACCOUNT */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">
          Trading Account
        </h3>

        <LedgerRow label="Opening Stock" value={s.openingStock} />
        <LedgerRow label="Purchases" value={s.purchases} />
        <LedgerRow label="Closing Stock" value={s.closingStock} />

        <div className="my-3 border-t border-slate-200" />

        <LedgerRow
          label="Cost of Goods Sold (COGS)"
          value={s.cogs}
          bold
        />

        <div className="my-4 border-t border-slate-300" />

        <LedgerRow
          label="Gross Profit"
          value={s.grossProfit}
          highlight="profit"
        />
        <LedgerRow
          label="Gross Margin"
          value={`${s.grossMarginPct}%`}
          subtle
        />
      </section>

      {/* PROFIT & LOSS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 mt-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">
          Profit & Loss Account
        </h3>

        <LedgerRow label="Operating Expenses" value={s.expenses} />
        <LedgerRow
          label="Inventory Write-downs"
          value={s.inventoryWriteDowns}
        />

        <div className="my-4 border-t border-slate-300" />

        <LedgerRow
          label="Net Profit"
          value={s.netProfit}
          highlight="net"
        />

      </section>
      
      <ProfitLossWheel summary={s} />

    </section>
  );
}

/* ---------------- UTIL ---------------- */

function LedgerRow({
  label,
  value,
  bold,
  subtle,
  highlight,
}: {
  label: string;
  value: number | string;
  bold?: boolean;
  subtle?: boolean;
  highlight?: "profit" | "net";
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span
        className={`text-sm ${
          bold
            ? "font-medium text-slate-900"
            : subtle
            ? "text-slate-500"
            : "text-slate-700"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-sm ${
          highlight === "profit"
            ? "font-semibold text-indigo-600"
            : highlight === "net"
            ? "font-bold text-emerald-600 text-base"
            : "font-medium text-slate-900"
        }`}
      >
        {typeof value === "number"
          ? `₹${value.toLocaleString()}`
          : value}
      </span>
    </div>
  );
}
