import connect from "@/src/dbConfig/dbConnection";
import { Products } from "@/src/models/ProductModel"; // Switch to Products model
import { calculateCompositeStock } from "@/src/utils/compositeStock";
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

    // Fetch from Products instead of TotalStock
    const products = await Products.find({ email }).lean();

    const now = Date.now();

    let totalStockValue = 0;
    let totalQuantity = 0;

    let fast = 0;
    let warming = 0;
    let slow = 0;
    let dead = 0;
    let neverSold = 0;

    let slowValue = 0;

    // Process all products (handling composite stock if needed)
    const breakdown = await Promise.all(products.map(async (p) => {
      // Calculate quantity for composite products if needed, though for total stock report 
      // usually we want the raw quantity or computed. Inventory API does computed.
      // Let's stick to simple quantity for consistency with previous TotalStock logic, 
      // OR better, copy logic from inventory API for consistency.
      // Inventory API does:
      /*
         const quantity = p.productType === "composite"
            ? await calculateCompositeStock(p, null)
            : p.quantity;
      */

      const quantity = p.productType === "composite"
        ? await calculateCompositeStock(p, null)
        : p.quantity;

      // Map sellingPrice to price (TotalStock used 'price', Product uses 'sellingPrice')
      const price = p.sellingPrice ?? 0;
      const value = quantity * price;

      totalStockValue += value;
      totalQuantity += quantity;

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
        product: p.name,
        unit: p.unit,
        quantity: quantity,
        price: price,
        stockValue: value,
        daysSinceLastSale,
        category,
      };
    }));

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
