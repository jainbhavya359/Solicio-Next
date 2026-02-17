"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  ArrowRight,
  ShoppingBag,
  Archive,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Search
} from "lucide-react";
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
    try {
      const res = await axios.get("/api/profit-loss", {
        params: { email, from, to },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load P&L", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [email]);

  if (loading || !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Statement...</p>
      </div>
    );
  }

  const s = data.summary;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 max-w-7xl mx-auto"
    >
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <FileText className="w-3 h-3" />
            Financial Report
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Profit & <span className="text-indigo-600">Loss</span> Statement
          </h2>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl">
            Detailed breakdown of revenue, costs, and expenses to determine the net profit for the selected period.
          </p>
        </div>

        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Period From</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="text-sm font-bold text-slate-700 border-none bg-transparent p-0 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="flex flex-col px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Period To</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="text-sm font-bold text-slate-700 border-none bg-transparent p-0 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
          <button
            onClick={load}
            className="ml-2 h-10 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm"
          >
            Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          {/* TRADING ACCOUNT */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group hover:border-indigo-100 transition-all"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Trading Account</h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Gross Profit Calculation</p>
              </div>
            </div>

            <div className="space-y-1">
              <LedgerRow label="Opening Stock" value={s.openingStock} icon={Archive} />
              <LedgerRow label="Purchases" value={s.purchases} icon={ShoppingBag} />
              <LedgerRow label="Closing Stock" value={s.closingStock} icon={Archive} />
              <div className="py-2"><div className="h-px bg-slate-100" /></div>
              <LedgerRow label="Cost of Goods Sold (COGS)" value={s.cogs} bold icon={BarChart3} />
              <div className="py-4"><div className="h-px bg-slate-200 border-dashed border-t" /></div>
              <LedgerRow label="Gross Profit" value={s.grossProfit} highlight="profit" icon={TrendingUp} />
              <LedgerRow label="Gross Margin" value={`${s.grossMarginPct}%`} subtle icon={TrendingUp} />
            </div>
          </motion.section>

          {/* PROFIT & LOSS */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm group hover:border-emerald-100 transition-all"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Profit & Loss Account</h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Net Profit Calculation</p>
              </div>
            </div>

            <div className="space-y-1">
              <LedgerRow label="Operating Expenses" value={s.expenses} icon={DollarSign} />
              <LedgerRow label="Inventory Write-downs" value={s.inventoryWriteDowns} icon={Archive} />
              <div className="py-4"><div className="h-px bg-slate-200 border-dashed border-t" /></div>
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                <LedgerRow label="Net Profit" value={s.netProfit} highlight="net" icon={TrendingUp} noBorder />
              </div>
            </div>
          </motion.section>
        </div>

        <div className="sticky top-8">
          <ProfitLossWheel summary={s} />
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------- UTIL ---------------- */

function LedgerRow({
  label,
  value,
  bold,
  subtle,
  highlight,
  icon: Icon,
  noBorder
}: {
  label: string;
  value: number | string;
  bold?: boolean;
  subtle?: boolean;
  highlight?: "profit" | "net";
  icon?: any;
  noBorder?: boolean;
}) {
  return (
    <div className={`group/row flex items-center justify-between py-3 transition-all ${!noBorder ? "border-b border-transparent hover:border-slate-50" : ""}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${highlight === 'net' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400 group-hover/row:bg-white group-hover/row:shadow-sm'
            } transition-all`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <span
          className={`text-sm ${bold || highlight
            ? "font-bold text-slate-900"
            : subtle
              ? "font-medium text-slate-400 uppercase tracking-widest text-[10px]"
              : "font-medium text-slate-600"
            }`}
        >
          {label}
        </span>
      </div>

      <span
        className={`text-sm ${highlight === "profit"
          ? "font-bold text-indigo-600 text-lg"
          : highlight === "net"
            ? "font-black text-emerald-700 text-2xl"
            : "font-bold text-slate-900"
          }`}
      >
        {typeof value === "number"
          ? `₹${value.toLocaleString()}`
          : value}
      </span>
    </div>
  );
}
