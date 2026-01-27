import { LedgerEntry } from "@/src/models/LedgerEntryModel";

/**
 * Convert growth percentage → sales trend score (0–25)
 */
function scoreFromGrowth(
  growth: number,
  lastWeekSales: number,
  thisWeekSales: number
): number {
  if (lastWeekSales === 0 && thisWeekSales > 0) return 15;
  if (lastWeekSales === 0 && thisWeekSales === 0) return 0;

  if (growth > 10) return 25;
  if (growth >= 0) return 18;
  if (growth >= -10) return 10;
  return 0;
}


export async function computeSalesTrend(email: string) {
  const today = new Date();
  const start = new Date(today.getTime() - 14 * 86400000);

  const entries = await LedgerEntry.find({
    email,
    voucherType: "Sale",
    isReversal: false,
    date: { $gte: start },
  })
    .select("amount creditQty date")
    .lean();

  /* ---------- DAILY AGGREGATION ---------- */
  const dailyMap: Record<string, { sales: number; qty: number }> = {};

  for (const e of entries) {
    const day = new Date(e.date).toISOString().slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { sales: 0, qty: 0 };
    dailyMap[day].sales += e.amount;
    dailyMap[day].qty += e.creditQty || 0;
  }

  const days: { date: string; sales: number; qty: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000)
      .toISOString()
      .slice(0, 10);
    days.push({
      date: d,
      sales: dailyMap[d]?.sales ?? 0,
      qty: dailyMap[d]?.qty ?? 0,
    });
  }

  /* ---------- WEEK SPLITS ---------- */
  const lastWeek = days.slice(0, 7);
  const thisWeek = days.slice(7);

  const sum = (arr: any[], k: string) =>
    arr.reduce((s, d) => s + d[k], 0);

  const lastWeekSales = sum(lastWeek, "sales");
  const thisWeekSales = sum(thisWeek, "sales");

  const growthPct =
    lastWeekSales > 0
      ? ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100
      : thisWeekSales > 0
      ? 100
      : 0;

  /* ---------- ACTIVITY ---------- */
  const activeDays = days.filter(d => d.sales > 0).length;

  /* ---------- CONSISTENCY ---------- */
  const avgDailySales =
    days.reduce((s, d) => s + d.sales, 0) / 14;

  const variance =
    days.reduce(
      (s, d) => s + Math.pow(d.sales - avgDailySales, 2),
      0
    ) / 14;

  const volatilityRatio =
    avgDailySales > 0
      ? Math.sqrt(variance) / avgDailySales
      : 0;

  /* ---------- MOMENTUM ---------- */
  const momentum =
    thisWeekSales / 7 > lastWeekSales / 7
      ? "accelerating"
      : thisWeekSales / 7 < lastWeekSales / 7
      ? "slowing"
      : "flat";

  /* ---------- PRICE QUALITY ---------- */
  const avgPriceThis =
    sum(thisWeek, "qty") > 0
      ? thisWeekSales / sum(thisWeek, "qty")
      : null;

  const avgPriceLast =
    sum(lastWeek, "qty") > 0
      ? lastWeekSales / sum(lastWeek, "qty")
      : null;

  const priceTrend =
    avgPriceThis && avgPriceLast
      ? avgPriceThis > avgPriceLast
        ? "up"
        : avgPriceThis < avgPriceLast
        ? "down"
        : "flat"
      : "unknown";

  /* ---------- SCORE ---------- */
  let score = 0;

  if (growthPct > 10) score += 25;
  else if (growthPct > 0) score += 18;
  else if (growthPct > -10) score += 10;

  if (momentum === "accelerating") score += 20;
  else if (momentum === "flat") score += 10;

  if (volatilityRatio < 0.5) score += 20;
  else if (volatilityRatio < 1) score += 10;

  if (activeDays >= 10) score += 15;
  else if (activeDays >= 5) score += 8;

  if (priceTrend === "up") score += 20;
  else if (priceTrend === "flat") score += 10;

  /* ---------- RISKS ---------- */
  const risks: string[] = [];
  if (volatilityRatio > 1)
    risks.push("Sales are highly volatile");
  if (growthPct > 15 && volatilityRatio > 0.8)
    risks.push("Growth may not be stable");
  if (priceTrend === "down")
    risks.push("Growth driven by lower pricing");

  return {
    salesHealthScore: Math.min(100, score),

    /* Core */
    thisWeekSales,
    lastWeekSales,
    growthPercentage: Number(growthPct.toFixed(2)),
    momentum,
    activeDays,

    /* Quality */
    avgDailySales: Number(avgDailySales.toFixed(0)),
    volatilityRatio: Number(volatilityRatio.toFixed(2)),
    priceTrend,

    /* Timeline */
    dailyTrend: days,

    /* Flags */
    risks,
  };
}
