"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { AlertTriangle, CheckCircle } from "lucide-react";

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
  { chip: string; bar: string; text: string }
> = {
  CRITICAL: {
    chip: "bg-rose-100 text-rose-700",
    bar: "bg-rose-500",
    text: "text-rose-600",
  },
  MEDIUM: {
    chip: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
    text: "text-amber-600",
  },
  LOW: {
    chip: "bg-orange-100 text-orange-700",
    bar: "bg-orange-400",
    text: "text-orange-600",
  },
};

/* ================= MAIN ================= */

export default function StockAlertSmart() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [data, setData] = useState<{
    alerts: { count: number; products: StockAlert[] };
    noAlerts: NoAlertExplanation[];
  } | null>(null);

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/low-stock?email=${email}`)
      .then(res => setData(res.data))
      .catch(() =>
        setData({ alerts: { count: 0, products: [] }, noAlerts: [] })
      );
  }, [email]);

  if (!data || data.alerts.count === 0) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Inventory alerts
            </h3>
            <p className="text-sm text-slate-500">
              {data.alerts.count} product
              {data.alerts.count > 1 ? "s" : ""} need attention
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="text-sm text-indigo-600 hover:underline"
        >
          {open ? "Hide details" : "View details"} →
        </button>
      </div>

      {/* LIST */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-3 overflow-hidden"
          >
            {data.alerts.products.map((p, i) => {
              const style = severityMap[p.severity];
              const percent =
                p.daysLeft === null
                  ? 40
                  : Math.min(100, (p.daysLeft / 30) * 100);

              return (
                <motion.div
                  key={`${p.product}-${p.unit}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-white border border-slate-200 p-4"
                >
                  {/* TOP ROW */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {p.product}
                      </p>
                      <p className="text-xs text-slate-500">{p.unit}</p>
                    </div>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${style.chip}`}
                    >
                      {p.severity}
                    </span>
                  </div>

                  {/* MAIN METRIC */}
                  <div className="mt-4 grid grid-cols-4 gap-4 items-end">
                    <div>
                      <p className="text-xs text-slate-500">Days left</p>
                      <p
                        className={`text-2xl font-semibold ${style.text}`}
                      >
                        {p.daysLeft ?? "—"}
                      </p>
                    </div>

                    <Meta label="Stock" value={p.quantity} />
                    <Meta
                      label="Avg / day"
                      value={p.avgDailySales}
                    />
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Status
                      </p>
                      <p className="text-sm text-slate-700">
                        Low stock
                      </p>
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div className="mt-3">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${style.bar}`}
                      />
                    </div>
                  </div>

                  {/* REASON */}
                  <p className="mt-2 text-xs text-slate-500">
                    {p.reason}
                  </p>
                </motion.div>
              );
            })}

            {/* SAFE */}
            {data.noAlerts.length > 0 && (
              <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                Products not flagged
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ================= SUB ================= */

function Meta({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}

