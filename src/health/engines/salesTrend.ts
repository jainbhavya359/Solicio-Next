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

/**
 * 🔥 PURE ENGINE FUNCTION
 * No HTTP, no NextRequest, no NextResponse
 */
export async function computeSalesTrend(email: string) {
  const today = new Date();

  const startThisWeek = new Date(today);
  startThisWeek.setDate(today.getDate() - 7);

  const startLastWeek = new Date(today);
  startLastWeek.setDate(today.getDate() - 14);

  // 1️⃣ Fetch sales from last 14 days
  const sales = await LedgerEntry.find({
    email,
    voucherType: "Sale",
    isReversal: false,
    date: { $gte: startLastWeek },
  }).select("amount date");

  let thisWeekSales = 0;
  let lastWeekSales = 0;

  // 2️⃣ Split into week buckets
  for (const sale of sales) {
    if (sale.date >= startThisWeek) {
      thisWeekSales += sale.amount;
    } else {
      lastWeekSales += sale.amount;
    }
  }

  // 3️⃣ Growth %
  let growth = 0;
  if (lastWeekSales > 0) {
    growth =
      ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100;
  }

  const salesTrendScore = scoreFromGrowth(
    growth,
    lastWeekSales,
    thisWeekSales
  );

  // ✅ ALWAYS return a plain object
  return {
    salesTrendScore, // 0–25
    thisWeekSales,
    lastWeekSales,
    growthPercentage: Number(growth.toFixed(2)),
  };
}
