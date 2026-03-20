"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  ShoppingBag,
  Archive,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Plus
} from "lucide-react";
import ProfitLossWheel from "./ProfitLossWheel";
import FinancialEntryModal from "./FinancialEntryModal";

export default function ProfitLossReport() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const curr = new Date();
  const firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0).toISOString().split('T')[0];

  const [from, setFrom] = useState(firstDay);
  const [to, setTo] = useState(lastDay);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [financialModalType, setFinancialModalType] = useState<"Expense" | "TaxPayment" | "StockWriteOff" | null>(null);

  const load = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/profit-loss", {
        params: { email, from, to, t: Date.now() },
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
      <div className="py-24 flex flex-col items-center justify-center bg-[#0A0A0A] border border-white/10 rounded-[2.5rem]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Generating Statement...</p>
      </div>
    );
  }

  const s = data.summary;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 w-full"
    >
      {/* HEADER & FILTERS */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-500/20">
              <FileText className="w-3 h-3" />
              Financial Report
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              Profit & <span className="text-indigo-400">Loss</span> Statement
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-2 max-w-xl font-medium leading-relaxed">
              Detailed breakdown of revenue, costs, and expenses to determine the net profit for the selected period.
            </p>
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/10 w-full lg:w-auto">
            <div className="flex items-center justify-between w-full lg:w-auto gap-4">
              <div className="flex flex-col px-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">From</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <input
                    type="date"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    className="text-sm font-bold text-white border-none bg-transparent p-0 focus:ring-0 cursor-pointer w-[90px] [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col px-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">To</span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    className="text-sm font-bold text-white border-none bg-transparent p-0 focus:ring-0 cursor-pointer w-[90px] [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={load}
              className="w-full lg:w-auto ml-0 lg:ml-2 h-10 px-6 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]"
            >
              Recalculate
            </button>
          </div>
        </div>
      </div>

      {/* KEY METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PLMetric
          label="Sales Revenue"
          value={s.sales}
          icon={TrendingUp}
          color="emerald"
          subtitle="Total Inbound Revenue"
        />
        <PLMetric
          label="Gross Profit"
          value={s.grossProfit}
          icon={BarChart3}
          color="indigo"
          subtitle={`${s.grossMarginPct}% Gross Margin`}
        />
        <PLMetric
          label="Net Profit"
          value={s.netProfit}
          icon={s.netProfit >= 0 ? TrendingUp : TrendingDown}
          color={s.netProfit >= 0 ? "emerald" : "rose"}
          subtitle="Bottom Line"
          hero
        />
      </div>

      {/* MAIN P&L GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          {/* TRADING ACCOUNT */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0A0A0A] rounded-[2rem] border border-white/10 p-6 sm:p-8 hover:border-indigo-500/20 transition-all group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Trading Account</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Gross Profit Calculation</p>
              </div>
            </div>

            <div className="space-y-1">
              <LedgerRow label="Opening Stock" value={s.openingStock} icon={Archive} />
              <LedgerRow label="Purchases" value={s.purchases} icon={ShoppingBag} />
              <LedgerRow label="Closing Stock" value={s.closingStock} icon={Archive} />
              <div className="py-3"><div className="h-px bg-white/5" /></div>
              <LedgerRow label="Cost of Goods Sold (COGS)" value={s.cogs} bold icon={BarChart3} />
              <div className="py-3"><div className="h-px border-t border-white/10 border-dashed" /></div>
              <LedgerRow label="Gross Profit" value={s.grossProfit} highlight="profit" icon={TrendingUp} />
              <LedgerRow label="Gross Margin" value={`${s.grossMarginPct}%`} subtle icon={TrendingUp} />
            </div>
          </motion.section>

          {/* PROFIT & LOSS */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0A0A] rounded-[2rem] border border-white/10 p-6 sm:p-8 hover:border-emerald-500/20 transition-all group"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Profit & Loss Account</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Net Profit Calculation</p>
              </div>
            </div>

            <div className="space-y-1">
              <LedgerRow label="Operating Expenses" value={s.expenses} icon={DollarSign} onAdd={() => setFinancialModalType("Expense")} />
              <LedgerRow label="Taxes Paid" value={s.taxesPaid || 0} icon={DollarSign} onAdd={() => setFinancialModalType("TaxPayment")} />
              <LedgerRow label="Inventory Write-downs" value={s.inventoryWriteDowns} icon={Archive} onAdd={() => setFinancialModalType("StockWriteOff")} />
              <div className="py-3"><div className="h-px border-t border-white/10 border-dashed" /></div>
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <LedgerRow label="Net Profit" value={s.netProfit} highlight="net" icon={TrendingUp} noBorder />
              </div>
            </div>
          </motion.section>
        </div>

        {/* PROFIT WHEEL */}
        <div className="sticky top-8">
          <ProfitLossWheel summary={s} />
        </div>
      </div>

      <FinancialEntryModal
        isOpen={financialModalType !== null}
        onClose={() => setFinancialModalType(null)}
        type={financialModalType || "Expense"}
        onSuccess={load}
      />
    </motion.section>
  );
}

/* ---- METRICS ---- */
function PLMetric({ label, value, icon: Icon, color, subtitle, hero }: { label: string; value: number; icon: any; color: "emerald" | "indigo" | "rose"; subtitle: string; hero?: boolean }) {
  const styles = {
    emerald: { bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", text: "text-emerald-400", glow: "shadow-[0_0_30px_rgba(16,185,129,0.1)]" },
    indigo: { bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", text: "text-indigo-400", glow: "shadow-[0_0_30px_rgba(99,102,241,0.1)]" },
    rose: { bg: "bg-rose-500/10 border-rose-500/20 text-rose-400", text: "text-rose-400", glow: "shadow-[0_0_30px_rgba(244,63,94,0.1)]" },
  };
  const s = styles[color];

  return (
    <div className={`bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all ${hero ? s.glow : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`p-2 rounded-xl border ${s.bg}`}><Icon className="w-4 h-4" /></div>
      </div>
      <p className={`text-2xl sm:text-3xl font-black tracking-tight ${s.text} ${hero ? "text-3xl sm:text-4xl" : ""}`}>
        ₹{Math.abs(value).toLocaleString('en-IN')}
        {value < 0 && <span className="text-rose-400 text-xl ml-1">↓</span>}
      </p>
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{subtitle}</p>
    </div>
  );
}

/* ---- LEDGER ROW ---- */
function LedgerRow({
  label, value, bold, subtle, highlight, icon: Icon, noBorder, onAdd
}: {
  label: string; value: number | string; bold?: boolean; subtle?: boolean;
  highlight?: "profit" | "net"; icon?: any; noBorder?: boolean; onAdd?: () => void;
}) {
  return (
    <div className={`group/row flex items-center justify-between py-3 transition-all ${!noBorder ? "border-b border-transparent hover:border-white/5" : ""}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${highlight === 'net' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-white/5 border border-white/10 text-slate-600 group-hover/row:text-slate-400'} transition-all`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <span className={`text-sm ${bold || highlight ? "font-bold text-white" : subtle ? "font-medium text-slate-600 uppercase tracking-widest text-[10px]" : "font-medium text-[#A1A1AA]"}`}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className={`${highlight === "profit" ? "font-bold text-indigo-400 text-lg" : highlight === "net" ? "font-black text-emerald-400 text-2xl" : "font-bold text-white text-sm"}`}>
          {typeof value === "number" ? `₹${value.toLocaleString('en-IN')}` : value}
        </span>
        {onAdd && (
          <button
            onClick={onAdd}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all opacity-0 group-hover/row:opacity-100 shadow-sm"
            title="Add Entry"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
