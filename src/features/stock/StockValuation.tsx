"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

interface ValuationRow {
  product: string;
  unit: string;
  quantity: number;
  rate: number;
  value: number;
}

interface RowDelta {
  product: string;
  unit: string;
  openQty: number;
  closeQty: number;
  openValue: number;
  closeValue: number;
  deltaValue: number;
}

export default function StockValuationComparison() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [rows, setRows] = useState<RowDelta[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchValuation = async (date: string) => {
    const res = await axios.get(
      "/api/stock-valuation",
      { params: { email, date } }
    );
    return res.data.items as ValuationRow[];
  };

  const buildComparison = async () => {
    if (!email || !fromDate || !toDate) return;

    setLoading(true);

    const [opening, closing] = await Promise.all([
      fetchValuation(fromDate),
      fetchValuation(toDate),
    ]);

    const map = new Map<string, RowDelta>();

    for (const r of opening) {
      const key = `${r.product}|${r.unit}`;
      map.set(key, {
        product: r.product,
        unit: r.unit,
        openQty: r.quantity,
        closeQty: 0,
        openValue: r.value,
        closeValue: 0,
        deltaValue: 0,
      });
    }

    for (const r of closing) {
      const key = `${r.product}|${r.unit}`;
      const prev = map.get(key);

      if (!prev) {
        map.set(key, {
          product: r.product,
          unit: r.unit,
          openQty: 0,
          closeQty: r.quantity,
          openValue: 0,
          closeValue: r.value,
          deltaValue: r.value,
        });
      } else {
        prev.closeQty = r.quantity;
        prev.closeValue = r.value;
        prev.deltaValue = r.value - prev.openValue;
      }
    }

    setRows(Array.from(map.values()));
    setLoading(false);
  };

  useEffect(() => {
    buildComparison();
  }, [email, fromDate, toDate]);

  const openingTotal = rows.reduce((s, r) => s + r.openValue, 0);
  const closingTotal = rows.reduce((s, r) => s + r.closeValue, 0);
  const deltaTotal = closingTotal - openingTotal;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
    >
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Stock Valuation Change
        </h2>
        <p className="text-sm text-slate-600">
          FIFO-based inventory comparison
        </p>
      </div>

      {/* DATE PICKERS */}
      <div className="flex gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Opening date</p>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-1">Closing date</p>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <Summary label="Opening value" value={openingTotal} />
        <Summary label="Closing value" value={closingTotal} />
        <Summary
          label="Net change"
          value={deltaTotal}
          highlight
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-sm text-slate-500">
          Calculating valuation change…
        </p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-xs font-medium text-slate-500 bg-slate-100">
            <div className="col-span-4">Product</div>
            <div className="col-span-2 text-right">Open Qty</div>
            <div className="col-span-2 text-right">Close Qty</div>
            <div className="col-span-2 text-right">Open ₹</div>
            <div className="col-span-2 text-right">Δ ₹</div>
          </div>

          {rows.map(r => (
            <div
              key={`${r.product}-${r.unit}`}
              className="grid grid-cols-12 px-5 py-3 border-t border-slate-200 text-sm"
            >
              <div className="col-span-4 font-medium text-slate-900">
                {r.product}
                <div className="text-xs text-slate-500">
                  {r.unit}
                </div>
              </div>

              <div className="col-span-2 text-right">
                {r.openQty}
              </div>

              <div className="col-span-2 text-right">
                {r.closeQty}
              </div>

              <div className="col-span-2 text-right">
                ₹{r.openValue.toLocaleString()}
              </div>

              <div
                className={`col-span-2 text-right font-semibold ${
                  r.deltaValue >= 0
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {r.deltaValue >= 0 ? "+" : "-"}₹
                {Math.abs(r.deltaValue).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

/* ---------- UTIL ---------- */

function Summary({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`text-lg font-semibold ${
          highlight
            ? value >= 0
              ? "text-emerald-700"
              : "text-rose-700"
            : "text-slate-900"
        }`}
      >
        ₹{value.toLocaleString()}
      </p>
    </div>
  );
}
