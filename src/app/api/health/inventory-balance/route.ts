import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { computeInventoryBalance } from "@/src/health/engines/inventoryBalanace";

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

    const result = await computeInventoryBalance(email);

    return NextResponse.json(result);

  } catch (err) {
    console.error("Inventory balance score error:", err);
    return NextResponse.json(
      { error: "Failed to calculate inventory balance score" },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import connect from "@/src/dbConfig/dbConnection";
// import { LedgerEntry } from "@/src/models/LedgerEntryModel";
// import { TotalStock } from "@/src/models/totalStockModel";

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

//     // 📅 Date window (last 30 days)
//     const fromDate = new Date();
//     fromDate.setDate(fromDate.getDate() - 30);

//     // 1️⃣ Fetch total stock value
//     const stock = await TotalStock.find({ email }).lean();

//     let totalStockValue = 0;

//     for (const s of stock) {
//       const price = s.purchasePrice || s.costPrice || 0;
//       totalStockValue += (s.quantity || 0) * price;
//     }

//     // 2️⃣ Fetch sales in last 30 days
//     const sales = await LedgerEntry.find({
//       email,
//       voucherType: "Sale",
//       isReversal: false,
//       date: { $gte: fromDate },
//     }).select("amount");

//     let totalSalesValue = 0;
//     for (const s of sales) {
//       totalSalesValue += s.amount || 0;
//     }

//     // 3️⃣ Calculate ratio safely
//     const ratio =
//       totalSalesValue === 0
//         ? Infinity
//         : totalStockValue / totalSalesValue;

//     // 4️⃣ Score mapping
//     let inventoryBalanceScore = 0;

//     if (totalSalesValue === 0 && totalStockValue > 0) {
//       inventoryBalanceScore = 0;
//     } else if (ratio <= 1) {
//       inventoryBalanceScore = 25;
//     } else if (ratio <= 2) {
//       inventoryBalanceScore = 15;
//     } else {
//       inventoryBalanceScore = 5;
//     }

//     return NextResponse.json({
//       inventoryBalanceScore, // 0–25
//       totalStockValue: Math.round(totalStockValue),
//       totalSalesValue: Math.round(totalSalesValue),
//       stockToSalesRatio: Number(ratio.toFixed(2)),
//     });

//   } catch (err) {
//     console.error("Inventory balance score error:", err);
//     return NextResponse.json(
//       { error: "Failed to calculate inventory balance score" },
//       { status: 500 }
//     );
//   }
// }
