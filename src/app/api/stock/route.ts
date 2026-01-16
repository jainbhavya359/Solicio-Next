import connect from "@/src/dbConfig/dbConnection";
import { EntryCounter } from "@/src/models/EntryCounterModel";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { Products } from "@/src/models/ProductModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import Stock from "@/src/models/stockModel";
import { TotalStock } from "@/src/models/totalStockModel";
import { generateVoucherNo } from "@/src/utils/voucher";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      email,
      name,
      unit,
      quantity,
      price,
      date,
      voucher = "Purchase",
      costing = "FIFO", // FIFO | WAVG
    } = await req.json();

    if (!email || !name || !unit || !quantity || price == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const txDate = date ? new Date(date) : new Date();

    /* 🔢 Voucher */
    const voucherNo = await generateVoucherNo({
      email,
      series: "PUR",
      date: txDate,
      session,
    });


    await Stock.create(
      [
        {
          name,
          quantity,
          price,
          unit,
          date: txDate,
          email,
          entryNo: voucherNo,
          voucher,
        },
      ],
      { session }
    );

    /* 📒 Ledger */
    const ledger = await LedgerEntry.create(
      [{
        email,
        date: txDate,
        voucherType: "Purchase",
        voucherNo,
        itemName: name,
        unit,
        debitQty: quantity,
        creditQty: 0,
        rate: price,
        amount: quantity * price,
      }],
      { session }
    );

    /* 📦 Stock Layer */
    await StockLayer.create(
      [{
        email,
        productName: name,
        unit,
        sourceLedgerId: ledger[0]._id,
        qtyIn: quantity,
        qtyRemaining: quantity,
        rate: price,
        date: txDate,
      }],
      { session }
    );

    await Products.updateOne(
      { email, name, unit },
      {
        $inc: {
          quantity,
        },
        $set: {
          purchasePrice: price,
        },
      },
      { session }
    );

    /* 📊 Total Stock (summary only) */
    if (costing === "WAVG") {
      const stock = await TotalStock.findOne({ email, name, unit }, null, { session });
      const totalQty = (stock?.quantity || 0) + quantity;
      const totalValue = (stock?.price || 0) + quantity * price;

      await TotalStock.findOneAndUpdate(
        { email, name, unit },
        {
          quantity: totalQty,
          price: totalValue,
          updatedAt: txDate,
        },
        { upsert: true, session }
      );
    } else {
      await TotalStock.findOneAndUpdate(
        { email, name, unit },
        {
          $inc: { quantity, price: quantity * price },
          $set: { updatedAt: txDate },
        },
        { upsert: true, session }
      );
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true, voucherNo });

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}



export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const Stocks = await Stock.find({email}).sort({date: -1, createdAt: -1});

        return NextResponse.json(Stocks);
    }catch(error){
        console.log("Error: ",error);
        return NextResponse.json({error: error}, {status: 500});
    }
}