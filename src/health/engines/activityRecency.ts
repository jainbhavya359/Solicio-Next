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

/**
 * 🔥 PURE ENGINE FUNCTION
 */
export async function computeActivityRecency(email: string) {
  /* --------------------------------------------------
     1️⃣ Fetch latest activity
  -------------------------------------------------- */
  const latest = await LedgerEntry.findOne({
    email,
    isReversal: false,
  })
    .sort({ date: -1, createdAt: -1 })
    .select("date")
    .lean();

  /* --------------------------------------------------
     2️⃣ No activity case
  -------------------------------------------------- */
  if (!latest) {
    return {
      activityRecencyScore: 0,
      daysInactive: null,
      lastActivityDate: null,
    };
  }

  const today = new Date();

  const daysInactive = Math.floor(
    (today.getTime() - new Date(latest.date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const activityRecencyScore = scoreFromDays(daysInactive);

  return {
    activityRecencyScore, // 0–20
    daysInactive,
    lastActivityDate: latest.date,
  };
}
