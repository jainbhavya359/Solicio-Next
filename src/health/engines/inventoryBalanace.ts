import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { TotalStock } from "@/src/models/totalStockModel";

/**
 * Convert stock-to-sales ratio → score (0–25)
 */
function scoreFromRatio(ratio: number): number {
  if (ratio <= 0.5) return 25;   // lean inventory
  if (ratio <= 0.8) return 18;
  if (ratio <= 1.2) return 10;
  return 0;                     // overstocked
}

export async function computeInventoryBalance(email: string) {
  const DAYS = 30;
  const today = new Date();

  /* ---------- STOCK VALUE ---------- */
  const stock = await TotalStock.find({ email }).select("price").lean();

  const totalStockValue = stock.reduce(
    (s, i) => s + (i.price || 0),
    0
  );

  /* ---------- SALES ---------- */
  const since = new Date(today.getTime() - DAYS * 86400000);

  const sales = await LedgerEntry.find({
    email,
    voucherType: "Sale",
    isReversal: false,
    date: { $gte: since },
  }).select("amount date").lean();

  const totalSalesValue = sales.reduce(
    (s, e) => s + (e.amount || 0),
    0
  );

  const avgDailySales =
    totalSalesValue > 0 ? totalSalesValue / DAYS : 0;

  /* ---------- INVENTORY COVER ---------- */
  const inventoryCoverDays =
    avgDailySales > 0
      ? Number((totalStockValue / avgDailySales).toFixed(1))
      : Infinity;

  /* ---------- TREND (15 DAYS) ---------- */
  const since15 = new Date(today.getTime() - 15 * 86400000);

  const purchases15 = await LedgerEntry.find({
    email,
    voucherType: "Purchase",
    isReversal: false,
    date: { $gte: since15 },
  }).select("amount").lean();

  const sales15 = await LedgerEntry.find({
    email,
    voucherType: "Sale",
    isReversal: false,
    date: { $gte: since15 },
  }).select("amount").lean();

  const purchaseValue15 = purchases15.reduce(
    (s, p) => s + (p.amount || 0),
    0
  );

  const salesValue15 = sales15.reduce(
    (s, s2) => s + (s2.amount || 0),
    0
  );

  const inventoryTrend =
    purchaseValue15 > salesValue15
      ? "building"
      : purchaseValue15 < salesValue15
      ? "reducing"
      : "stable";

  /* ---------- CAPITAL LOCK ---------- */
  const capitalLockedPct =
    totalStockValue + totalSalesValue > 0
      ? Number(
          (
            (totalStockValue /
              (totalStockValue + totalSalesValue)) *
            100
          ).toFixed(1)
        )
      : 0;

  /* ---------- RISK ---------- */
  const riskLevel =
    inventoryCoverDays <= 30
      ? "healthy"
      : inventoryCoverDays <= 60
      ? "watch"
      : "critical";

  /* ---------- SCORE ---------- */
  let score = 0;

  score += scoreFromRatio(
    totalSalesValue > 0
      ? totalStockValue / totalSalesValue
      : Infinity
  );

  if (inventoryCoverDays <= 30) score += 25;
  else if (inventoryCoverDays <= 60) score += 15;

  if (inventoryTrend === "reducing") score += 20;
  else if (inventoryTrend === "stable") score += 10;

  if (capitalLockedPct < 40) score += 15;
  else if (capitalLockedPct < 60) score += 8;

  if (totalSalesValue > 0) score += 15;

  return {
    inventoryHealthScore: Math.min(100, score),

    /* Raw values */
    totalStockValue,
    totalSalesValue,
    avgDailySales,
    inventoryCoverDays,

    /* Intelligence */
    inventoryTrend,
    capitalLockedPct,
    riskLevel,

    /* Legacy */
    stockToSalesRatio:
      totalSalesValue > 0
        ? Number((totalStockValue / totalSalesValue).toFixed(2))
        : null,
  };
}
