"use client";

import StockMovementCard from "./StockMovementCard";
import SalesTrendCard from "./SalesTrendCard";
import InventoryBalanceCard from "./InventoryBalanceCard";
import ActivityRecencyCard from "./ActivityRecencyCard";
import { useBusinessHealth } from "@/src/hooks/useBusinessHealth";

export default function BusinessHealthCard({ email }: { email: string }) {
  const { data, loading } = useBusinessHealth(email);

  if (loading) {
    return (
      <div className="rounded-3xl p-6 bg-white/10 border border-white/10">
        <p className="text-slate-400 text-sm">
          Calculating business health…
        </p>
      </div>
    );
  }

  if (!data) return null;

  const color =
    data.healthScore >= 80
      ? "text-emerald-400"
      : data.healthScore >= 60
      ? "text-indigo-400"
      : data.healthScore >= 40
      ? "text-yellow-400"
      : "text-rose-400";

  return (
    <section className="rounded-3xl p-6 bg-white/10 border border-white/15 backdrop-blur-xl space-y-6">
      <h3 className="text-lg font-semibold text-white">
        Business Health
      </h3>

      {/* SCORE */}
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Background ring */}
          <svg className="absolute w-full h-full rotate-[-90deg]">
            <circle
              cx="50%"
              cy="50%"
              r="44"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
          </svg>

          {/* Animated progress ring */}
          <svg className="absolute w-full h-full rotate-[-90deg]">
            <circle
              cx="50%"
              cy="50%"
              r="44"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={
                2 * Math.PI * 44 * (1 - data.healthScore / 100)
              }
              className={`${color} transition-all duration-1000 ease-out`}
            />
          </svg>

          {/* Center value */}
          <span className={`text-3xl font-bold ${color}`}>
            {data.healthScore}
          </span>
        </div>

        <div>
          <p className="text-sm text-slate-400">Status</p>
          <p className={`text-lg font-semibold ${color}`}>
            {data.status}
          </p>
        </div>
      </div>

      {/* BREAKDOWN */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {Object.entries(data.breakdown).map(([key, value]) => (
          <div key={key} className="text-slate-300">
            {key.replace("Score", "")}
            <span className="float-right text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* ENGINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockMovementCard {...data.stockMovement} />
        <SalesTrendCard {...data.salesTrend} />
        <InventoryBalanceCard {...data.inventoryBalance} />
        <ActivityRecencyCard {...data.activityRecency} />
      </div>

      {/* ALERTS */}
      {data.alerts?.length && (
        <div className="space-y-3">
          {data.alerts.map((a, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border ${
                a.type === "danger"
                  ? "border-rose-400/40 bg-rose-400/10"
                  : "border-yellow-400/40 bg-yellow-400/10"
              }`}
            >
              <p className="text-sm text-white">{a.message}</p>
              <p className="text-xs text-slate-400 mt-1">
                {a.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
