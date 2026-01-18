import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { computeStockMovement } from "@/src/health/engines/stockMovement";

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

    const result = await computeStockMovement(email);

    return NextResponse.json(result);

  } catch (err) {
    console.error("Stock movement score error:", err);
    return NextResponse.json(
      { error: "Failed to calculate stock movement score" },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import connect from "@/src/dbConfig/dbConnection";
// import { LedgerEntry } from "@/src/models/LedgerEntryModel";

// /**
//  * Convert days since last sale → movement score (0–30)
//  */
// function scoreFromDays(days: number): number {
//   if (days <= 7) return 30;
//   if (days <= 14) return 20;
//   if (days <= 30) return 10;
//   return 0;
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

//     // 1️⃣ Fetch ALL sale entries (storage only, no logic here)
//     const sales = await LedgerEntry.find({
//       email,
//       voucherType: "Sale",
//       isReversal: false,
//     }).select("itemName date");

//     // 2️⃣ Track latest sale per product
//     const lastSaleByItem = new Map<string, Date>();

//     for (const sale of sales) {
//       const prev = lastSaleByItem.get(sale.itemName);
//       if (!prev || sale.date > prev) {
//         lastSaleByItem.set(sale.itemName, sale.date);
//       }
//     }

//     const today = new Date();

//     let totalScore = 0;
//     let productCount = 0;

//     const breakdown: {
//       itemName: string;
//       daysSinceLastSale: number;
//       score: number;
//     }[] = [];

//     // 3️⃣ Score each product
//     for (const [itemName, lastSaleDate] of lastSaleByItem.entries()) {
//       const daysSinceLastSale = Math.floor(
//         (today.getTime() - lastSaleDate.getTime()) /
//           (1000 * 60 * 60 * 24)
//       );

//       const score = scoreFromDays(daysSinceLastSale);

//       totalScore += score;
//       productCount++;

//       breakdown.push({
//         itemName,
//         daysSinceLastSale,
//         score,
//       });
//     }

//     // 4️⃣ Final normalized score
//     const stockMovementScore =
//       productCount === 0
//         ? 0
//         : Math.round(totalScore / productCount);

//     return NextResponse.json({
//       stockMovementScore, // 0–30
//       productCount,
//       breakdown,
//     });

//   } catch (err) {
//     console.error("Stock movement score error:", err);
//     return NextResponse.json(
//       { error: "Failed to calculate stock movement score" },
//       { status: 500 }
//     );
//   }
// }
