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

export async function computeStockMovement(email: string) {
  /* --------------------------------------------------
     1️⃣ Aggregate LAST movement + LAST sale (single scan)
  -------------------------------------------------- */
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
        _id: {
          name: "$itemName",
          unit: "$unit",
        },
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

  /* --------------------------------------------------
     2️⃣ Fetch current stock only
  -------------------------------------------------- */
  const stock = await TotalStock.find({
    email,
    quantity: { $gt: 0 },
  }).lean();

  const movementMap = new Map<
    string,
    { lastMovedAt: Date | null; lastSaleAt: Date | null }
  >();

  for (const m of movements) {
    const key = `${m._id.name}|${m._id.unit}`;
    movementMap.set(key, {
      lastMovedAt: m.lastMovedAt || null,
      lastSaleAt: m.lastSaleAt || null,
    });
  }

  const now = Date.now();
  const slowCutoff = new Date(now - DAYS_SLOW_THRESHOLD * 86400000);

  let totalScore = 0;
  let productCount = 0;

  const breakdown = [];
  const slowMoving = [];

  /* --------------------------------------------------
     3️⃣ Derive metrics
  -------------------------------------------------- */
  for (const s of stock) {
    const key = `${s.name}|${s.unit}`;
    const m = movementMap.get(key);

    const lastMovedAt = m?.lastMovedAt || null;
    const lastSaleAt = m?.lastSaleAt || null;

    const daysSinceSale = lastSaleAt
      ? Math.floor((now - lastSaleAt.getTime()) / 86400000)
      : null;

    const score = scoreFromDays(daysSinceSale);

    if (daysSinceSale !== null) {
      totalScore += score;
      productCount++;
    }

    breakdown.push({
      product: s.name,
      unit: s.unit,
      daysSinceLastSale: daysSinceSale,
      score,
    });

    if (!lastMovedAt || lastMovedAt < slowCutoff) {
      slowMoving.push({
        product: s.name,
        unit: s.unit,
        quantity: s.quantity,
        lastMovedAt,
        daysSinceMovement: lastMovedAt
          ? Math.floor((now - lastMovedAt.getTime()) / 86400000)
          : null,
      });
    }
  }

  return {
    stockMovementScore:
      productCount === 0
        ? 0
        : Math.round(totalScore / productCount),

    productCount,
    breakdown,
    slowMovingCount: slowMoving.length,
    slowMoving,
  };
}

