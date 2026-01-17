import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { TotalStock } from "@/src/models/totalStockModel";

const DAYS_THRESHOLD = 30;

export async function GET(req: NextRequest) {
  await connect();

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_THRESHOLD);

  /* 1️⃣ Current stock (only items with quantity > 0) */
  const stock = await TotalStock.find({
    email,
    quantity: { $gt: 0 },
  }).lean();

  /* 2️⃣ Last movement per product (USING `date`, not createdAt) */
  const movements = await LedgerEntry.aggregate([
    {
      $match: {
        email,
        isReversal: false,
        voucherType: {
          $in: ["Purchase", "Sale", "PurchaseReturn", "SaleReturn"],
        },
      },
    },
    {
      $group: {
        _id: {
          name: "$itemName",
          unit: "$unit",
        },
        lastMovedAt: { $max: "$date" }, // ✅ IMPORTANT
      },
    },
  ]);

  const movementMap = new Map<string, Date>();
  for (const m of movements) {
    const key = `${m._id.name}|${m._id.unit}`;
    movementMap.set(key, m.lastMovedAt);
  }

  /* 3️⃣ Detect slow-moving stock */
  const slowMoving = [];

  for (const s of stock) {
    const key = `${s.name}|${s.unit}`;
    const lastMovedAt = movementMap.get(key) || null;

    if (!lastMovedAt || lastMovedAt < cutoffDate) {
      const daysSinceMovement = lastMovedAt
        ? Math.floor(
            (Date.now() - new Date(lastMovedAt).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      slowMoving.push({
        product: s.name,
        unit: s.unit,
        quantity: s.quantity,
        lastMovedAt,
        daysSinceMovement,
      });
    }
  }

  return NextResponse.json({
    count: slowMoving.length,
    products: slowMoving,
  });
}


// import { NextRequest, NextResponse } from "next/server";
// import connect from "@/src/dbConfig/dbConnection";
// import { LedgerEntry } from "@/src/models/LedgerEntryModel";
// import { TotalStock } from "@/src/models/totalStockModel";

// const DAYS_THRESHOLD = 30;

// export async function GET(req: NextRequest) {
//   await connect();

//   const email = req.nextUrl.searchParams.get("email");
//   if (!email) {
//     return NextResponse.json({ error: "Email required" }, { status: 400 });
//   }

//   const cutoffDate = new Date();
//   cutoffDate.setDate(cutoffDate.getDate() - DAYS_THRESHOLD);

//   /* 1️⃣ Current stock (only items with quantity > 0) */
//   const stock = await TotalStock.find({
//     email,
//     quantity: { $gt: 0 },
//   }).lean();

//   /* 2️⃣ Last movement per product */
//   const movements = await LedgerEntry.aggregate([
//     {
//       $match: {
//         email,
//         isReversal: false,
//         voucherType: { $in: ["Sale", "Sales", "Purchase"] },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           name: "$itemName",
//           unit: "$unit",
//         },
//         lastMovedAt: { $max: "$createdAt" },
//       },
//     },
//   ]);

//   const movementMap = new Map<string, Date>();
//   for (const m of movements) {
//     const key = `${m._id.name}|${m._id.unit}`;
//     movementMap.set(key, m.lastMovedAt);
//   }

//   /* 3️⃣ Detect slow-moving stock */
//   const slowMoving = [];

//   for (const s of stock) {
//     const key = `${s.name}|${s.unit}`;
//     const lastMovedAt = movementMap.get(key) || null;

//     if (!lastMovedAt || lastMovedAt < cutoffDate) {
//       const daysSinceMovement = lastMovedAt
//         ? Math.floor(
//             (Date.now() - new Date(lastMovedAt).getTime()) /
//               (1000 * 60 * 60 * 24)
//           )
//         : null;

//       slowMoving.push({
//         product: s.name,
//         unit: s.unit,
//         quantity: s.quantity,
//         lastMovedAt,
//         daysSinceMovement,
//       });
//     }
//   }

//   console.log(slowMoving);

//   return NextResponse.json({
//     count: slowMoving.length,
//     products: slowMoving,
//   });
// }
