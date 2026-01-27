"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const PRIORITY_STYLES: Record<
  string,
  { border: string; bg: string; accent: string }
> = {
  danger: {
    border: "border-rose-200",
    bg: "bg-rose-50",
    accent: "text-rose-700",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    accent: "text-amber-700",
  },
  info: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    accent: "text-emerald-700",
  },
};

export default function DecisionAlertCard({ alert }: { alert: any }) {
  const [open, setOpen] = useState(false);
  const style = PRIORITY_STYLES[alert.type] || PRIORITY_STYLES.info;

  return (
    <div
      className={`rounded-xl border ${style.border} ${style.bg} p-4`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-900">
            {alert.title}
          </h3>

          <p className="text-sm text-slate-700 mt-0.5">
            {alert.summary || alert.why}
          </p>
        </div>

        {alert.priority && (
          <span className="text-xs text-slate-500">
            Priority {alert.priority}
          </span>
        )}
      </div>

      {/* IMPACT (compressed) */}
      {alert.impact && (
        <div className="mt-2 text-sm text-slate-600">
          <span className="font-medium">Impact:</span>{" "}
          {alert.impact}
        </div>
      )}

      {/* ACTION */}
      <div className={`mt-3 text-sm font-medium ${style.accent}`}>
        👉 {alert.action}
      </div>

      {/* META TOGGLE */}
      {alert.meta && (
        <button
          onClick={() => setOpen(v => !v)}
          className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
        >
          {open ? "Hide details" : "View details"}
          <ChevronDown
            className={`w-3 h-3 transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* META CONTENT (curated, not raw) */}
      {open && alert.meta && (
        <div className="mt-2 text-xs text-slate-600 space-y-1">
          {alert.meta.marginPercent && (
            <div>
              Margin:{" "}
              <strong>{alert.meta.marginPercent}%</strong> ·
              Units sold: {alert.meta.unitsSold}
            </div>
          )}

          {alert.meta.totalPending && (
            <div>
              Pending: ₹{alert.meta.totalPending.toLocaleString()} ·
              Oldest: {alert.meta.oldestDays} days
            </div>
          )}

          {alert.meta.topDefaulters && (
            <div>
              Top defaulters:{" "}
              {alert.meta.topDefaulters
                .map((d: any) => d.partyName)
                .join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
