"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Package, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";

/* ================= TYPES ================= */

type Severity = "CRITICAL" | "MEDIUM" | "LOW";

interface StockAlert {
  product: string;
  unit: string;
  quantity: number;
  avgDailySales: number;
  daysLeft: number | null;
  severity: Severity;
  reason: string;
}

interface NoAlertExplanation {
  product: string;
  unit: string;
  message: string;
}

/* ================= STYLE HELPERS ================= */

const severityMap: Record<
  Severity,
  { chip: string; bar: string; text: string; iconBg: string; iconColor: string }
> = {
  CRITICAL: {
    chip: "bg-rose-100 text-rose-700",
    bar: "bg-rose-500",
    text: "text-rose-600",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  MEDIUM: {
    chip: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
    text: "text-amber-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  LOW: {
    chip: "bg-orange-100 text-orange-700",
    bar: "bg-orange-400",
    text: "text-orange-600",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
};

/* ================= MAIN ================= */

export default function StockAlertSmart({ data }: { data: { alerts: { count: number; products: StockAlert[] }, noAlerts: NoAlertExplanation[], } | null }) {
  const [open, setOpen] = useState(true);

  if (!data) return null;

  const hasAlerts = data.alerts.count > 0;

  return (
    <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div
        className={`p-6 flex items-center justify-between transition-colors ${open ? "bg-slate-50/50 border-b border-slate-100" : ""}`}
      >
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${hasAlerts ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
            {hasAlerts ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Inventory Signals
            </h3>
            <p className="text-sm font-medium text-slate-500">
              {hasAlerts
                ? `${data.alerts.count} product${data.alerts.count > 1 ? "s" : ""} requiring attention`
                : "All stock levels are optimal"
              }
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
        >
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* LIST */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {hasAlerts ? (
                data.alerts.products.map((p, i) => {
                  const style = severityMap[p.severity];
                  const percent = p.daysLeft === null ? 0 : Math.max(5, Math.min(100, (1 - (p.daysLeft / 30)) * 100));

                  return (
                    <motion.div
                      key={`${p.product}-${p.unit}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-amber-200 transition-all cursor-default"
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}>
                          <Package className={`w-6 h-6 ${style.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-slate-900 truncate">
                                {p.product}
                              </h4>
                              <p className="text-xs font-medium text-slate-400">{p.unit}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${style.chip}`}>
                              {p.severity}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <Metric label="Days Remaining" value={p.daysLeft ?? "—"} color={style.text} />
                            <Metric label="Current Stock" value={p.quantity} />
                            <Metric label="Daily Velocity" value={`${p.avgDailySales.toFixed(1)}/d`} subgroup />
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                              <p className="text-xs font-bold text-slate-700">Refill Suggested</p>
                            </div>
                          </div>

                          {/* Progress Line */}
                          <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`absolute inset-y-0 left-0 rounded-full ${style.bar}`}
                            />
                          </div>

                          <p className="mt-3 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            {p.reason}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Inventory is Healthy</h4>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    All your tracked products have sufficient stock levels based on current sales velocity.
                  </p>
                </motion.div>
              )}

              {/* SAFE PRODUCTS SUMMARY */}
              {hasAlerts && data.noAlerts.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <CheckCircle className="h-4 w-4" />
                    {data.noAlerts.length} other products are safe
                  </div>
                  <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    Manage Stock <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ================= SUB ================= */

function Metric({ label, value, color = "text-slate-900", subgroup = false }: { label: string; value: any; color?: string; subgroup?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-base font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

