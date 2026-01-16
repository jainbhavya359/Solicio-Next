import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { TotalStock } from "@/src/models/totalStockModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import { EntryCounter } from "@/src/models/EntryCounterModel";
import { generateVoucherNo } from "@/src/utils/voucher";
import { Products } from "@/src/models/ProductModel";

export async function POST(req: NextRequest) {
  await connect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { ledgerId, reason = "Manual reversal" } = await req.json();
    if (!ledgerId) {
      return NextResponse.json({ error: "ledgerId required" }, { status: 400 });
    }

    const original = await LedgerEntry.findById(ledgerId).session(session);
    if (!original) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // ❌ Cannot reverse a reversal
    if (original.isReversal) {
      return NextResponse.json(
        { error: "Reversal entries cannot be reversed" },
        { status: 400 }
      );
    }

    // ❌ Already reversed
    const alreadyReversed = await LedgerEntry.findOne({
      reversedEntryId: original._id,
    }).session(session);

    if (alreadyReversed) {
      return NextResponse.json(
        { error: "Entry already reversed" },
        { status: 409 }
      );
    }

    /* 🔢 REV voucher number */
    const voucherNo = await generateVoucherNo({
      email: original.email,
      series: "REV",
      date: new Date(),
      session,
    });


    /* 📒 Reversal Ledger */
    const reversal = await LedgerEntry.create(
      [{
        email: original.email,
        date: new Date(),

        voucherType: `${original.voucherType}Return`,
        voucherNo,

        itemName: original.itemName,
        unit: original.unit,

        debitQty: original.creditQty,
        creditQty: original.debitQty,

        rate: original.rate,
        amount: -original.amount,
        costAmount: -(original.costAmount || 0),

        narration: `${reason} (Reversal of ${original.voucherNo})`,
        isReversal: true,
        reversedEntryId: original._id,
      }],
      { session }
    );

    /* 📦 STOCK RESTORATION */
    const qtyDelta =
      original.voucherType === "Sale"
        ? original.creditQty
        : -original.debitQty;

    await TotalStock.findOneAndUpdate(
      {
        email: original.email,
        name: original.itemName, // ✅ FIXED
        unit: original.unit,
      },
      {
        $inc: {
          quantity: qtyDelta,
          price: original.costAmount,
        },
        $set: { updatedAt: new Date() },
      },
      { session }
    );

    await Products.findOneAndUpdate(
      {
        email: original.email,
        name: original.itemName, // ✅ FIXED
        unit: original.unit,
      },
      {
        $inc: { quantity: qtyDelta },
      },
      { session }
    );

    /* 🔁 FIFO layer restore (only for Sale reversal) */
    if (original.voucherType === "Sale") {
     for (const f of original.fifoBreakup) {
        await StockLayer.updateOne(
          { _id: f.layerId },
          { $inc: { qtyRemaining: f.qty } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true, reversal: reversal[0] });

  } catch (err) {
    await session.abortTransaction();
    console.error("Ledger reversal error:", err);
    return NextResponse.json({ error: "Reversal failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
