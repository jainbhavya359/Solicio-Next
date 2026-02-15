"use client";

import {
  AlertTriangle,
  Lightbulb,
  Wallet,
} from "lucide-react";

const ICONS: Record<string, any> = {
  danger: Wallet,
  warning: AlertTriangle,
  info: Lightbulb,
};

const STYLES: Record<
  string,
  { border: string; bg: string; icon: string }
> = {
  danger: {
    border: "border-rose-200",
    bg: "bg-rose-50",
    icon: "text-rose-600",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    icon: "text-amber-600",
  },
  info: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
  },
};

export default function AlertCard({ alert }: { alert: any }) {
  const Icon = ICONS[alert.type] || Lightbulb;
  const style = STYLES[alert.type] || STYLES.info;

  return (
    <div
      className={`rounded-xl border ${style.border} ${style.bg} p-5`}
    >
      {/* HEADER */}
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
          <Icon className={`w-5 h-5 ${style.icon}`} />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">
            {alert.title}
          </h4>

          {/* SUMMARY (preferred over repeating "why") */}
          <p className="text-sm text-slate-600 mt-0.5">
            {alert.summary || alert.why}
          </p>

          {alert.confidence && (
            <p className="text-xs text-slate-500 mt-1">
              Based on {alert.confidence}
            </p>
          )}
        </div>
      </div>

      {/* IMPACT */}
      {alert.impact && (
        <div className="mt-3 text-sm text-slate-700">
          <span className="font-medium">Impact:</span>{" "}
          {alert.impact}
        </div>
      )}

      {/* META (only when useful) */}
      {alert.meta && (
        <div className="mt-3 text-xs text-slate-600 space-y-1">
          {alert.meta.marginPercent && (
            <div>
              Margin:{" "}
              <span className="font-medium">
                {alert.meta.marginPercent}%
              </span>{" "}
              · Units sold: {alert.meta.unitsSold}
            </div>
          )}

          {alert.meta.totalPending && (
            <div>
              Pending: ₹{alert.meta.totalPending.toLocaleString()} ·
              Oldest: {alert.meta.oldestDays} days
            </div>
          )}
        </div>
      )}

      {/* ACTION */}
      <div className="mt-3 text-sm font-medium text-indigo-600">
        👉 {alert.action}
      </div>
    </div>
  );
}
