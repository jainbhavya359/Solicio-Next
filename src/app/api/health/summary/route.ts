import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";

import { computeStockMovement } from "@/src/health/engines/stockMovement";
import { computeSalesTrend } from "@/src/health/engines/salesTrend";
import { computeInventoryBalance } from "@/src/health/engines/inventoryBalanace";
import { computeActivityRecency } from "@/src/health/engines/activityRecency";

export async function GET(req: NextRequest) {
  await connect();

  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const [
      stockMovement,
      salesTrend,
      inventoryBalance,
      activityRecency,
    ] = await Promise.all([
      computeStockMovement(email),
      computeSalesTrend(email),
      computeInventoryBalance(email),
      computeActivityRecency(email),
    ]);

    const healthScore =
      stockMovement.stockMovementScore +
      salesTrend.salesTrendScore +
      inventoryBalance.inventoryBalanceScore +
      activityRecency.activityRecencyScore;

    const status =
      healthScore >= 80 ? "Excellent" :
      healthScore >= 60 ? "Stable" :
      healthScore >= 40 ? "Needs Attention" :
      "Critical";

    return NextResponse.json({
      healthScore,
      status,
      breakdown: {
        stockMovementScore: stockMovement.stockMovementScore,
        salesTrendScore: salesTrend.salesTrendScore,
        inventoryBalanceScore: inventoryBalance.inventoryBalanceScore,
        activityRecencyScore: activityRecency.activityRecencyScore,
      },
      stockMovement,
      salesTrend,
      inventoryBalance,
      activityRecency,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to compute health summary" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import connect from "@/src/dbConfig/dbConnection";

// /**
//  * Fetch health engine safely
//  */
// async function fetchEngine(url: string) {
//   const res = await fetch(url, { cache: "no-store" });
//   if (!res.ok) {
//     throw new Error(`Failed to fetch ${url}`);
//   }
//   return res.json();
// }

// export async function GET(req: NextRequest) {
//   try {
//     await connect();

//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");

//     if (!email) {
//       return NextResponse.json(
//         { error: "Email required" },
//         { status: 400 }
//       );
//     }

//     /* --------------------------------------------------
//        1️⃣ FETCH ALL HEALTH ENGINES (PARALLEL)
//     -------------------------------------------------- */
//     const baseUrl = req.nextUrl.origin;

//     const [
//       stockMovement,
//       salesTrend,
//       inventoryBalance,
//       activityRecency,
//     ] = await Promise.all([
//       fetchEngine(`${baseUrl}/api/health/stock-movement?email=${email}`),
//       fetchEngine(`${baseUrl}/api/health/sales-trend?email=${email}`),
//       fetchEngine(`${baseUrl}/api/health/inventory-balance?email=${email}`),
//       fetchEngine(`${baseUrl}/api/health/activity-recency?email=${email}`),
//     ]);

//     /* --------------------------------------------------
//        2️⃣ EXTRACT SCORES (SAFE DEFAULTS)
//     -------------------------------------------------- */
//     const stockMovementScore = stockMovement.stockMovementScore ?? 0;
//     const salesTrendScore = salesTrend.salesTrendScore ?? 0;
//     const inventoryBalanceScore = inventoryBalance.inventoryBalanceScore ?? 0;
//     const activityRecencyScore = activityRecency.activityRecencyScore ?? 0;

//     /* --------------------------------------------------
//        3️⃣ FINAL HEALTH SCORE (0–100)
//     -------------------------------------------------- */
//     const healthScore =
//       stockMovementScore +
//       salesTrendScore +
//       inventoryBalanceScore +
//       activityRecencyScore;

//     /* --------------------------------------------------
//        4️⃣ STATUS LABEL
//     -------------------------------------------------- */
//     const status =
//       healthScore >= 80
//         ? "Excellent"
//         : healthScore >= 60
//         ? "Stable"
//         : healthScore >= 40
//         ? "Needs Attention"
//         : "Critical";

//     /* --------------------------------------------------
//        5️⃣ ALERTS (PHASE 1)
//     -------------------------------------------------- */
//     const alerts: {
//       type: "warning" | "danger";
//       message: string;
//       suggestion: string;
//     }[] = [];

//     if (stockMovementScore <= 10) {
//       alerts.push({
//         type: "warning",
//         message: "Inventory moving slowly",
//         suggestion: "Review slow-moving items or discount stock",
//       });
//     }

//     if (salesTrendScore <= 10) {
//       alerts.push({
//         type: "danger",
//         message: "Sales trend declining",
//         suggestion: "Follow up with customers or revise pricing",
//       });
//     }

//     if (inventoryBalanceScore <= 5) {
//       alerts.push({
//         type: "warning",
//         message: "High inventory holding",
//         suggestion: "Pause purchases to free up cash",
//       });
//     }

//     if (activityRecencyScore === 0) {
//       alerts.push({
//         type: "danger",
//         message: "No recent business activity",
//         suggestion: "Record transactions or investigate inactivity",
//       });
//     }

//     /* --------------------------------------------------
//        6️⃣ FINAL RESPONSE
//     -------------------------------------------------- */
//     return NextResponse.json({
//       healthScore,
//       status,

//       breakdown: {
//         stockMovementScore,
//         salesTrendScore,
//         inventoryBalanceScore,
//         activityRecencyScore,
//       },

//       // ✅ FULL ENGINE DATA FOR UI CARDS
//       stockMovement,
//       salesTrend,
//       inventoryBalance,
//       activityRecency,

//       alerts,
//     });

//   } catch (err) {
//     console.error("Health summary error:", err);
//     return NextResponse.json(
//       { error: "Failed to compute health summary" },
//       { status: 500 }
//     );
//   }
// }
