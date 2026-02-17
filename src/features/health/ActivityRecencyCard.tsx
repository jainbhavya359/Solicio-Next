"use client";

import { Clock, Calendar, Zap, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  activityHealthScore?: number;
  daysInactive?: number | null;
  lastActivityDate?: string | null;
  trend?: "up" | "down" | "flat";
  riskLevel?: "normal" | "warning" | "critical";
  activeDays?: number;
  avgGapDays?: number;
  activityMix?: Record<string, number>;
}

export default function ActivityRecencyCard({
  activityHealthScore = 0,
  daysInactive = null,
  lastActivityDate = null,
  trend = "flat",
  riskLevel = "normal",
  activeDays,
  avgGapDays,
  activityMix = {},
}: Props) {
  const riskColor =
    riskLevel === "critical"
      ? "text-rose-600 bg-rose-50 border-rose-100"
      : riskLevel === "warning"
        ? "text-amber-600 bg-amber-50 border-amber-100"
        : "text-emerald-600 bg-emerald-50 border-emerald-100";

  const trendIcon =
    trend === "up" ? <TrendingUp className="w-4 h-4" /> :
      trend === "down" ? <TrendingDown className="w-4 h-4" /> :
        <Minus className="w-4 h-4" />;

  const trendColor =
    trend === "up" ? "text-emerald-600" :
      trend === "down" ? "text-rose-600" :
        "text-slate-400";

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-0 overflow-hidden h-full flex flex-col">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Activity Health</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{activityHealthScore}</span>
            <span className="text-sm text-slate-400 font-medium">/ 100</span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border capitalize flex items-center gap-1.5 ${riskColor}`}>
          {riskLevel === "normal" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {riskLevel}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        {/* STATUS */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${daysInactive && daysInactive > 7 ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600"
            }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-0.5">Last Active</p>
            {lastActivityDate ? (
              <p className="text-lg font-bold text-slate-900">
                {new Date(lastActivityDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                <span className="text-sm font-normal text-slate-500 ml-2">
                  ({daysInactive} days ago)
                </span>
              </p>
            ) : (
              <p className="text-sm font-medium text-slate-400">No activity yet</p>
            )}
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Active Days</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{activeDays ?? 0}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">Avg Gap</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{avgGapDays ?? 0} <span className="text-xs font-normal text-slate-400">days</span></p>
          </div>
        </div>

        {/* TREND */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
          <span className="text-sm text-slate-600 font-medium">Activity Trend</span>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 font-semibold text-sm ${trendColor}`}>
            {trendIcon}
            <span className="capitalize">{trend}</span>
          </div>
        </div>
      </div>

      {/* ACTIVITY MIX FOOTER */}
      {activityMix && Object.keys(activityMix).length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity Mix</p>
          <div className="flex gap-4">
            {Object.entries(activityMix).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <div className="h-1.5 w-full bg-slate-200 rounded-full mb-1 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(Number(v), 100)}%` }} />
                </div>
                <span className="text-xs text-slate-600 capitalize">
                  {k} <span className="font-bold text-slate-900">{v}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
