"use client";

import { TrendingUp, AlertCircle, ArrowUp, ArrowDown, Activity } from "lucide-react";

interface Props {
  salesHealthScore?: number;
  thisWeekSales?: number;
  lastWeekSales?: number;
  growthPercentage?: number;
  momentum?: "accelerating" | "slowing" | "flat";
  activeDays?: number;
  volatilityRatio?: number;
  priceTrend?: "up" | "down" | "flat" | "unknown";
  risks?: string[];
}

export default function SalesTrendCard({
  salesHealthScore = 0,
  thisWeekSales = 0,
  lastWeekSales = 0,
  growthPercentage = 0,
  momentum = "flat",
  activeDays = 0,
  volatilityRatio = 0,
  priceTrend = "unknown",
  risks = [],
}: Props) {
  const growthColor =
    growthPercentage > 0
      ? "text-emerald-600"
      : growthPercentage < 0
        ? "text-rose-600"
        : "text-slate-500";

  const growthBg =
    growthPercentage > 0
      ? "bg-emerald-50"
      : growthPercentage < 0
        ? "bg-rose-50"
        : "bg-slate-50";

  const momentumColor =
    momentum === "accelerating"
      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
      : momentum === "slowing"
        ? "text-amber-600 bg-amber-50 border-amber-100"
        : "text-slate-600 bg-slate-50 border-slate-100";

  const volatilityColor =
    volatilityRatio > 1
      ? "text-rose-600"
      : volatilityRatio > 0.6
        ? "text-amber-600"
        : "text-emerald-600";

  const priceColor =
    priceTrend === "up"
      ? "text-emerald-600"
      : priceTrend === "down"
        ? "text-amber-600"
        : "text-slate-500";

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-0 overflow-hidden h-full flex flex-col">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sales Health</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{salesHealthScore}</span>
            <span className="text-sm text-slate-400 font-medium">/ 100</span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${salesHealthScore >= 70 ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
            salesHealthScore >= 40 ? "bg-amber-50 border-amber-100 text-amber-700" :
              "bg-rose-50 border-rose-100 text-rose-700"
          }`}>
          {salesHealthScore >= 70 ? "Healthy" : salesHealthScore >= 40 ? "Needs Attention" : "Critical"}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        {/* WEEK COMPARISON */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">This Week</p>
            <p className="text-2xl font-bold text-slate-900">₹{thisWeekSales.toLocaleString()}</p>
          </div>

          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${growthBg} ${growthColor} font-medium text-sm`}>
            {growthPercentage > 0 ? <ArrowUp className="w-4 h-4" /> : growthPercentage < 0 ? <ArrowDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            <span>{Math.abs(growthPercentage)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Last Week</p>
            <p className="text-lg font-semibold text-slate-700">₹{lastWeekSales.toLocaleString()}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Active Days</p>
            <p className="text-lg font-semibold text-slate-700">{activeDays} / 7</p>
          </div>
        </div>

        {/* SIGNALS */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Momentum</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border capitalize ${momentumColor}`}>
              {momentum}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Volatility</span>
            <span className={`font-semibold ${volatilityColor}`}>
              {volatilityRatio}x
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Price Trend</span>
            <span className={`font-semibold capitalize ${priceColor}`}>
              {priceTrend}
            </span>
          </div>
        </div>
      </div>

      {/* RISKS footer */}
      {risks.length > 0 && (
        <div className="px-6 py-4 bg-rose-50/50 border-t border-rose-100">
          <div className="flex items-center gap-2 mb-2 text-rose-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Risk Factors</span>
          </div>
          <ul className="space-y-1">
            {risks.map((r, i) => (
              <li key={i} className="text-xs text-rose-600/80 pl-2 border-l-2 border-rose-200">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {risks.length === 0 && (
        <div className="px-6 py-4 bg-emerald-50/50 border-t border-emerald-100 mt-auto">
          <p className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-2">
            All metrics look healthy
          </p>
        </div>
      )}
    </div>
  );
}

