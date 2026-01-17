"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import StockMovementCard from "./StockMovementCard";
import SalesTrendCard from "./SalesTrendCard";
import InventoryBalanceCard from "./InventoryBalanceCard";
import ActivityRecencyCard from "./ActivityRecencyCard";

export default function BusinessHealthCard({ email }: { email: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/health/summary?email=${email}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [email]);

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
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Business Health
        </h3>

        {data.trend && (
          <span
            className={`text-sm ${
              data.trend.direction === "up"
                ? "text-emerald-400"
                : data.trend.direction === "down"
                ? "text-rose-400"
                : "text-slate-400"
            }`}
          >
            {data.trend.direction === "up" && "↑"}
            {data.trend.direction === "down" && "↓"}
            {data.trend.change}
          </span>
        )}
      </div>

      {/* SCORE */}
      <div className="flex items-center gap-6">
        <div className="w-28 h-28 rounded-full border-8 border-white/10 flex items-center justify-center">
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
        {Object.entries(data.breakdown).map(([k, v]: any) => (
          <div key={k} className="text-slate-300">
            {k.replace("Score", "")}
            <span className="float-right text-white">{v}</span>
          </div>
        ))}
      </div>

      {/* ENGINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockMovementCard
            stockMovementScore={data.stockMovement.stockMovementScore}
            productCount={data.stockMovement.productCount}
            breakdown={data.stockMovement.breakdown}
        />

        <SalesTrendCard
            salesTrendScore={data.salesTrend.salesTrendScore}
            thisWeekSales={data.salesTrend.thisWeekSales}
            lastWeekSales={data.salesTrend.lastWeekSales}
            growthPercentage={data.salesTrend.growthPercentage}
        />

        <InventoryBalanceCard
            inventoryBalanceScore={data.inventoryBalance.inventoryBalanceScore}
            totalStockValue={data.inventoryBalance.totalStockValue}
            totalSalesValue={data.inventoryBalance.totalSalesValue}
            stockToSalesRatio={data.inventoryBalance.stockToSalesRatio}
        />

        <ActivityRecencyCard
            activityRecencyScore={data.activityRecency.activityRecencyScore}
            daysInactive={data.activityRecency.daysInactive}
            lastActivityDate={data.activityRecency.lastActivityDate}
        />
        </div>


      {/* ALERTS */}
      {data.alerts?.length > 0 && (
        <div className="space-y-3">
          {data.alerts.map((a: any, i: number) => (
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