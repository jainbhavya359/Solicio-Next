import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";

const DROP_THRESHOLD_PERCENT = 15;
const MIN_LAST_WEEK_SALES = 5000;

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

    const today = new Date();

    const startThisWeek = new Date(today);
    startThisWeek.setDate(today.getDate() - 7);

    const startLastWeek = new Date(today);
    startLastWeek.setDate(today.getDate() - 14);

    /* --------------------------------------------------
       1️⃣ Fetch last 14 days sales
    -------------------------------------------------- */
    const sales = await LedgerEntry.find({
      email,
      voucherType: "Sale",
      isReversal: false,
      date: { $gte: startLastWeek },
    }).select("amount date");

    let thisWeekSales = 0;
    let lastWeekSales = 0;

    for (const sale of sales) {
      if (sale.date >= startThisWeek) {
        thisWeekSales += sale.amount || 0;
      } else {
        lastWeekSales += sale.amount || 0;
      }
    }

    /* --------------------------------------------------
       2️⃣ Guardrails (avoid noise)
    -------------------------------------------------- */
    if (lastWeekSales < MIN_LAST_WEEK_SALES) {
      return NextResponse.json({
        triggered: false,
        reason: "Insufficient last week sales for comparison",
      });
    }

    const dropPercent =
      ((lastWeekSales - thisWeekSales) / lastWeekSales) * 100;

    if (dropPercent < DROP_THRESHOLD_PERCENT) {
      return NextResponse.json({
        triggered: false,
        lastWeekSales,
        thisWeekSales,
        dropPercent: Number(dropPercent.toFixed(2)),
      });
    }

    /* --------------------------------------------------
       3️⃣ Build alert
    -------------------------------------------------- */
    const alert = {
      type: "danger",
      title: "Sales dropped significantly",
      why: `Sales dropped ${dropPercent.toFixed(1)}% compared to last week`,
      impact: `₹${(lastWeekSales - thisWeekSales).toLocaleString()} less revenue`,
      action: "Follow up customers, review pricing, or push promotions",
      metric: Number(dropPercent.toFixed(2)),
      priority: 95,
    };

    console.log(alert);

    return NextResponse.json({
      triggered: true,
      alert,
      debug: {
        lastWeekSales,
        thisWeekSales,
      },
    });

  } catch (err) {
    console.error("Sales drop alert error:", err);
    return NextResponse.json(
      { error: "Failed to evaluate sales drop alert" },
      { status: 500 }
    );
  }
}
