import connect from "@/src/dbConfig/dbConnection";
import { TotalStock } from "@/src/models/totalStockModel";
import { NextRequest, NextResponse } from "next/server";

const DAY = 86400000;

export async function GET(req: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const stocks = await TotalStock.find({ email }).lean();

    const now = Date.now();

    let totalStockValue = 0;
    let totalQuantity = 0;

    let fast = 0;
    let warming = 0;
    let slow = 0;
    let dead = 0;
    let neverSold = 0;

    let slowValue = 0;

    const breakdown = stocks.map((s) => {
      const value = s.quantity * s.price;
      totalStockValue += value;
      totalQuantity += s.quantity;

      let daysSinceLastSale: number | null = null;
      let category:
        | "fast"
        | "warming"
        | "slow"
        | "dead"
        | "never-sold" = "never-sold";

      if (s.lastSaleAt) {
        daysSinceLastSale = Math.floor(
          (now - new Date(s.lastSaleAt).getTime()) / DAY
        );

        if (daysSinceLastSale <= 7) {
          category = "fast";
          fast++;
        } else if (daysSinceLastSale <= 14) {
          category = "warming";
          warming++;
        } else if (daysSinceLastSale <= 30) {
          category = "slow";
          slow++;
          slowValue += value;
        } else {
          category = "dead";
          dead++;
          slowValue += value;
        }
      } else {
        neverSold++;
        slowValue += value;
      }

      return {
        product: s.name,
        unit: s.unit,
        quantity: s.quantity,
        price: s.price,
        stockValue: value,
        daysSinceLastSale,
        category,
      };
    });

    const productCount = breakdown.length;
    const slowStockPct =
      totalStockValue > 0
        ? Math.round((slowValue / totalStockValue) * 100)
        : 0;

    const topProducts = [...breakdown]
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 5);

    const risks: string[] = [];

    if (slowStockPct > 30) {
      risks.push(
        `${slowStockPct}% of inventory value is locked in slow or dead stock`
      );
    }

    if (neverSold > 0) {
      risks.push(`${neverSold} products have never been sold`);
    }

    if (productCount > 0 && fast === 0) {
      risks.push("No products have sold in the last 7 days");
    }

    return NextResponse.json({
      summary: {
        productCount,
        totalQuantity,
        totalStockValue,
        slowStockPct,
      },

      movement: {
        fast,
        warming,
        slow,
        dead,
        neverSold,
      },

      distribution: {
        fast,
        warming,
        slow,
        dead,
      },

      topProducts,

      breakdown,

      risks,
    });
  } catch (error) {
    console.error("Inventory enrichment error:", error);
    return NextResponse.json(
      { error: "Failed to compute inventory insights" },
      { status: 500 }
    );
  }
}
