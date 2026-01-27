"use client";

import { CheckCircle, AlertTriangle } from "lucide-react";

export interface SlowMovingItem {
  product: string;
  unit: string;
  quantity: number;
  value: number;
  daysSinceLastSale: number | null;
  category: "slow" | "dead";
}

interface Props {
  slowMovingCount: number;
  slowStockValue: number;
  slowMoving: SlowMovingItem[];
  open: boolean;
  onToggle: () => void;
}

export default function SlowMovingStockView({
  slowMovingCount,
  slowStockValue,
  slowMoving,
  open,
  onToggle,
}: Props) {
  const isHealthy = slowMovingCount === 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center
          ${isHealthy ? "bg-emerald-100" : "bg-amber-100"}`}
        >
          {isHealthy ? (
            <CheckCircle className="text-emerald-600" />
          ) : (
            <AlertTriangle className="text-amber-600" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">
            Inventory Movement
          </h3>

          <p className="text-sm text-slate-600 mt-1">
            {isHealthy ? (
              "All products have moved within the last 30 days."
            ) : (
              <>
                <span className="font-medium">
                  {slowMovingCount} item
                  {slowMovingCount > 1 ? "s" : ""}
                </span>{" "}
                haven’t sold recently ·{" "}
                <span className="font-medium">
                  ₹{slowStockValue.toLocaleString()}
                </span>{" "}
                at risk
              </>
            )}
          </p>

          {!isHealthy && (
            <button
              onClick={onToggle}
              className="mt-3 text-sm text-emerald-600 hover:underline"
            >
              Review slow-moving products →
            </button>
          )}
        </div>
      </div>

      {/* Healthy state */}
      {isHealthy && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            Inventory turnover looks healthy.
          </div>

          <div className="mt-4 border-t border-slate-200" />

          {/* Reassurance metrics */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <span>
              <strong className="text-slate-900">
                {slowMoving.length + slowMovingCount || "All"}
              </strong>{" "}
              products actively moving
            </span>

            <span>
              <strong className="text-slate-900">₹0</strong> capital blocked
            </span>

            <span>All sales activity within 30 days</span>
          </div>
        </div>
      )}



      {/* Expanded list */}
      {!isHealthy && open && (
        <div className="mt-6 border-t border-slate-200 pt-4 space-y-3">
          {slowMoving.map(item => (
            <div
              key={`${item.product}-${item.unit}`}
              className="flex justify-between items-center rounded-lg border border-slate-200 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {item.product}
                </p>
                <p className="text-xs text-slate-500">
                  {item.unit} · Qty {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  ₹{item.value.toLocaleString()}
                </p>
                <p
                  className={`text-xs ${
                    item.category === "dead"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }`}
                >
                  {item.daysSinceLastSale === null
                    ? "Never sold"
                    : `${item.daysSinceLastSale} days since last sale`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
