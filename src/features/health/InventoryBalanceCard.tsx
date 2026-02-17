"use client";

import { Package, RefreshCw, AlertTriangle, CheckCircle2, DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  inventoryHealthScore?: number;
  totalStockValue?: number;
  totalSalesValue?: number;
  avgDailySales?: number;
  inventoryCoverDays?: number;
  inventoryTrend?: "building" | "reducing" | "stable";
  capitalLockedPct?: number;
  riskLevel?: "healthy" | "watch" | "critical";
}

export default function InventoryBalanceCard({
  inventoryHealthScore = 0,
  totalStockValue = 0,
  totalSalesValue = 0,
  avgDailySales = 0,
  inventoryCoverDays,
  inventoryTrend = "stable",
  capitalLockedPct = 0,
  riskLevel = "healthy",
}: Props) {
  const riskColor =
    riskLevel === "critical"
      ? "text-rose-600 bg-rose-50 border-rose-100"
      : riskLevel === "watch"
        ? "text-amber-600 bg-amber-50 border-amber-100"
        : "text-emerald-600 bg-emerald-50 border-emerald-100";

  const trendIcon =
    inventoryTrend === "building" ? <TrendingUp className="w-4 h-4" /> :
      inventoryTrend === "reducing" ? <TrendingDown className="w-4 h-4" /> :
        <Minus className="w-4 h-4" />;

  const trendColor =
    inventoryTrend === "building"
      ? "text-amber-600 bg-amber-50 border-amber-100"
      : inventoryTrend === "reducing"
        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
        : "text-slate-600 bg-slate-50 border-slate-100";

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-0 overflow-hidden h-full flex flex-col">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Inventory Health</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{inventoryHealthScore}</span>
            <span className="text-sm text-slate-400 font-medium">/ 100</span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border capitalize flex items-center gap-1.5 ${riskColor}`}>
          {riskLevel === "healthy" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {riskLevel}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        {/* KEY METRIC */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-0.5">Inventory Cover</p>
            {inventoryCoverDays !== undefined ? (
              <p className="text-lg font-bold text-slate-900">
                {inventoryCoverDays} <span className="text-sm font-normal text-slate-500">days</span>
              </p>
            ) : (
              <p className="text-sm font-medium text-slate-400">Not available</p>
            )}
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Stock Value</span>
            </div>
            <p className="text-lg font-bold text-slate-900">₹{totalStockValue.toLocaleString()}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs font-medium">Monthly Sales</span>
            </div>
            <p className="text-lg font-bold text-slate-900">₹{totalSalesValue.toLocaleString()}</p>
          </div>
        </div>

        {/* TREND & CAPITAL */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Inventory Trend</span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-semibold uppercase ${trendColor}`}>
              {trendIcon}
              <span className="capitalize">{inventoryTrend}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Capital Locked</span>
            <span className="font-semibold text-slate-700">{capitalLockedPct}%</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Avg Daily Sales</span>
          <span className="font-bold text-slate-900">₹{avgDailySales.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
