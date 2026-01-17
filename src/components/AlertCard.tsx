"use client";

import {
  AlertTriangle,
  TrendingDown,
  Lightbulb,
  Wallet,
} from "lucide-react";

const ICONS: Record<string, any> = {
  danger: Wallet,
  warning: AlertTriangle,
  info: Lightbulb,
};

const COLORS: Record<string, string> = {
  danger: "border-rose-400/40 bg-rose-400/10 text-rose-400",
  warning: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
  info: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
};

export default function AlertCard({ alert }: { alert: any }) {
  const Icon = ICONS[alert.type] || TrendingDown;

  return (
    <div
      className={`rounded-2xl border p-4 space-y-2 ${COLORS[alert.type]}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <h4 className="font-semibold text-white">
          {alert.title}
        </h4>
      </div>

      {/* Why */}
      <p className="text-sm text-white/90">
        {alert.why}
      </p>

      {/* Impact */}
      <p className="text-xs text-white/70">
        Impact: {alert.impact}
      </p>

      {/* Action */}
      <div className="mt-2 text-xs font-medium text-white">
        👉 {alert.action}
      </div>
    </div>
  );
}
