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
  /* --------------------------------------------------
     1️⃣ Current inventory value
  -------------------------------------------------- */
  const stock = await TotalStock.find({ email }).select("price");

  const totalStockValue = stock.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  );

  /* --------------------------------------------------
     2️⃣ Sales value (last 30 days)
  -------------------------------------------------- */
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const sales = await LedgerEntry.find({
    email,
    voucherType: "Sale",
    isReversal: false,
    date: { $gte: since },
  }).select("amount");

  const totalSalesValue = sales.reduce(
    (sum, s) => sum + (s.amount || 0),
    0
  );

  /* --------------------------------------------------
     3️⃣ Ratio + score
  -------------------------------------------------- */
  const stockToSalesRatio =
    totalSalesValue > 0
      ? Number((totalStockValue / totalSalesValue).toFixed(2))
      : Infinity;

  const inventoryBalanceScore =
    totalSalesValue === 0
      ? 0
      : scoreFromRatio(stockToSalesRatio);

  return {
    inventoryBalanceScore, // 0–25
    totalStockValue,
    totalSalesValue,
    stockToSalesRatio,
  };
}
