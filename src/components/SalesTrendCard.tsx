"use client";

interface Props {
  salesTrendScore?: number;
  thisWeekSales?: number;
  lastWeekSales?: number;
  growthPercentage?: number;
}

export default function SalesTrendCard({
  salesTrendScore = 0,
  thisWeekSales = 0,
  lastWeekSales = 0,
  growthPercentage = 0,
}: Props) {
  const trendColor =
    growthPercentage > 0
      ? "text-emerald-400"
      : growthPercentage < 0
      ? "text-rose-400"
      : "text-slate-400";

  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
      <div className="flex justify-between mb-3">
        <h3 className="text-white font-semibold">
          Sales Trend
        </h3>
        <span className="text-indigo-400 font-bold">
          {salesTrendScore} / 25
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
        <div>
          <p className="text-slate-400">This week</p>
          <p className="text-white">₹{thisWeekSales}</p>
        </div>
        <div>
          <p className="text-slate-400">Last week</p>
          <p className="text-white">₹{lastWeekSales}</p>
        </div>
      </div>

      <p className={`text-sm font-medium ${trendColor}`}>
        {growthPercentage > 0 && "▲ "}
        {growthPercentage < 0 && "▼ "}
        {growthPercentage}% change
      </p>
    </div>
  );
}

