"use client";

import { CheckCircle } from "lucide-react";

/* -------------------- TYPES -------------------- */

export interface SlowMovingItem {
  product: string;
  unit: string;
  quantity: number;
  lastMovedAt: string | null;
  daysSinceMovement: number | null;
}

interface Props {
  slowMovingCount: number;
  slowMoving: SlowMovingItem[];
  open: boolean;
  onToggle: () => void;
}

/* -------------------- COMPONENT -------------------- */

export default function SlowMovingStockView({
  slowMovingCount,
  slowMoving,
  open,
  onToggle,
}: Props) {
  const isHealthy = slowMovingCount === 0;

  return (
    <section className="rounded-3xl p-6 bg-white/10 border border-white/15 backdrop-blur-xl">
      {/* Header */}
      <div className="flex gap-4">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center
          ${isHealthy ? "bg-emerald-500/20" : "bg-amber-500/20"}`}
        >
          {isHealthy ? "✅" : "📉"}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            Slow-Moving Stock
          </h3>

          <p className="text-sm text-slate-300 mt-1">
            {isHealthy
              ? "All products have moved in the last 30 days."
              : `${slowMovingCount} item${
                  slowMovingCount > 1 ? "s" : ""
                } haven’t moved in over 30 days.`}
          </p>

          {!isHealthy && (
            <button
              onClick={onToggle}
              className="mt-3 text-sm text-emerald-400 hover:underline"
            >
              Analyze products →
            </button>
          )}
        </div>
      </div>

      {/* Healthy state */}
      {isHealthy && (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          Inventory turnover looks healthy.
        </div>
      )}

      {/* Expanded list */}
      {!isHealthy && open && slowMoving.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-4 space-y-3">
          {slowMoving.map(p => (
            <div
              key={`${p.product}-${p.unit}`}
              className="p-4 border border-white/10 rounded-xl"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-white">{p.product}</p>
                  <p className="text-xs text-slate-400">{p.unit}</p>
                </div>

                <span className="text-xs text-slate-400">
                  Qty: {p.quantity}
                </span>
              </div>

              <div className="text-sm text-slate-300 mt-2">
                {p.daysSinceMovement !== null ? (
                  <p>
                    Last moved{" "}
                    <span className="font-semibold">
                      {p.daysSinceMovement} days ago
                    </span>
                  </p>
                ) : (
                  <p>No recorded movement</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
