import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { TotalStock } from "@/src/models/totalStockModel";

const DAYS_THRESHOLD = 14;
const MIN_BLOCKED_VALUE = 10000; // ₹10,000

export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const today = new Date();

    /* ---------------------------------------------------
       1️⃣ Get latest SALE date per product
    --------------------------------------------------- */
    const sales = await LedgerEntry.find({
      email,
      voucherType: "Sale",
      isReversal: false,
    }).select("itemName date");

    const lastSaleMap = new Map<string, Date>();

    for (const sale of sales) {
      const prev = lastSaleMap.get(sale.itemName);
      if (!prev || sale.date > prev) {
        lastSaleMap.set(sale.itemName, sale.date);
      }
    }

    /* ---------------------------------------------------
       2️⃣ Get current stock
    --------------------------------------------------- */
    const stock = await TotalStock.find({ email }).lean();

    const alerts: any[] = [];

    /* ---------------------------------------------------
       3️⃣ Evaluate stagnation
    --------------------------------------------------- */
    for (const item of stock) {
      const itemName = item.itemName;
      const qty = item.quantity || 0;
      const price = item.purchasePrice || item.costPrice || 0;

      const stockValue = qty * price;

      if (stockValue < MIN_BLOCKED_VALUE) continue;

      const lastSaleDate = lastSaleMap.get(itemName);

      // Never sold → treat as high risk
      const daysSinceLastSale = lastSaleDate
        ? Math.floor(
            (today.getTime() - lastSaleDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : Infinity;

      if (daysSinceLastSale < DAYS_THRESHOLD) continue;

      alerts.push({
        type: "warning",
        title: "Stock not moving",
        why: `${itemName} hasn’t sold in ${daysSinceLastSale} days`,
        impact: `₹${stockValue.toLocaleString()} blocked in inventory`,
        action: "Discount, bundle, or stop reordering this product",
        entity: {
          type: "product",
          name: itemName,
        },
        metric: daysSinceLastSale,
        priority: 90,
      });
    }

    /* ---------------------------------------------------
       4️⃣ Sort by priority & impact
    --------------------------------------------------- */
    alerts.sort((a, b) => b.priority - a.priority);

    //console.log(alerts);

    return NextResponse.json({
      count: alerts.length,
      alerts,
    });

  } catch (err) {
    console.error("Stock stagnation alert error:", err);
    return NextResponse.json(
      { error: "Failed to generate stock stagnation alerts" },
      { status: 500 }
    );
  }
}
