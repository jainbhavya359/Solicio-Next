import connect from "@/src/dbConfig/dbConnection";
import { EntryCounter } from "@/src/models/EntryCounterModel";
import { Products } from "@/src/models/ProductModel";
import Stock from "@/src/models/stockModel";
import { TotalStock } from "@/src/models/totalStockModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, name, quantity, price, unit, date, voucher } =
      await request.json();

    if (!email || !name || !quantity || !unit || !voucher || price == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const safeDate = date ? new Date(date) : new Date();
    if (isNaN(safeDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }


    const currentStock = await TotalStock.findOne(
        { email, name, unit },
        null,
        { session }
    );

    if (!currentStock || currentStock.quantity < quantity) {
        throw new Error("INSUFFICIENT_STOCK");
    }

    const dateKey = new Date(safeDate)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    const counter = await EntryCounter.findOneAndUpdate(
      { email, voucher, dateKey },
      { $inc: { seq: 1 } },
      { upsert: true, new: true, session }
    );

    const seq = counter.seq;
    const entryNo = `${voucher.slice(0, 3).toUpperCase()}-${dateKey}-${String(
      seq
    ).padStart(3, "0")}`;

    const avgCost = currentStock.quantity > 0 ? currentStock.price / currentStock.quantity : 0;

    const newSale = await Stock.create(
      [
        {
          name,
          quantity,
          price,
          unit,
          safeDate,
          email,
          seq,
          entryNo,
          voucher,
        },
      ],
      { session }
    );

    await TotalStock.findOneAndUpdate(
      { email, name, unit },
      {
        $setOnInsert: { email, name, unit },
        $inc: {
          quantity: -quantity,
          price: -quantity * avgCost,
        },
        $set: { updatedAt: safeDate },
      },
      { upsert: true, session }
    );

    await Products.updateOne(
      { email, name, unit },
      {
        $inc: {
          quantity: -quantity,
        },
        $set: {
          sellingPrice: price,
        },
      },
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json({
      success: true,
      entryNo,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return NextResponse.json({ error: "Stock update failed" }, { status: 500 });
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

        const Stocks = await Stock.find({email, voucher: "Sale"}).sort({date: -1, createdAt: -1});

        return NextResponse.json(Stocks);
    }catch(error){
        console.log("Error: ",error);
        return NextResponse.json({error: error}, {status: 500});
    }
}