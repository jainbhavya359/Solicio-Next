"use client";

import StockMovementCard from "./StockMovementCard";
import SalesTrendCard from "./SalesTrendCard";
import InventoryBalanceCard from "./InventoryBalanceCard";
import ActivityRecencyCard from "./ActivityRecencyCard";
import { Activity, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

// 1. Define a specific interface for your data
interface BusinessHealthData {
  healthScore: number;
  status: string;
  breakdown: Record<string, number | string>;
  salesTrend: any;
  stockMovement: any;
  inventoryBalance: any;
  activityRecency: any;
  alerts?: Array<{ type: string; message: string; suggestion: string }>;
}

export default function BusinessHealthCard({ data }: { data: BusinessHealthData }) {
  if (!data) return null;

  const scoreColor =
    data.healthScore >= 80
      ? "text-emerald-600"
      : data.healthScore >= 60
        ? "text-indigo-600"
        : data.healthScore >= 40
          ? "text-amber-600"
          : "text-rose-600";

  const strokeColor =
    data.healthScore >= 80
      ? "#059669" // emerald-600
      : data.healthScore >= 60
        ? "#4f46e5" // indigo-600
        : data.healthScore >= 40
          ? "#d97706" // amber-600
          : "#e11d48"; // rose-600

  return (
    <div className="space-y-8">
      {/* MAIN SCORE CARD */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -ml-16 -mb-16" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Business Health Score</h2>
              <p className="text-xs sm:text-sm text-slate-500">Real-time diagnostic of your business performance</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-12">
            {/* SCORE CIRCLE */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center relative">
                {/* Outer Glow */}
                <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${data.healthScore >= 80 ? "bg-emerald-500" : "bg-indigo-500"
                  }`} />

                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={strokeColor}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - data.healthScore / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl sm:text-4xl font-extrabold ${scoreColor}`}>
                    {data.healthScore}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Score</span>
                </div>
              </div>
            </div>

            {/* STATUS & BREAKDOWN */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 justify-center md:justify-start">
                <span className="text-sm sm:text-lg font-medium text-slate-600">Status:</span>
                <span className={`text-sm sm:text-xl font-bold px-3 py-0.5 sm:px-4 sm:py-1 rounded-full ${data.healthScore >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                  }`}>
                  {data.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(data.breakdown).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] sm:text-sm font-medium text-slate-500 capitalize">{key.replace("Score", "")}</span>
                    <span className="text-sm sm:text-lg font-bold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesTrendCard {...data.salesTrend} />
        <StockMovementCard {...data.stockMovement} />
        <InventoryBalanceCard {...data.inventoryBalance} />
        <ActivityRecencyCard {...data.activityRecency} />
      </div>

      {/* ALERTS */}
      {(data.alerts?.length ?? 0) > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-slate-900">Attention Required</h3>
          </div>

          {data.alerts?.map((a, i) => (
            <div
              key={i}
              className={`flex gap-4 p-4 rounded-xl border ${a.type === "danger"
                ? "border-rose-100 bg-rose-50 text-rose-900"
                : "border-amber-100 bg-amber-50 text-amber-900"
                }`}
            >
              <div className={`mt-0.5 p-1 rounded-full ${a.type === "danger" ? "bg-rose-200" : "bg-amber-200"
                }`}>
                <AlertCircle className={`w-4 h-4 ${a.type === "danger" ? "text-rose-600" : "text-amber-600"
                  }`} />
              </div>
              <div>
                <p className="font-semibold">{a.message}</p>
                <p className="text-sm opacity-80 mt-1">{a.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
