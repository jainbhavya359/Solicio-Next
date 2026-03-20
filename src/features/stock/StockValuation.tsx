"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Calendar, Layers, Box, ArrowRight, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

  const today = new Date();
  const prior = new Date();
  prior.setMonth(prior.getMonth() - 1);

  const todayStr = today.toISOString().split("T")[0];
  const priorStr = prior.toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(priorStr);
  const [toDate, setToDate] = useState(todayStr);

  const [rows, setRows] = useState<RowDelta[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchValuation = async (date: string) => {
    const res = await axios.get("/api/stock-valuation", { params: { email, date } });
    return res.data.items as ValuationRow[];
  };

  const buildComparison = async () => {
    if (!email || !fromDate || !toDate) return;
    setLoading(true);
    try {
      const [opening, closing] = await Promise.all([fetchValuation(fromDate), fetchValuation(toDate)]);
      const map = new Map<string, RowDelta>();
      
      for (const r of opening) {
        map.set(`${r.product}|${r.unit}`, {
          product: r.product, unit: r.unit, openQty: r.quantity, closeQty: 0,
          openValue: r.value, closeValue: 0, deltaValue: 0,
        });
      }

      for (const r of closing) {
        const key = `${r.product}|${r.unit}`;
        const prev = map.get(key);
        if (!prev) {
          map.set(key, {
            product: r.product, unit: r.unit, openQty: 0, closeQty: r.quantity,
            openValue: 0, closeValue: r.value, deltaValue: r.value,
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

  useEffect(() => { buildComparison(); }, [email, fromDate, toDate]);

  const openingTotal = rows.reduce((s, r) => s + r.openValue, 0);
  const closingTotal = rows.reduce((s, r) => s + r.closeValue, 0);
  const deltaTotal = closingTotal - openingTotal;

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 px-4 pt-4 sm:pt-6">
        <div className="flex-1 min-w-0 hidden sm:block">
          <h2 className="text-3xl font-bold text-white tracking-tight">Stock Valuation Change</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Analyze inventory value fluctuations using the FIFO method between two specific points in time.
          </p>
        </div>
        <div className="w-full sm:w-auto p-2 bg-white/5 rounded-2xl border border-white/10 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col px-3 border-r border-white/10 w-1/2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Opening</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  className="w-full text-xs font-bold text-white border-none bg-transparent p-0 focus:ring-0 cursor-pointer [color-scheme:dark]" />
              </div>
            </div>
            <div className="flex flex-col px-3 w-1/2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Closing</span>
              <div className="flex items-center gap-2">
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                  className="w-full text-xs font-bold text-white border-none bg-transparent p-0 focus:ring-0 cursor-pointer [color-scheme:dark]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-4">
        <SummaryCard label="Opening" value={openingTotal} icon={Layers} variant="slate" />
        <SummaryCard label="Closing" value={closingTotal} icon={Box} variant="slate" />
        <div className="col-span-2 lg:col-span-1">
          <SummaryCard label="Net Delta" value={deltaTotal} icon={deltaTotal >= 0 ? TrendingUp : TrendingDown} highlight description="Holding PnL" />
        </div>
      </div>

      {/* COMPARISON LIST */}
      <div className="bg-transparent border-t border-white/10 overflow-hidden text-sm">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SKU Information</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Opening Qty</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Closing Qty</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Opening ₹</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Value Delta ₹</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="relative w-10 h-10 mx-auto border-4 border-blue-500/20 rounded-full">
                        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin -m-1" />
                      </div>
                      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Running FIFO Valuation...</p>
                    </td>
                  </motion.tr>
                ) : rows.length === 0 ? (
                  <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 text-slate-500 flex items-center justify-center mx-auto mb-4 border border-white/5"><Search size={28} /></div>
                      <p className="text-slate-300 font-bold">No evaluation data available</p>
                      <p className="text-xs text-slate-500 mt-1">Select valid dates to compare stock value</p>
                    </td>
                  </motion.tr>
                ) : (
                  rows.map((r, idx) => (
                    <motion.tr key={`${r.product}-${r.unit}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="group hover:bg-white/5 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center border border-white/5 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                            <Box size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-white capitalize">{r.product}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{r.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right"><span className="text-sm font-bold text-slate-400">{r.openQty}</span></td>
                      <td className="px-8 py-4 text-right"><span className="text-sm font-bold text-white">{r.closeQty}</span></td>
                      <td className="px-8 py-4 text-right"><span className="text-sm font-medium text-slate-400">₹{r.openValue.toLocaleString('en-IN')}</span></td>
                      <td className="px-8 py-4 text-right">
                        <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${r.deltaValue >= 0 ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border border-rose-500/20"} px-2.5 py-1.5 rounded-lg`}>
                          {r.deltaValue >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          ₹{Math.abs(r.deltaValue).toLocaleString('en-IN')}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="block sm:hidden p-0">
          {loading ? (
             <div className="py-12 text-center text-slate-400 text-xs">Calculating...</div>
          ) : rows.length === 0 ? (
             <div className="py-12 text-center text-slate-400 text-sm">No data available</div>
          ) : (
             <div className="divide-y divide-white/5 border-t border-white/5">
                {rows.map((r, idx) => (
                  <motion.div key={`mob-${r.product}-${r.unit}`} className="p-4" initial={{opacity:0}} animate={{opacity:1}}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center shrink-0">
                          <Box size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm leading-tight capitalize">{r.product}</p>
                          <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{r.unit}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${r.deltaValue >= 0 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"}`}>
                        {r.deltaValue >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} ₹{Math.abs(r.deltaValue).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pl-11">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Quantity</p>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                           <span className="text-slate-400">{r.openQty}</span>
                           <ArrowRight size={10} className="text-slate-500" />
                           <span>{r.closeQty}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Opening Val</p>
                        <p className="text-xs font-medium text-slate-300">₹{r.openValue.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function SummaryCard({ label, value, icon: Icon, variant = "slate", highlight = false, description }: any) {
  const isPositive = value >= 0;
  return (
    <div className={`group rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-6 bg-white/5 transition-all hover:bg-white/10 cursor-default h-full`}>
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`p-2 rounded-xl sm:rounded-2xl transition-transform ${highlight ? (isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20") : "bg-blue-500/10 text-blue-400 border border-blue-500/20"} group-hover:scale-110`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <div className="flex flex-col">
        <p className={`text-xl sm:text-3xl font-bold tracking-tight ${highlight ? (isPositive ? "text-emerald-400" : "text-rose-400") : "text-white"}`}>₹{value.toLocaleString('en-IN')}</p>
        <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-widest line-clamp-1">{description}</p>
      </div>
    </div>
  );
}
