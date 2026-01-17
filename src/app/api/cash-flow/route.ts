import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";

export async function GET(req: NextRequest) {
  await connect();

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // 📅 Start of current week (Monday)
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const result = await LedgerEntry.aggregate([
    {
      $match: {
        email,
        isReversal: false,
        createdAt: { $gte: startOfWeek }, // ✅ FIXED
        voucherType: { $in: ["Purchase", "Sale", "Sales"] }, // ✅ SAFE
      },
    },
    {
      $group: {
        _id: "$voucherType",
        total: {
          $sum: {
            $ifNull: [
              "$amount",
              {
                $ifNull: ["$debitAmount", "$creditAmount"],
              },
            ],
          },
        },
      },
    },
  ]);

  let purchases = 0;
  let sales = 0;

  for (const r of result) {
    if (r._id.toLowerCase().includes("purchase")) {
      purchases += r.total || 0;
    }

    if (r._id.toLowerCase().includes("sale")) {
      sales += r.total || 0;
    }
  }

  console.log("Purchases:", purchases);
  console.log("Sales:", sales);

  return NextResponse.json({
    purchases,
    sales,
    period: "This week",
  });
}

