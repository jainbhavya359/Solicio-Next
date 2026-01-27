import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { TotalStock } from "@/src/models/totalStockModel";

const DAYS_SLOW_THRESHOLD = 30;

/**
 * Convert days since last sale → movement score (0–30)
 */
function scoreFromDays(days: number | null): number {
  if (days == null) return 0;
  if (days <= 7) return 30;
  if (days <= 14) return 20;
  if (days <= 30) return 10;
  return 0;
}


function categoryFromDays(days: number | null) {
  if (days === null) return "never-sold";
  if (days <= 7) return "fast";
  if (days <= 14) return "warming";
  if (days <= 30) return "slow";
  return "dead";
}

export async function computeStockMovement(email: string) {
  const DAYS_SLOW = 30;
  const DAYS_DEAD = 60;
  const now = Date.now();

  /* ---------- MOVEMENT AGG ---------- */
  const movements = await LedgerEntry.aggregate([
    {
      $match: {
        email,
        isReversal: false,
        voucherType: {
          $in: ["Purchase", "Sale", "PurchaseReturn", "SaleReturn"],
        },
      },
    },
    {
      $group: {
        _id: { name: "$itemName", unit: "$unit" },
        lastMovedAt: { $max: "$date" },
        lastSaleAt: {
          $max: {
            $cond: [
              { $eq: ["$voucherType", "Sale"] },
              "$date",
              null,
            ],
          },
        },
      },
    },
  ]);

  /* ---------- STOCK ---------- */
  const stock = await TotalStock.find({
    email,
    quantity: { $gt: 0 },
  }).lean();

  const movementMap = new Map<string, any>();
  movements.forEach(m => {
    movementMap.set(`${m._id.name}|${m._id.unit}`, m);
  });

  let totalScore = 0;
  let scoredProducts = 0;

  let totalStockValue = 0;
  let slowStockValue = 0;
  let deadStockValue = 0;

  const breakdown = [];
  const slowMoving = [];
  const deadStock = [];

  for (const s of stock) {
    const key = `${s.name}|${s.unit}`;
    const m = movementMap.get(key);

    const lastSaleAt = m?.lastSaleAt || null;
    const lastMovedAt = m?.lastMovedAt || null;

    const daysSinceSale = lastSaleAt
      ? Math.floor((now - lastSaleAt.getTime()) / 86400000)
      : null;

    const score = scoreFromDays(daysSinceSale);
    if (daysSinceSale !== null) {
      totalScore += score;
      scoredProducts++;
    }

    const value = (s.quantity || 0) * (s.price || 0);
    totalStockValue += value;
    
    const category = categoryFromDays(daysSinceSale);

    if (category === "slow" || category === "dead") {
      slowStockValue += value;
      slowMoving.push({
        product: s.name,
        unit: s.unit,
        quantity: s.quantity,
        daysSinceLastSale: daysSinceSale,
        value,
        category,
      });
    }

    if (category === "dead") {
      deadStockValue += value;
      deadStock.push({
        product: s.name,
        unit: s.unit,
        quantity: s.quantity,
        daysSinceLastSale: daysSinceSale,
        value,
      });
    }

    breakdown.push({
      product: s.name,
      unit: s.unit,
      daysSinceLastSale: daysSinceSale,
      score,
      category,
    });

  }

  return {
    stockMovementScore:
      scoredProducts === 0
        ? 0
        : Math.round(totalScore / scoredProducts),

    productCount: stock.length,

    /* Portfolio insight */
    totalStockValue,
    slowStockValue,
    deadStockValue,
    slowStockPct:
      totalStockValue > 0
        ? Number(
            ((slowStockValue / totalStockValue) * 100).toFixed(1)
          )
        : 0,

    /* Lists */
    breakdown,
    slowMoving,
    deadStock,

    slowMovingCount: slowMoving.length,
    deadStockCount: deadStock.length,
  };
}
