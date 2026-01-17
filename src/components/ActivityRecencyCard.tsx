"use client";

interface Props {
  activityRecencyScore?: number;
  daysInactive?: number | null;
  lastActivityDate?: string | null;
}

export default function ActivityRecencyCard({
  activityRecencyScore = 0,
  daysInactive = null,
  lastActivityDate = null,
}: Props) {
  const inactivityColor =
    daysInactive === null
      ? "text-slate-400"
      : daysInactive > 14
      ? "text-rose-400"
      : daysInactive > 7
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">
          Activity Recency
        </h3>
        <span className="text-cyan-400 font-bold">
          {activityRecencyScore} / 20
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Based on latest purchase or sale activity
      </p>

      {lastActivityDate ? (
        <>
          <div className="text-sm text-white">
            {new Date(lastActivityDate).toDateString()}
          </div>

          <p className={`mt-2 text-sm ${inactivityColor}`}>
            {daysInactive} days inactive
          </p>
        </>
      ) : (
        <p className="text-sm text-rose-400">
          No activity recorded yet
        </p>
      )}
    </div>
  );
}
