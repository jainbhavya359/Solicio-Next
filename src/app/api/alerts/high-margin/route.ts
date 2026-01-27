import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";

const MIN_MARGIN_PERCENT = 25;
const MIN_UNITS_SOLD = 3;

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

    /* --------------------------------------------------
       1️⃣ Fetch recent sales (last 30 days)
    -------------------------------------------------- */
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const sales = await LedgerEntry.find({
      email,
      voucherType: "Sale",
      isReversal: false,
      date: { $gte: fromDate },
    }).select("itemName amount costAmount creditQty rate");

    if (sales.length === 0) {
      return NextResponse.json({
        triggered: false,
        reason: "No recent sales",
      });
    }

    /* --------------------------------------------------
       2️⃣ Aggregate per product
    -------------------------------------------------- */
    const productMap = new Map<
      string,
      {
        revenue: number;
        cost: number;
        qty: number;
        sellTotal: number;
        sellCount: number;
      }
    >();

    for (const s of sales) {
      const name = s.itemName || "Unknown";
      const qty = s.creditQty || 0;
      const revenue = s.amount || 0;
      const cost = s.costAmount || 0;

      const prev = productMap.get(name);

      if (!prev) {
        productMap.set(name, {
          revenue,
          cost,
          qty,
          sellTotal: s.rate || 0,
          sellCount: 1,
        });
      } else {
        prev.revenue += revenue;
        prev.cost += cost;
        prev.qty += qty;
        prev.sellTotal += s.rate || 0;
        prev.sellCount++;
      }
    }

    /* --------------------------------------------------
       3️⃣ Find highest margin product
    -------------------------------------------------- */
    let bestProduct: any = null;

    for (const [itemName, p] of productMap.entries()) {
      if (p.qty < MIN_UNITS_SOLD) continue;

      const margin =
        p.revenue === 0
          ? 0
          : ((p.revenue - p.cost) / p.revenue) * 100;

      if (
        margin >= MIN_MARGIN_PERCENT &&
        (!bestProduct || margin > bestProduct.margin)
      ) {
        bestProduct = {
          itemName,
          margin,
          avgSellPrice: p.sellTotal / p.sellCount,
          avgCostPrice: p.cost / Math.max(p.qty, 1),
          unitsSold: p.qty,
        };
      }
    }

    if (!bestProduct) {
      return {
        triggered: false,
        status: "healthy",
        summary: "No product exceeds margin threshold",
        checkedWindow: "Last 30 days",
        meta: {
          maxMarginFound: 22.4,
          threshold: MIN_MARGIN_PERCENT,
        }
      };
    }

    /* --------------------------------------------------
       4️⃣ Build alert
    -------------------------------------------------- */
    const alert = {
      type: "info",
      title: "High margin product opportunity",
      why: `${bestProduct.itemName} has highest margin (${bestProduct.margin.toFixed(
        1
      )}%)`,
      impact: `Every unit sold gives strong profit leverage`,
      action:
        "Consider restocking or promoting this product to increase profit",
      priority: 60,
      meta: {
        itemName: bestProduct.itemName,
        marginPercent: Number(bestProduct.margin.toFixed(1)),
        avgSellPrice: Math.round(bestProduct.avgSellPrice),
        avgCostPrice: Math.round(bestProduct.avgCostPrice),
        unitsSold: bestProduct.unitsSold,
      },
    };

    return NextResponse.json({
      triggered: true,
      alert,
    });

  } catch (err) {
    console.error("High margin alert error:", err);
    return NextResponse.json(
      { error: "Failed to compute high margin alert" },
      { status: 500 }
    );
  }
}
