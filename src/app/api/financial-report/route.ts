import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import { Products } from "@/src/models/ProductModel";
import { calculateCompositeStock } from "@/src/utils/compositeStock";

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
            { error: "Missing required parameters: email, from, and to are required" },
            { status: 400 }
        );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    try {
        /* ---------- 1. P&L SUMMARY ---------- */
        const openingStock = await stockValueAsOf(email, fromDate);
        const closingStock = await stockValueAsOf(email, toDate);

        const salesEntries = await LedgerEntry.find({
            email,
            voucherType: "Sale",
            isReversal: false,
            date: { $gte: fromDate, $lte: toDate },
        }).sort({ date: 1 }).lean();

        const totalSales = salesEntries.reduce((s, r) => s + (r.amount || 0), 0);

        const purchasesEntries = await LedgerEntry.find({
            email,
            voucherType: "Purchase",
            isReversal: false,
            date: { $gte: fromDate, $lte: toDate },
        }).sort({ date: 1 }).lean();

        const totalPurchases = purchasesEntries.reduce((s, r) => s + (r.amount || 0), 0);

        // Expenses logic (matching profit-loss/route.ts)
        const expensesEntries = await LedgerEntry.find({
            email,
            voucherType: "Expense", // Note: Ensure this matches how expenses are logged
            date: { $gte: fromDate, $lte: toDate },
        }).sort({ date: 1 }).lean();

        const totalExpenses = expensesEntries.reduce((s, r) => s + (r.amount || 0), 0);

        const writeOffs = await LedgerEntry.find({
            email,
            voucherType: "StockWriteOff",
            date: { $gte: fromDate, $lte: toDate },
        }).lean();

        const inventoryWriteDowns = writeOffs.reduce((s, r) => s + (r.amount || 0), 0);

        const cogs = openingStock + totalPurchases - closingStock;
        const grossProfit = totalSales - cogs;
        const netProfit = grossProfit - totalExpenses - inventoryWriteDowns;

        /* ---------- 2. CURRENT INVENTORY STATUS ---------- */
        const currentProducts = await Products.find({ email }).lean();
        const inventoryBreakdown = [];

        for (const p of currentProducts) {
            let qty = 0;
            if (p.productType === "composite") {
                qty = await calculateCompositeStock(p, null);
            } else {
                qty = p.quantity;
            }

            inventoryBreakdown.push({
                name: p.name,
                unit: p.unit,
                quantity: qty,
                rate: p.sellingPrice || 0,
                value: qty * (p.purchasePrice || 0) // Valuation at cost
            });
        }

        /* ---------- 3. RESPONSE ---------- */
        return NextResponse.json({
            period: { from, to },
            summary: {
                openingStock,
                purchases: totalPurchases,
                closingStock,
                cogs,
                sales: totalSales,
                grossProfit,
                expenses: totalExpenses,
                inventoryWriteDowns,
                netProfit,
                netMargin: totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(2) : 0
            },
            details: {
                sales: salesEntries,
                purchases: purchasesEntries,
                expenses: expensesEntries,
                inventory: inventoryBreakdown
            }
        });

    } catch (error) {
        console.error("Financial report generation error:", error);
        return NextResponse.json({ error: "Failed to generate financial report" }, { status: 500 });
    }
}
