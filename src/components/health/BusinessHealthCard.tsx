"use client";

import { useBusinessHealth } from "@/src/hooks/useBusinessHealth";
import StockMovementCard from "./StockMovementCard";
import SalesTrendCard from "./SalesTrendCard";
import InventoryBalanceCard from "./InventoryBalanceCard";
import ActivityRecencyCard from "./ActivityRecencyCard";

export default function BusinessHealthCard({ email }: { email: string }) {
  const { data, loading } = useBusinessHealth(email);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Calculating business health…
        </p>
      </div>
    );
  }

  if (!data) return null;

  const scoreColor =
    data.healthScore >= 80
      ? "text-emerald-600"
      : data.healthScore >= 60
      ? "text-indigo-600"
      : data.healthScore >= 40
      ? "text-amber-600"
      : "text-rose-600";

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8 space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Business Health
        </h2>
        <p className="text-sm text-slate-500">
          Overall diagnostic across sales, inventory, and activity
        </p>
      </div>

      {/* ================= HERO ================= */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 rounded-2xl bg-white border border-slate-200 p-6">
        {/* SCORE */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={
                  2 * Math.PI * 48 * (1 - data.healthScore / 100)
                }
                className={`${scoreColor} transition-all duration-700`}
              />
            </svg>

            <span className={`text-3xl font-bold ${scoreColor}`}>
              {data.healthScore}
            </span>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className={`text-xl font-semibold ${scoreColor}`}>
              {data.status}
            </p>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 text-sm mt-6 md:mt-0">
          {Object.entries(data.breakdown).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between text-slate-600"
            >
              <span>{key.replace("Score", "")}</span>
              <span className="font-medium text-slate-900">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PRIMARY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTrendCard {...data.salesTrend} />
        <StockMovementCard {...data.stockMovement} />
      </div>

      {/* ================= SECONDARY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryBalanceCard {...data.inventoryBalance} />
        <ActivityRecencyCard {...data.activityRecency} />
      </div>

      {/* ================= ALERTS ================= */}
      {(data.alerts?.length ?? 0) > 0 && (
        <div className="space-y-3">
          {data.alerts?.map((a, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                a.type === "danger"
                  ? "border-rose-200 bg-rose-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <p className="text-sm font-medium text-slate-900">
                {a.message}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {a.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
