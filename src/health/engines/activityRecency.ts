import { LedgerEntry } from "@/src/models/LedgerEntryModel";

/**
 * Convert days inactive → activity recency score (0–20)
 */
function scoreFromDays(days: number): number {
  if (days <= 1) return 20;
  if (days <= 3) return 15;
  if (days <= 7) return 10;
  if (days <= 14) return 5;
  return 0;
}


export async function computeActivityRecency(email: string) {
  const LOOKBACK_DAYS = 30;
  const today = new Date();

  const entries = await LedgerEntry.find({
    email,
    isReversal: false,
    date: {
      $gte: new Date(today.getTime() - LOOKBACK_DAYS * 86400000),
    },
  })
    .sort({ date: -1 })
    .select("date voucherType")
    .lean();

  if (!entries.length) {
    return {
      activityHealthScore: 0,
      status: "inactive",
    };
  }

  const lastDate = new Date(entries[0].date);
  const daysInactive = Math.floor(
    (today.getTime() - lastDate.getTime()) / 86400000
  );

  const uniqueDays = new Set(
    entries.map(e => e.date.toISOString().slice(0, 10))
  ).size;

  const avgGap = LOOKBACK_DAYS / uniqueDays;

  const recent7 = entries.filter(
    e => today.getTime() - new Date(e.date).getTime() <= 7 * 86400000
  ).length;

  const prev7 = entries.filter(
    e =>
      today.getTime() - new Date(e.date).getTime() > 7 * 86400000 &&
      today.getTime() - new Date(e.date).getTime() <= 14 * 86400000
  ).length;

  const trend =
    recent7 > prev7 ? "up" : recent7 < prev7 ? "down" : "flat";

  const typeCounts: Record<string, number> = {};
  for (const e of entries) {
    typeCounts[e.voucherType] =
      (typeCounts[e.voucherType] ?? 0) + 1;
  }

  const recencyScore = scoreFromDays(daysInactive);
  const consistencyScore =
    uniqueDays >= 20 ? 20 :
    uniqueDays >= 15 ? 15 :
    uniqueDays >= 8  ? 10 :
    uniqueDays >= 4  ? 5  : 0;

  const risk =
    daysInactive <= avgGap * 1.5
      ? "normal"
      : daysInactive <= avgGap * 3
      ? "warning"
      : "critical";

  const activityHealthScore =
    recencyScore * 1.25 +
    consistencyScore +
    (trend === "up" ? 15 : trend === "flat" ? 8 : 0);

  return {
    activityHealthScore: Math.min(100, Math.round(activityHealthScore)),
    lastActivityDate: lastDate,
    daysInactive,
    avgGapDays: Number(avgGap.toFixed(1)),
    activeDays: uniqueDays,
    trend,
    activityMix: typeCounts,
    riskLevel: risk,
  };
}
