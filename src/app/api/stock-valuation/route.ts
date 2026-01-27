// src/app/api/stock-valuation/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { StockLayer } from "@/src/models/StockLayerModel";

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const date = searchParams.get("date");

  if (!email || !date) {
    return NextResponse.json(
      { error: "email and date are required" },
      { status: 400 }
    );
  }

  const asOfDate = new Date(date);

  /* --------------------------------------------------
     1️⃣ Fetch FIFO layers valid at date
  -------------------------------------------------- */
  const layers = await StockLayer.find({
    email,
    date: { $lte: asOfDate },
    qtyRemaining: { $gt: 0 },
  }).lean();

  /* --------------------------------------------------
     2️⃣ Aggregate by product + unit
  -------------------------------------------------- */
  const map = new Map<
    string,
    {
      product: string;
      unit: string;
      quantity: number;
      totalValue: number;
    }
  >();

  for (const l of layers) {
    const key = `${l.productName}|${l.unit}`;

    if (!map.has(key)) {
      map.set(key, {
        product: l.productName,
        unit: l.unit,
        quantity: 0,
        totalValue: 0,
      });
    }

    const entry = map.get(key)!;

    entry.quantity += l.qtyRemaining;
    entry.totalValue += l.qtyRemaining * l.rate;
  }

  /* --------------------------------------------------
     3️⃣ Finalize (derive rate)
  -------------------------------------------------- */
  const result = Array.from(map.values()).map(p => ({
    product: p.product,
    unit: p.unit,
    quantity: p.quantity,
    rate:
      p.quantity > 0
        ? Number((p.totalValue / p.quantity).toFixed(2))
        : 0,
    value: Number(p.totalValue.toFixed(2)),
  }));

  return NextResponse.json({
    asOf: asOfDate.toISOString(),
    count: result.length,
    items: result,
  });
}
