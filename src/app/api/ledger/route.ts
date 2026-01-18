import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { EntryCounter } from "@/src/models/EntryCounterModel";
import { VOUCHER_RULES } from "@/src/utils/voucherRules";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connect();
  const session = await mongoose.startSession();
  session.startTransaction();

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

    if (!email || !voucherType || !itemName || !unit || !quantity || !rate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rule = VOUCHER_RULES[voucherType];
    if (!rule) {
      return NextResponse.json(
        { error: "Invalid voucher type" },
        { status: 400 }
      );
    }

    const txDate = date ? new Date(date) : new Date();
    const dateKey = txDate.toISOString().slice(0, 10).replace(/-/g, "");

    // 🔢 Voucher counter (atomic)
    const counter = await EntryCounter.findOneAndUpdate(
      { email, series: voucherType, dateKey },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    const voucherNo = `${rule.prefix}-${dateKey}-${String(counter.seq).padStart(3, "0")}`;

    const debitQty = rule.debit ? quantity : 0;
    const creditQty = rule.credit ? quantity : 0;

    const [entry] = await LedgerEntry.create(
      [{
        email,
        date: txDate,
        voucherType,
        voucherNo,
        itemName,
        unit,
        debitQty,
        creditQty,
        rate,
        amount: quantity * rate,
        narration,
      }],
      { session }
    );

    await session.commitTransaction();
    return NextResponse.json({ success: true, entry });

  } catch (err: any) {
    await session.abortTransaction();

    // Duplicate voucher safety
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate voucher detected" },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Ledger entry failed" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}



export async function GET(req: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const page = Number(searchParams.get("page") || 1);
    const limit = Math.min(Number(searchParams.get("limit") || 50), 200);

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const match = { email };

    // 1️⃣ Total rows
    const totalCount = await LedgerEntry.countDocuments(match);

    const startFromEnd = Math.max(totalCount - page * limit, 0);
    const pageSize = Math.min(limit, totalCount - (page - 1) * limit);

    let runningBalance = 0;

    // 2️⃣ Opening balance of entries before this page
    if (startFromEnd > 0) {
      const openingAgg = await LedgerEntry.aggregate([
        { $match: match },
        { $sort: { date: 1, createdAt: 1 } },
        { $limit: startFromEnd },
        {
          $group: {
            _id: null,
            balance: {
              $sum: {
                $cond: [
                  { $eq: ["$isReversal", true] },
                  0,
                  { $subtract: ["$debitQty", "$creditQty"] },
                ],
              },
            },
          },
        },
      ]);

      runningBalance = openingAgg[0]?.balance || 0;
    }

    // 3️⃣ Page rows fetched
    const rows = await LedgerEntry.find(match)
      .sort({ date: 1, createdAt: 1 })
      .skip(startFromEnd)
      .limit(pageSize)
      .select(
        "date voucherType voucherNo itemName unit debitQty creditQty narration isReversal partyName partyType"
      )
      .lean();

    // 4️⃣ Compute balances after fetching current page and adjusting with previous values
    const computed = rows.map((r) => {
      if (!r.isReversal) {
        runningBalance += r.debitQty || 0;
        runningBalance -= r.creditQty || 0;
      }

      return { ...r, balance: runningBalance };
    });

    // 5️⃣ Reverse for UI 
    computed.reverse();

    return NextResponse.json({
      page,
      limit,
      hasMore: startFromEnd > 0,
      rows: computed,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch ledger" },
      { status: 500 }
    );
  }
}
