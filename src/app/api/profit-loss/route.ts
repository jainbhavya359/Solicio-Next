// src/app/api/profit-loss/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!email || !from || !to) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // 🔹 1. Get IDs of reversed originals
  const reversed = await LedgerEntry.find(
    { email, isReversal: true },
    { reversedEntryId: 1 }
  ).lean();

  const reversedIds = reversed
    .map(r => r.reversedEntryId)
    .filter(Boolean);

  // 🔹 2. Fetch valid sales only
  const rows = await LedgerEntry.find({
    email,
    voucherType: "Sale",
    isReversal: false,
    _id: { $nin: reversedIds }, // ⭐ KEY FIX
    date: { $gte: new Date(from), $lte: new Date(to) },
  }).lean();

  const map: Record<string, { product: string; sales: number; cogs: number }> = {};
  let totalSales = 0;
  let totalCOGS = 0;

  rows.forEach(r => {
    if (!map[r.itemName]) {
      map[r.itemName] = {
        product: r.itemName,
        sales: 0,
        cogs: 0,
      };
    }

    map[r.itemName].sales += r.amount;
    map[r.itemName].cogs  += r.costAmount || 0;

    totalSales += r.amount;
    totalCOGS  += r.costAmount || 0;
  });

  return NextResponse.json({
    summary: {
      sales: totalSales,
      cogs: totalCOGS,
      profit: totalSales - totalCOGS,
    },
    products: Object.values(map),
  });
}
