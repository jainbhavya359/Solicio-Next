"use client";

import { Activity, AlertTriangle, CheckCircle2, Package, Clock, TrendingUp } from "lucide-react";

interface StockMovementItem {
  product: string;
  unit: string;
  daysSinceLastSale: number | null;
  score: number;
  category?: "fast" | "warming" | "slow" | "dead" | "never-sold";
}

interface Props {
  stockMovementScore?: number;
  productCount?: number;
  slowStockPct?: number;
  slowMovingCount?: number;
  deadStockCount?: number;
  breakdown?: StockMovementItem[];
}

export default function StockMovementCard({
  stockMovementScore = 0,
  productCount = 0,
  slowStockPct = 0,
  slowMovingCount = 0,
  deadStockCount = 0,
  breakdown = [],
}: Props) {
  const scoreColor =
    stockMovementScore >= 20
      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
      : stockMovementScore >= 10
        ? "text-amber-600 bg-amber-50 border-amber-100"
        : "text-rose-600 bg-rose-50 border-rose-100";

  const healthLabel =
    stockMovementScore >= 20
      ? "Healthy"
      : stockMovementScore >= 10
        ? "Slowing"
        : "Stagnant";

  const fast = breakdown.filter(b => b.category === "fast");
  const warming = breakdown.filter(b => b.category === "warming");
  const slow = breakdown.filter(
    b => b.category === "slow" || b.category === "dead"
  );

  const totalTracked = fast.length + warming.length + slow.length || 1;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-0 overflow-hidden h-full flex flex-col">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Stock Movement</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stockMovementScore}</span>
            <span className="text-sm text-slate-400 font-medium">/ 30</span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border capitalize flex items-center gap-1.5 ${scoreColor}`}>
          {stockMovementScore >= 20 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {healthLabel}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
            <div className="text-slate-900 text-xl font-bold mb-0.5">
              {productCount}
            </div>
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Products</div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-center">
            <div className="text-amber-600 text-xl font-bold mb-0.5">
              {slowMovingCount}
            </div>
            <div className="text-[10px] font-medium text-amber-600/80 uppercase tracking-wide">Slow</div>
          </div>

          <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 text-center">
            <div className="text-rose-600 text-xl font-bold mb-0.5">
              {deadStockCount}
            </div>
            <div className="text-[10px] font-medium text-rose-600/80 uppercase tracking-wide">Dead</div>
          </div>
        </div>

        {/* DISTRIBUTION BAR */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider">Velocity Mix</span>
          </div>

          <div className="h-4 flex rounded-full overflow-hidden w-full bg-slate-100">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(fast.length / totalTracked) * 100 || 0}%` }}
            />
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${(warming.length / totalTracked) * 100 || 0}%` }}
            />
            <div
              className="bg-rose-400 h-full transition-all duration-500"
              style={{ width: `${(slow.length / totalTracked) * 100 || 0}%` }}
            />
          </div>

          <div className="flex justify-between text-xs font-medium text-slate-500 px-1">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Fast</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /> Warming</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400" /> Slow</span>
          </div>
        </div>

        {/* RISK INSIGHT */}
        <div className={`p-4 rounded-xl border flex gap-3 ${slowStockPct > 0
            ? "bg-amber-50 border-amber-100 text-amber-900"
            : "bg-emerald-50 border-emerald-100 text-emerald-900"
          }`}>
          <div className={`mt-0.5 flex-shrink-0 ${slowStockPct > 0 ? "text-amber-500" : "text-emerald-500"}`}>
            {slowStockPct > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <p className="text-sm font-medium leading-normal">
            {slowStockPct > 0 ? (
              <>
                <span className="font-bold">{slowStockPct}%</span> of inventory value is tied up in slow-moving items.
              </>
            ) : (
              "All stocked products are moving within healthy timeframes."
            )}
          </p>
        </div>
      </div>

      {/* EXAMPLES FOOTER */}
      {fast.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Top Mover
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fast[0].daysSinceLastSale} days ago
            </span>
          </div>
          <p className="font-bold text-slate-900 truncate">
            {fast[0].product}
          </p>
        </div>
      )}
    </div>
  );
}

