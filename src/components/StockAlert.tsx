"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { TrendingDown, CheckCircle } from "lucide-react";

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
  quantity: number;
  avgDailySales: number;
  daysLeft: number | null;
  message: string;
}

function getProgressMeta(
  daysLeft: number | null,
  severity?: Severity
) {
  if (daysLeft === null) {
    return {
      percent: 100,
      color: "bg-emerald-500",
      label: "No sales trend",
    };
  }

  const maxDays = 30; // cap visual scale
  const percent = Math.min((daysLeft / maxDays) * 100, 100);

  if (severity === "CRITICAL")
    return { percent, color: "bg-red-500", label: "Critical" };
  if (severity === "MEDIUM")
    return { percent, color: "bg-yellow-400", label: "Warning" };
  if (severity === "LOW")
    return { percent, color: "bg-orange-400", label: "Low" };

  return { percent, color: "bg-emerald-500", label: "Healthy" };
}


function StockDaysProgress({
  daysLeft,
  severity,
}: {
  daysLeft: number | null;
  severity?: Severity;
}) {
  const { percent, color, label } = getProgressMeta(daysLeft, severity);

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        {daysLeft !== null && <span>{daysLeft} days</span>}
      </div>

      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}


export default function StockAlertSmart() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [data, setData] = useState<{
    alerts: {
      count: number;
      products: StockAlert[];
    };
    noAlerts: NoAlertExplanation[];
  } | null>(null);

  const [open, setOpen] = useState(false);

  const severityColor: Record<Severity, string> = {
    CRITICAL: "text-red-500",
    MEDIUM: "text-yellow-400",
    LOW: "text-orange-400",
  };

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/low-stock?email=${email}`)
      .then(res => setData(res.data))
      .catch(() =>
        setData({
          alerts: { count: 0, products: [] },
          noAlerts: [],
        })
      );
  }, [email]);

  if (!data || data.alerts.count === 0) return null;

  return (
    <section className="rounded-3xl p-6 bg-white/10 border border-white/15 backdrop-blur-xl">
      {/* Header */}
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-xl bg-orange-400/20 flex items-center justify-center">
          <TrendingDown className="text-orange-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            Low Stock Alert
          </h3>

          <p className="text-sm text-slate-300 mt-1">
            {data.alerts.count} product
            {data.alerts.count > 1 ? "s" : ""} need attention based on stock rules.
          </p>

          <button
            onClick={() => setOpen(v => !v)}
            className="mt-3 text-sm text-indigo-400 hover:underline"
          >
            {open ? "Hide analysis" : "Analyze products"} →
          </button>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div className="mt-5 border-t border-white/10 pt-4 space-y-6">
          {/* 🔴 ALERTED PRODUCTS */}
          <div className="space-y-3">
            {data.alerts.products.map(a => (
              <div
                key={`${a.product}-${a.unit}`}
                className="p-4 border border-white/10 rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">{a.product}</p>
                    <p className="text-xs text-slate-400">{a.unit}</p>
                  </div>

                  <span
                    className={`text-xs font-semibold ${severityColor[a.severity]}`}
                  >
                    {a.severity}
                  </span>
                </div>

                <div className="text-sm text-slate-300 mt-2 space-y-1">
                  <p>Qty: {a.quantity}</p>
                  <p>Avg Daily Sales: {a.avgDailySales}</p>

                  <StockDaysProgress
                    daysLeft={a.daysLeft}
                    severity={a.severity}
                  />

                  <p className="text-xs text-slate-400 mt-1">
                    {a.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 🟢 WHY NO ALERT */}
          {data.noAlerts.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Products not flagged
              </h4>

              <div className="space-y-2">
                {data.noAlerts.map(p => (
                  <div
                    key={`${p.product}-${p.unit}`}
                    className="text-sm text-slate-400"
                  >
                    <span className="font-medium text-slate-300">
                      {p.product}
                    </span>{" "}
                    — {p.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

