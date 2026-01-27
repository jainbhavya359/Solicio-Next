import connect from "@/src/dbConfig/dbConnection";
import { Products } from "@/src/models/ProductModel";
import { calculateCompositeStock } from "@/src/utils/compositeStock";
import { NextRequest, NextResponse } from "next/server";

const DAY = 86400000;

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const products = await Products.find({ email }).lean();
  const now = Date.now();

  let totalStockValue = 0;
  let totalQuantity = 0;
  let slowValue = 0;

  let fast = 0, warming = 0, slow = 0, dead = 0, neverSold = 0;

  const breakdown = [];

  for (const p of products) {
    const quantity =
      p.productType === "composite"
        ? await calculateCompositeStock(p, null)
        : p.quantity;

    const stockValue = quantity * (p.sellingPrice ?? 0);

    totalQuantity += quantity;
    totalStockValue += stockValue;

    let daysSinceLastSale: number | null = null;
    let category:
      | "fast"
      | "warming"
      | "slow"
      | "dead"
      | "never-sold" = "never-sold";

    if (p.lastSaleAt) {
      daysSinceLastSale = Math.floor(
        (now - new Date(p.lastSaleAt).getTime()) / DAY
      );

      if (daysSinceLastSale <= 7) category = "fast", fast++;
      else if (daysSinceLastSale <= 14) category = "warming", warming++;
      else if (daysSinceLastSale <= 30) category = "slow", slow++, slowValue += stockValue;
      else category = "dead", dead++, slowValue += stockValue;
    } else {
      neverSold++;
      slowValue += stockValue;
    }

    breakdown.push({
      product: p.name,
      unit: p.unit,
      quantity,
      price: p.sellingPrice ?? 0,
      stockValue,
      daysSinceLastSale,
      category,
      productType: p.productType,
    });
  }

  const slowStockPct =
    totalStockValue > 0
      ? Math.round((slowValue / totalStockValue) * 100)
      : 0;

  return NextResponse.json({
    summary: {
      productCount: breakdown.length,
      totalQuantity,
      totalStockValue,
      slowStockPct,
    },
    breakdown,
  });
}
