import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { StockLayer } from "@/src/models/StockLayerModel";

async function stockValueAsOf(email: string, date: Date) {
  const layers = await StockLayer.find({
    email,
    date: { $lte: date },
    qtyRemaining: { $gt: 0 },
  }).lean();

  return layers.reduce(
    (s, l) => s + l.qtyRemaining * l.rate,
    0
  );
}

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!email || !from || !to) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  /* ---------- STOCK ---------- */
  const openingStock = await stockValueAsOf(email, fromDate);
  const closingStock = await stockValueAsOf(email, toDate);

  /* ---------- SALES ---------- */
  const sales = await LedgerEntry.find({
    email,
    voucherType: "Sale",
    isReversal: false,
    date: { $gte: fromDate, $lte: toDate },
  }).lean();

  const totalSales = sales.reduce(
    (s, r) => s + (r.amount || 0),
    0
  );

  /* ---------- PURCHASES ---------- */
  const purchases = await LedgerEntry.find({
    email,
    voucherType: "Purchase",
    isReversal: false,
    date: { $gte: fromDate, $lte: toDate },
  }).lean();

  const totalPurchases = purchases.reduce(
    (s, r) => s + (r.amount || 0),
    0
  );

  /* ---------- EXPENSES ---------- */
  const expenses = await LedgerEntry.find({
    email,
    voucherType: "Expense",
    date: { $gte: fromDate, $lte: toDate },
  }).lean();

  const totalExpenses = expenses.reduce(
    (s, r) => s + (r.amount || 0),
    0
  );

  /* ---------- WRITE DOWNS ---------- */
  const writeOffs = await LedgerEntry.find({
    email,
    voucherType: "StockWriteOff",
    date: { $gte: fromDate, $lte: toDate },
  }).lean();

  const inventoryWriteDowns = writeOffs.reduce(
    (s, r) => s + (r.amount || 0),
    0
  );

  /* ---------- COGS ---------- */
  const cogs =
    openingStock +
    totalPurchases -
    closingStock;

  const grossProfit = totalSales - cogs;

  const netProfit =
    grossProfit -
    totalExpenses -
    inventoryWriteDowns;

  const grossMarginPct =
    totalSales === 0
      ? 0
      : Number(
          ((grossProfit / totalSales) * 100).toFixed(2)
        );

  return NextResponse.json({
    period: { from, to },
    summary: {
      openingStock,
      purchases: totalPurchases,
      closingStock,
      cogs,
      sales: totalSales,
      grossProfit,
      grossMarginPct,
      expenses: totalExpenses,
      inventoryWriteDowns,
      netProfit,
    },
  });
}
