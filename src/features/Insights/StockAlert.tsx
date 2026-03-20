"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Package, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

type Severity = "CRITICAL" | "MEDIUM" | "LOW";

interface StockAlert {
  product: string;
  unit: string;
  quantity: number;
  avgDailySales: number;
  daysLeft: number | null;
  severity: Severity;
  reason: string;
  status: string;
}

interface NoAlertExplanation {
  product: string;
  unit: string;
  message: string;
}

const severityMap: Record<
  Severity,
  { chip: string; bar: string; text: string; iconBg: string; iconColor: string }
> = {
  CRITICAL: {
    chip: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    bar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]",
    text: "text-rose-400",
    iconBg: "bg-rose-500/10 border border-rose-500/20",
    iconColor: "text-rose-400",
  },
  MEDIUM: {
    chip: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    bar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]",
    text: "text-amber-400",
    iconBg: "bg-amber-500/10 border border-amber-500/20",
    iconColor: "text-amber-400",
  },
  LOW: {
    chip: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    bar: "bg-orange-400",
    text: "text-orange-400",
    iconBg: "bg-orange-500/10 border border-orange-500/20",
    iconColor: "text-orange-400",
  },
};

export default function StockAlertSmart({ data }: { data: { alerts: { count: number; products: StockAlert[] }, noAlerts: NoAlertExplanation[], } | null }) {
  const [open, setOpen] = useState(false);
  if (!data) return null;

  const hasAlerts = data.alerts.count > 0;

  return (
    <section className="bg-transparent overflow-visible sm:overflow-hidden">
      <div className={`flex p-4 sm:p-6 items-center justify-between transition-colors ${open ? "bg-white/5 border-b border-white/10" : ""}`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors border ${hasAlerts ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"}`}>
             {hasAlerts ? <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" /> : <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              Inventory Signals
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-400">
              {hasAlerts ? `${data.alerts.count} product${data.alerts.count > 1 ? "s" : ""} require attention` : "All stock levels are optimal"}
            </p>
          </div>
        </div>
        <button onClick={() => setOpen(v => !v)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white border border-transparent hover:border-white/10 transition-all ml-2">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-visible sm:overflow-hidden">
            <div className="p-0 sm:p-6 space-y-4">
              {hasAlerts ? (
                <>
                  {/* MOBILE */}
                  <div className="block sm:hidden space-y-4 pt-4 px-4">
                    {data.alerts.products.map((p, i) => {
                      const style = severityMap[p.severity];
                      const percent = p.daysLeft === null ? 0 : Math.max(5, Math.min(100, (1 - (p.daysLeft / 30)) * 100));
                      return (
                        <div key={`mobile-${p.product}-${p.unit}`} className="bg-transparent rounded-xl border border-white/10 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center shrink-0`}>
                                <Package className={`w-4 h-4 ${style.iconColor}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-white text-sm leading-snug line-clamp-2">{p.product}</h4>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{p.unit}</p>
                              </div>
                            </div>
                            <span className={`ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${style.chip}`}>{p.severity}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                            <Metric label="Days Left" value={p.daysLeft ?? "—"} color={style.text} />
                            <Metric label="In Stock" value={p.quantity} />
                            <Metric label="Velocity" value={`${p.avgDailySales.toFixed(1)}/d`} />
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                              <p className="text-xs font-bold text-slate-300 leading-tight">{p.status}</p>
                            </div>
                          </div>
                          <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                            <div style={{ width: `${percent}%` }} className={`absolute inset-y-0 left-0 rounded-full ${style.bar}`} />
                          </div>
                          <p className="text-[10px] font-medium text-amber-500/80 flex items-center gap-1.5 mt-2">
                            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                            {p.reason}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden sm:block space-y-4">
                    {data.alerts.products.map((p, i) => {
                      const style = severityMap[p.severity];
                      const percent = p.daysLeft === null ? 0 : Math.max(5, Math.min(100, (1 - (p.daysLeft / 30)) * 100));
                      return (
                        <motion.div key={`desktop-${p.product}-${p.unit}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all cursor-default relative overflow-hidden">
                          <div className="flex gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}>
                              <Package className={`w-6 h-6 ${style.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold text-white truncate">{p.product}</h4>
                                  <p className="text-xs font-medium text-slate-400">{p.unit}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${style.chip}`}>{p.severity}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-4 mb-4">
                                <Metric label="Days Remaining" value={p.daysLeft ?? "—"} color={style.text} />
                                <Metric label="Current Stock" value={p.quantity} />
                                <Metric label="Daily Velocity" value={`${p.avgDailySales.toFixed(1)}/d`} />
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                  <p className="text-xs font-bold text-slate-300">{p.status}</p>
                                </div>
                              </div>
                              <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1, delay: 0.2 }} className={`absolute inset-y-0 left-0 rounded-full ${style.bar}`} />
                              </div>
                              <p className="mt-4 text-xs font-medium text-amber-500/80 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                {p.reason}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Inventory Healthy</h4>
                </div>
              )}

              {/* SAFE PRODUCTS SUMMARY */}
              {hasAlerts && data.noAlerts.length > 0 && (
                <div className="pt-2 sm:pt-4 border-t border-white/10 flex items-center justify-between mx-4 sm:mx-0">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {data.noAlerts.length} Products Safe
                  </div>
                  <Link href="/inventory" className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:text-cyan-300 flex items-center gap-1 group">
                    Manage <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Metric({ label, value, color = "text-white" }: { label: string; value: any; color?: string; }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-base font-bold ${color}`}>{value}</p>
    </div>
  );
}
