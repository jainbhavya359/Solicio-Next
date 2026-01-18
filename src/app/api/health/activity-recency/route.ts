import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { computeActivityRecency } from "@/src/health/engines/activityRecency";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const result = await computeActivityRecency(email);
    return NextResponse.json(result);

  } catch (err) {
    console.error("Activity recency error:", err);
    return NextResponse.json(
      { error: "Failed to calculate activity recency" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import connect from "@/src/dbConfig/dbConnection";
// import { LedgerEntry } from "@/src/models/LedgerEntryModel";

// /**
//  * Convert days inactive → activity recency score (0–20)
//  */
// function scoreFromDaysInactive(days: number): number {
//   if (days <= 2) return 20;
//   if (days <= 7) return 12;
//   if (days <= 14) return 6;
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

//     // 1️⃣ Fetch most recent Purchase or Sale
//     const lastActivity = await LedgerEntry.findOne({
//       email,
//       voucherType: { $in: ["Purchase", "Sale"] },
//       isReversal: false,
//     })
//       .sort({ date: -1 })
//       .select("date");

//     if (!lastActivity) {
//       return NextResponse.json({
//         activityRecencyScore: 0,
//         daysInactive: null,
//         lastActivityDate: null,
//       });
//     }

//     // 2️⃣ Calculate inactivity
//     const today = new Date();
//     const lastDate = lastActivity.date;

//     const daysInactive = Math.floor(
//       (today.getTime() - lastDate.getTime()) /
//         (1000 * 60 * 60 * 24)
//     );

//     // 3️⃣ Score
//     const activityRecencyScore =
//       scoreFromDaysInactive(daysInactive);

//     return NextResponse.json({
//       activityRecencyScore, // 0–20
//       daysInactive,
//       lastActivityDate: lastDate,
//     });

//   } catch (err) {
//     console.error("Activity recency score error:", err);
//     return NextResponse.json(
//       { error: "Failed to calculate activity recency score" },
//       { status: 500 }
//     );
//   }
// }
