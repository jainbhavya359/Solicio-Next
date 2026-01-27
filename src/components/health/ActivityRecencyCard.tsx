"use client";

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
      ? "text-rose-400"
      : riskLevel === "warning"
      ? "text-amber-400"
      : "text-emerald-400";

  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-rose-400"
      : "text-slate-400";

  const totalActivity = Object.values(activityMix).reduce(
    (s, v) => s + v,
    0
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-slate-900 font-semibold">
          Activity Health
        </h3>
        <span
          className={`font-semibold ${
            activityHealthScore >= 70
              ? "text-emerald-600"
              : activityHealthScore >= 40
              ? "text-amber-600"
              : "text-rose-600"
          }`}
        >
          {activityHealthScore} / 100
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Based on recency, consistency, and usage pattern
      </p>

      {/* STATUS */}
      {lastActivityDate ? (
        <div className="space-y-1">
          <p className="text-sm text-slate-900">
            Last activity:{" "}
            <span className="font-medium">
              {new Date(lastActivityDate).toDateString()}
            </span>
          </p>

          <p className={`text-sm ${riskColor}`}>
            {daysInactive} days inactive · {riskLevel}
          </p>
        </div>
      ) : (
        <p className="text-sm text-rose-600">
          No activity recorded yet
        </p>
      )}

      {/* BEHAVIOR METRICS */}
      {(activeDays !== undefined || avgGapDays !== undefined) && (
        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 text-sm">
          {activeDays !== undefined && (
            <div>
              <p className="text-slate-500 text-xs">
                Active days
              </p>
              <p className="text-slate-900 font-medium">
                {activeDays}
              </p>
            </div>
          )}

          {avgGapDays !== undefined && (
            <div>
              <p className="text-slate-500 text-xs">
                Avg gap
              </p>
              <p className="text-slate-900 font-medium">
                {avgGapDays} days
              </p>
            </div>
          )}
        </div>
      )}

      {/* TREND */}
      <div className="flex justify-between text-xs text-slate-600">
        <span>
          Trend:{" "}
          <span
            className={`font-medium ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                ? "text-rose-600"
                : "text-slate-500"
            }`}
          >
            {trend}
          </span>
        </span>
      </div>

      {/* ACTIVITY MIX */}
      {activityMix && Object.keys(activityMix).length > 0 && (
        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2">
            Activity mix
          </p>

          <div className="flex gap-4 text-xs">
            {Object.entries(activityMix).map(([k, v]) => (
              <div key={k} className="text-slate-600">
                {k}:{" "}
                <span className="font-medium text-slate-900">
                  {v}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// "use client";

// interface Props {
//   activityRecencyScore?: number;
//   daysInactive?: number | null;
//   lastActivityDate?: string | null;
// }

// export default function ActivityRecencyCard({
//   activityRecencyScore = 0,
//   daysInactive = null,
//   lastActivityDate = null,
// }: Props) {
//   const inactivityColor =
//     daysInactive === null
//       ? "text-slate-400"
//       : daysInactive > 14
//       ? "text-rose-400"
//       : daysInactive > 7
//       ? "text-amber-400"
//       : "text-emerald-400";

//   return (
//     <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-white font-semibold">
//           Activity Recency
//         </h3>
//         <span className="text-cyan-400 font-bold">
//           {activityRecencyScore} / 20
//         </span>
//       </div>

//       <p className="text-xs text-slate-400 mb-3">
//         Based on latest purchase or sale activity
//       </p>

//       {lastActivityDate ? (
//         <>
//           <div className="text-sm text-white">
//             {new Date(lastActivityDate).toDateString()}
//           </div>

//           <p className={`mt-2 text-sm ${inactivityColor}`}>
//             {daysInactive} days inactive
//           </p>
//         </>
//       ) : (
//         <p className="text-sm text-rose-400">
//           No activity recorded yet
//         </p>
//       )}
//     </div>
//   );
// }
