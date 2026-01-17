import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";

const MIN_PENDING_AMOUNT = 10000;
const MIN_OLDEST_DAYS = 14;

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
       1️⃣ Fetch all customer sales
    -------------------------------------------------- */
    const sales = await LedgerEntry.find({
      email,
      voucherType: "Sale",
      isReversal: false,
      partyType: "Customer",
    }).select("partyName amount date");

    if (sales.length === 0) {
      return NextResponse.json({
        triggered: false,
        reason: "No customer sales found",
      });
    }

    /* --------------------------------------------------
       2️⃣ Aggregate by customer
    -------------------------------------------------- */
    const customerMap = new Map<
      string,
      { total: number; oldestDate: Date }
    >();

    for (const sale of sales) {
      const name = sale.partyName || "Unknown";
      const prev = customerMap.get(name);

      if (!prev) {
        customerMap.set(name, {
          total: sale.amount || 0,
          oldestDate: sale.date,
        });
      } else {
        prev.total += sale.amount || 0;
        if (sale.date < prev.oldestDate) {
          prev.oldestDate = sale.date;
        }
      }
    }

    /* --------------------------------------------------
       3️⃣ Compute totals & aging
    -------------------------------------------------- */
    const today = new Date();

    let totalPending = 0;
    let oldestDays = 0;

    const defaulters: {
      partyName: string;
      amount: number;
      daysPending: number;
    }[] = [];

    for (const [partyName, data] of customerMap.entries()) {
      const daysPending = Math.floor(
        (today.getTime() - data.oldestDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      totalPending += data.total;
      oldestDays = Math.max(oldestDays, daysPending);

      defaulters.push({
        partyName,
        amount: data.total,
        daysPending,
      });
    }

    if (
      totalPending < MIN_PENDING_AMOUNT ||
      oldestDays < MIN_OLDEST_DAYS
    ) {
      return NextResponse.json({
        triggered: false,
        totalPending,
        oldestDays,
      });
    }

    /* --------------------------------------------------
       4️⃣ Sort top defaulters
    -------------------------------------------------- */
    defaulters.sort((a, b) => b.amount - a.amount);

    const topDefaulters = defaulters.slice(0, 3);

    /* --------------------------------------------------
       5️⃣ Build alert
    -------------------------------------------------- */
    const alert = {
      type: "danger",
      title: "Pending receivables blocking cash",
      why: `₹${totalPending.toLocaleString()} pending from ${customerMap.size} customers`,
      impact: `Oldest payment pending for ${oldestDays} days`,
      action:
        "Call top defaulters, offer early payment discount, or pause credit sales",
      priority: 100,
      meta: {
        totalPending,
        customerCount: customerMap.size,
        oldestDays,
        topDefaulters,
      },
    };

    console.log(alert);

    return NextResponse.json({
      triggered: true,
      alert,
    });

  } catch (err) {
    console.error("Receivables alert error:", err);
    return NextResponse.json(
      { error: "Failed to compute receivables alert" },
      { status: 500 }
    );
  }
}
