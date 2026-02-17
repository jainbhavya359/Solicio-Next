"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  Box,
  ArrowRight,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

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
    try {
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
    } catch (err) {
      console.error("Valuation fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buildComparison();
  }, [email, fromDate, toDate]);

  const openingTotal = rows.reduce((s, r) => s + r.openValue, 0);
  const closingTotal = rows.reduce((s, r) => s + r.closeValue, 0);
  const deltaTotal = closingTotal - openingTotal;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-12"
    >
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3 h-3" />
            Financial Analysis
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Stock <span className="text-indigo-600">Valuation</span> Change
          </h2>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl">
            Analyze inventory value fluctuations using the FIFO method between two specific points in time.
          </p>
        </div>

        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Opening</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="text-sm font-bold text-slate-700 border-none bg-transparent p-0 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="flex flex-col px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Closing</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="text-sm font-bold text-slate-700 border-none bg-transparent p-0 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          label="Opening Valuation"
          value={openingTotal}
          icon={Layers}
          variant="slate"
        />
        <SummaryCard
          label="Closing Valuation"
          value={closingTotal}
          icon={Box}
          variant="slate"
        />
        <SummaryCard
          label="Net Value Delta"
          value={deltaTotal}
          icon={deltaTotal >= 0 ? TrendingUp : TrendingDown}
          highlight
          description={`Profit/Loss on stock holding`}
        />
      </div>

      {/* COMPARISON LIST */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU Information</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Opening Qty</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Closing Qty</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Opening ₹</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Value Delta ₹</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.tr
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="py-24 text-center">
                      <div className="relative w-12 h-12 mx-auto">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Running FIFO Valuation...</p>
                    </td>
                  </motion.tr>
                ) : rows.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan={5} className="py-24 text-center">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-500 font-bold">No evaluation data available</p>
                      <p className="text-xs text-slate-400 mt-1">Select valid dates to compare stock value</p>
                    </td>
                  </motion.tr>
                ) : (
                  rows.map((r, idx) => (
                    <motion.tr
                      key={`${r.product}-${r.unit}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <Box size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 capitalize">{r.product}</p>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{r.unit}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <span className="text-sm font-bold text-slate-600">{r.openQty}</span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <span className="text-sm font-bold text-slate-900">{r.closeQty}</span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <span className="text-sm font-medium text-slate-500">₹{r.openValue.toLocaleString()}</span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${r.deltaValue >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                          } px-2.5 py-1 rounded-lg`}>
                          {r.deltaValue >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          ₹{Math.abs(r.deltaValue).toLocaleString()}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------- COMPONENTS ---------- */

function SummaryCard({
  label,
  value,
  icon: Icon,
  variant = "slate",
  highlight = false,
  description
}: {
  label: string;
  value: number;
  icon: any;
  variant?: "slate" | "indigo";
  highlight?: boolean;
  description?: string;
}) {
  const isPositive = value >= 0;

  return (
    <div className={`group rounded-[2rem] border p-8 bg-white transition-all hover:shadow-lg hover:border-indigo-100 cursor-default`}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
        <div className={`p-3 rounded-2xl ${highlight
            ? isPositive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            : "bg-indigo-50 text-indigo-500"
          } group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-col">
        <p className={`text-3xl font-bold tracking-tight ${highlight
            ? isPositive ? "text-emerald-600" : "text-rose-600"
            : "text-slate-900"
          }`}>
          ₹{value.toLocaleString()}
        </p>
        {description && (
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">{description}</p>
        )}
      </div>
    </div>
  );
}
