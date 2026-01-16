import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { EntryCounter } from "@/src/models/EntryCounterModel";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const {
      email,
      date,
      voucherType,
      itemName,
      unit,
      quantity,
      rate,
      narration = "",
    } = await req.json();

    if (!email || !voucherType || !itemName || !quantity || !rate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔢 Voucher number generation
    const dateKey = new Date(date).toISOString().slice(0, 10).replace(/-/g, "");
    const counter = await EntryCounter.findOneAndUpdate(
      { email, voucherType, dateKey },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const prefix =
      voucherType === "Purchase" ? "PUR" :
      voucherType === "Sale" ? "SAL" : "GEN";

    const voucherNo = `${prefix}-${dateKey}-${String(counter.seq).padStart(3, "0")}`;

    const debitQty = voucherType === "Purchase" ? quantity : 0;
    const creditQty = voucherType === "Sale" ? quantity : 0;

    const entry = await LedgerEntry.create({
      email,
      date,
      voucherType,
      voucherNo,
      itemName,
      unit,
      debitQty,
      creditQty,
      rate,
      amount: quantity * rate,
      narration,
    });

    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Ledger entry failed" },
      { status: 500 }
    );
  }
}


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

    const rows = await LedgerEntry.find({ email })
      .sort({ date: 1, createdAt: 1 })
      .lean();

    let runningBalance = 0;

    const ledger = rows.map((r) => {
      runningBalance += r.debitQty;
      runningBalance -= r.creditQty;

      return {
        ...r,
        runningBalance,
      };
    });

    return NextResponse.json(ledger);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch ledger" },
      { status: 500 }
    );
  }
}
