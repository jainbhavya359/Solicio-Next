// src/app/api/reports/stock-valuation/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { StockLayer } from "@/src/models/StockLayerModel";

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const date = searchParams.get("date");

  if (!email || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const asOfDate = new Date(date);

  const layers = await StockLayer.find({
    email,
    date: { $lte: asOfDate },
    qtyRemaining: { $gt: 0 },
  }).lean();

  const map: any = {};

  layers.forEach(l => {
    if (!map[l.productName]) {
      map[l.productName] = {
        product: l.productName,
        unit: l.unit,
        quantity: 0,
        value: 0,
      };
    }

    map[l.productName].quantity += l.qtyRemaining;
    map[l.productName].value += l.qtyRemaining * l.rate;
  });

  return NextResponse.json(Object.values(map));
}
