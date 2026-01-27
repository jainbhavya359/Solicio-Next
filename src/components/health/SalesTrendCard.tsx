"use client";

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
      ? "text-emerald-400"
      : growthPercentage < 0
      ? "text-rose-400"
      : "text-slate-400";

  const momentumColor =
    momentum === "accelerating"
      ? "text-emerald-400"
      : momentum === "slowing"
      ? "text-amber-400"
      : "text-slate-400";

  const volatilityColor =
    volatilityRatio > 1
      ? "text-rose-400"
      : volatilityRatio > 0.6
      ? "text-amber-400"
      : "text-emerald-400";

  const priceColor =
    priceTrend === "up"
      ? "text-emerald-400"
      : priceTrend === "down"
      ? "text-amber-400"
      : "text-slate-400";

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-slate-900 font-semibold">
          Sales Health
        </h3>
        <span className={`font-semibold ${
          salesHealthScore >= 70
            ? "text-emerald-600"
            : salesHealthScore >= 40
            ? "text-amber-600"
            : "text-rose-600"
        }`}>
          {salesHealthScore} / 100
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Based on growth, momentum, stability, and pricing quality
      </p>

      {/* WEEK COMPARISON */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">This week</p>
          <p className="text-slate-900 font-medium">
            ₹{thisWeekSales.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Last week</p>
          <p className="text-slate-900 font-medium">
            ₹{lastWeekSales.toLocaleString()}
          </p>
        </div>
      </div>

      {/* GROWTH */}
      <p className={`text-sm font-medium ${growthColor}`}>
        {growthPercentage > 0 && "▲ "}
        {growthPercentage < 0 && "▼ "}
        {growthPercentage}% week-over-week
      </p>

      {/* SIGNALS */}
      <div className="flex justify-between text-xs text-slate-600">
        <span>
          Momentum: <span className={`font-medium ${momentumColor}`}>{momentum}</span>
        </span>
        <span>
          Active days: <span className="font-medium text-slate-900">{activeDays}</span>
        </span>
      </div>

      <div className="flex justify-between text-xs text-slate-600">
        <span>
          Volatility: <span className={`font-medium ${volatilityColor}`}>{volatilityRatio}</span>
        </span>
        <span>
          Price trend: <span className={`font-medium ${priceColor}`}>{priceTrend}</span>
        </span>
      </div>

      {/* RISKS */}
      {risks.length > 0 && (
        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs font-medium text-rose-600 mb-1">Risks</p>
          <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
            {risks.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}


// "use client";

// interface Props {
//   salesTrendScore?: number;
//   thisWeekSales?: number;
//   lastWeekSales?: number;
//   growthPercentage?: number;
// }

// export default function SalesTrendCard({
//   salesTrendScore = 0,
//   thisWeekSales = 0,
//   lastWeekSales = 0,
//   growthPercentage = 0,
// }: Props) {
//   const trendColor =
//     growthPercentage > 0
//       ? "text-emerald-400"
//       : growthPercentage < 0
//       ? "text-rose-400"
//       : "text-slate-400";

//   return (
//     <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
//       <div className="flex justify-between mb-3">
//         <h3 className="text-white font-semibold">
//           Sales Trend
//         </h3>
//         <span className="text-indigo-400 font-bold">
//           {salesTrendScore} / 25
//         </span>
//       </div>

//       <div className="grid grid-cols-2 gap-4 text-sm mb-2">
//         <div>
//           <p className="text-slate-400">This week</p>
//           <p className="text-white">₹{thisWeekSales}</p>
//         </div>
//         <div>
//           <p className="text-slate-400">Last week</p>
//           <p className="text-white">₹{lastWeekSales}</p>
//         </div>
//       </div>

//       <p className={`text-sm font-medium ${trendColor}`}>
//         {growthPercentage > 0 && "▲ "}
//         {growthPercentage < 0 && "▼ "}
//         {growthPercentage}% change
//       </p>
//     </div>
//   );
// }

