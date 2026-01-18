import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { TotalStock } from "@/src/models/totalStockModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import { EntryCounter } from "@/src/models/EntryCounterModel";
import { generateVoucherNo } from "@/src/utils/voucher";
import { Products } from "@/src/models/ProductModel";
import { REVERSAL_VOUCHER_MAP } from "@/src/utils/voucherRules";

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

    if (original.isReversal) {
      return NextResponse.json(
        { error: "Reversal entries cannot be reversed" },
        { status: 400 }
      );
    }

    const reversalType = REVERSAL_VOUCHER_MAP[original.voucherType];
    if (!reversalType) {
      return NextResponse.json(
        { error: "Unsupported voucher type for reversal" },
        { status: 400 }
      );
    }

    if (original.voucherType === "Purchase") {
      const currentStock = await TotalStock.findOne({
        email: original.email,
        name: original.itemName,
        unit: original.unit,
      });

      if (!currentStock || currentStock.quantity < original.debitQty) {
        return NextResponse.json(
          {
            error: "Cannot reverse purchase. Stock already consumed.",
          },
          { status: 409 }
        );
      }
    }

    // 🔢 Voucher number generation 
    const voucherNo = await generateVoucherNo({
      email: original.email,
      series: "REV",
      date: new Date(),
      session,
    });

    // 📒 Ledger reversal entry
    const [reversal] = await LedgerEntry.create(
      [{
        email: original.email,
        date: new Date(),

        voucherType: reversalType,
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

    // 📦 Stock delta calculation
    const qtyDelta =
      original.voucherType === "Sale"
        ? original.creditQty
        : -original.debitQty;

    // Updating total Stock
    const stockUpdate = await TotalStock.findOneAndUpdate(
      {
        email: original.email,
        name: original.itemName,
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

    if (!stockUpdate) {
      throw new Error("STOCK_NOT_FOUND");
    }

    // updating product quantity 
    await Products.updateOne(
      {
        email: original.email,
        name: original.itemName,
        unit: original.unit,
      },
      { $inc: { quantity: qtyDelta } },
      { session }
    );
    
    await session.commitTransaction();

    // 🔁 FIFO restore (bulk)
    // I didn't understand this part
    if (original.voucherType === "Sale" && original.fifoBreakup?.length) {
      const fifoOps = original.fifoBreakup.map(
        (f: { layerId: mongoose.Types.ObjectId; qty: number }) => ({
          updateOne: {
            filter: { _id: f.layerId },
            update: { $inc: { qtyRemaining: f.qty } },
          },
        })
      );


      await StockLayer.bulkWrite(fifoOps, { session });
    }

    return NextResponse.json({ success: true, reversal });

  } catch (err) {
    await session.abortTransaction();
    console.error("Ledger reversal error:", err);
    return NextResponse.json({ error: "Reversal failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}

