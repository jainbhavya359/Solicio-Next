// "use client";

import { useState } from "react";

export default function DecisionAlertCard({ alert }: { alert: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`
      rounded-2xl p-5 border
      ${alert.type === "danger"
        ? "border-rose-400/40 bg-rose-500/10"
        : alert.type === "warning"
        ? "border-yellow-400/40 bg-yellow-500/10"
        : "border-emerald-400/40 bg-emerald-500/10"}
    `}>
      <div className="flex justify-between items-start">
        <h3 className="text-white font-semibold">
          {alert.title}
        </h3>
        <span className="text-xs text-slate-400">
          Priority {alert.priority}
        </span>
      </div>

      <p className="text-sm mt-2 text-white/80">
        <strong>Why:</strong> {alert.why}
      </p>

      <p className="text-sm mt-1 text-white/80">
        <strong>Impact:</strong> {alert.impact}
      </p>

      <p className="text-sm mt-2 text-emerald-300">
        👉 {alert.action}
      </p>

      {alert.meta && (
        <button
          onClick={() => setOpen(!open)}
          className="mt-3 text-xs underline text-white/60"
        >
          {open ? "Hide details" : "View details"}
        </button>
      )}

      {open && alert.meta && (
        <div className="mt-3 text-xs text-white/70 space-y-1">
          {Object.entries(alert.meta).map(([k, v]) => (
            <div key={k}>
              {k}: {typeof v === "number" ? v.toLocaleString() : JSON.stringify(v)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
