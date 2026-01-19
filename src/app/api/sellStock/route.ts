import connect from "@/src/dbConfig/dbConnection";
import { EntryCounter } from "@/src/models/EntryCounterModel";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { Products } from "@/src/models/ProductModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import Stock from "@/src/models/stockModel";
import { TotalStock } from "@/src/models/totalStockModel";
import { calculateCompositeStock } from "@/src/utils/compositeStock";
import { calculateFIFO } from "@/src/utils/fifo";
import { generateVoucherNo } from "@/src/utils/voucher";
import mongoose from "mongoose";
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
      quantity: soldQty,
      sellingPrice,
      partyName,
      date,
      costing = "FIFO",
    } = await req.json();

    if (!email || !name || !unit || !soldQty || sellingPrice == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const txDate = date ? new Date(date) : new Date();

    /* 🔢 Voucher */
    const voucherNo = await generateVoucherNo({
      email,
      series: "SAL",
      date: txDate,
      session,
    });

    /* 🔍 Fetch product */
    const product = await Products.findOne(
      { email, name, unit },
      null,
      { session }
    ).lean();

    if (product.productType === "composite") {
      const maxQty = await calculateCompositeStock(product, session);

      if (soldQty > maxQty) {
        throw new Error(
          `INSUFFICIENT_INGREDIENT_STOCK`
        );
      }
    }


    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    let cogsTotal = 0;
    let fifoBreakup: any[] = [];

    /* =====================================================
       🧩 COMPOSITE PRODUCT SALE
    ====================================================== */
    if (product.isComposite && product.recipe?.length) {
      for (const item of product.recipe) {
        const ingredient = await Products.findById(
          item.productId,
          null,
          { session }
        ).lean();

        if (!ingredient) {
          throw new Error("INGREDIENT_NOT_FOUND");
        }

        const usedQty = item.qtyRequired * soldQty;

        if (ingredient.quantity < usedQty) {
          throw new Error("INSUFFICIENT_INGREDIENT_STOCK");
        }

        const ingredientCost = ingredient.purchasePrice || 0;
        cogsTotal += usedQty * ingredientCost;

        /* 🔻 Reduce ingredient product stock */
        await Products.updateOne(
          { _id: ingredient._id },
          { $inc: { quantity: -usedQty } },
          { session }
        );

        /* 🔻 Reduce TotalStock */
        await TotalStock.updateOne(
          {
            email,
            name: ingredient.name,
            unit: ingredient.unit,
            quantity: { $gte: usedQty },
          },
          {
            $inc: {
              quantity: -usedQty,
              price: -(usedQty * ingredientCost),
            },
            $set: { updatedAt: txDate },
          },
          { session }
        );
      }
    }

    /* =====================================================
       📦 NORMAL PRODUCT SALE (FIFO / WAVG)
    ====================================================== */
    else {
      if (costing === "FIFO") {
        const layers = await StockLayer.find(
          {
            email,
            productName: name,
            unit,
            qtyRemaining: { $gt: 0 },
          },
          null,
          { session }
        ).sort({ date: 1 });

        const { cogs, updates, breakup } =
          calculateFIFO(layers, soldQty);

        fifoBreakup = breakup;
        cogsTotal = cogs;

        await StockLayer.bulkWrite(updates, { session });
      } else {
        const stock = await TotalStock.findOne(
          { email, name, unit },
          null,
          { session }
        ).lean();

        if (!stock || stock.quantity < soldQty) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        const avgRate = stock.price / stock.quantity;
        cogsTotal = soldQty * avgRate;
      }

      /* 🔻 Reduce product stock */
      await Products.updateOne(
        { email, name, unit },
        { $inc: { quantity: -soldQty } },
        { session }
      );

      await TotalStock.updateOne(
        {
          email,
          name,
          unit,
          quantity: { $gte: soldQty },
        },
        {
          $inc: { quantity: -soldQty, price: -cogsTotal },
          $set: { updatedAt: txDate },
        },
        { session }
      );
    }

    /* 📦 Stock history (optional UI timeline) */
    await Stock.create(
      [{
        name,
        quantity: soldQty,
        price: sellingPrice,
        unit,
        date: txDate,
        email,
        entryNo: voucherNo,
        voucher: "Sale",
      }],
      { session }
    );

    /* 📒 SINGLE LEDGER ENTRY (KEY FIX) */
    await LedgerEntry.create(
      [{
        email,
        date: txDate,
        voucherType: "Sale",
        partyName: partyName || "Cash",
        partyType: partyName ? "Customer" : "Cash",
        voucherNo,

        itemName: name,
        unit,

        debitQty: 0,
        creditQty: soldQty,

        rate: sellingPrice,
        amount: soldQty * sellingPrice,

        costAmount: cogsTotal,
        fifoBreakup,

        productType: product.isComposite ? "composite" : "simple",
        isReversal: false,
      }],
      { session }
    );

    await session.commitTransaction();
    return NextResponse.json({ success: true, voucherNo });

  } catch (err: any) {
    await session.abortTransaction();
    console.error(err.message);
    return NextResponse.json(
      { error: err.message || "Sale failed" },
      { status: 500 }
    );
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




// export async function POST(req: NextRequest) {
//   await connect();
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       email,
//       name,
//       unit,
//       quantity,
//       sellingPrice,
//       partyName,
//       date,
//       costing = "FIFO", // FIFO | WAVG
//     } = await req.json();

//     if (!email || !name || !unit || !quantity || sellingPrice == null) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const txDate = date ? new Date(date) : new Date();

//     /* 🔢 Voucher Generation */
//     const voucherNo = await generateVoucherNo({
//       email,
//       series: "SAL",
//       date: txDate,
//       session,
//     });

//     let cogsTotal = 0;
//     const fifoBreakup: any[] = [];

//     /* 🔻 COST CALCULATION */
//     if (costing === "FIFO") {
//         const layers = await StockLayer.find(
//           {
//             email,
//             productName: name,
//             unit,
//             qtyRemaining: { $gt: 0 },
//           },
//           null,
//           { session }
//         ).sort({ date: 1 });

//         const { cogs, updates, breakup } = calculateFIFO(layers, quantity);

//         fifoBreakup.push(...breakup);

//         /* using bulkWrite instead of save for saving layer at once */
//         await StockLayer.bulkWrite(updates, { session });

//         cogsTotal = cogs;
//       } else {
      
//         // ✅ WAVG
      
//       const stock = await TotalStock.findOne(
//         { email, name, unit },
//         null,
//         { session }
//       ).lean();

//       if (!stock || stock.quantity < quantity) {
//         throw new Error("INSUFFICIENT_STOCK");
//       }

//       const avgRate = stock.price / stock.quantity;
//       cogsTotal = quantity * avgRate;

//     }

//     /* 📦 Stock movement record (optional history) */
//     await Stock.create(
//       [{
//         name,
//         quantity,
//         price: sellingPrice,
//         unit,
//         date: txDate,
//         email,
//         entryNo: voucherNo,
//         voucher: "Sale",
//       }],
//       { session }
//     );

//     /* 📒 Ledger — SALE */
//     await LedgerEntry.create(
//       [{
//         email,
//         date: txDate,
//         voucherType: "Sale",
//         partyName: partyName || "Cash",
//         partyType: partyName ? "Customer" : "Cash",
//         voucherNo,

//         itemName: name,
//         unit,

//         debitQty: 0,
//         creditQty: quantity,

//         rate: sellingPrice,
//         amount: quantity * sellingPrice,

//         costAmount: cogsTotal,
//         fifoBreakup,

//         isReversal: false,
//       }],
//       { session }
//     );

//     /* 📦 Product quantity update*/
//     await Products.updateOne(
//       { email, name, unit },
//       {
//         $inc: { quantity: -quantity },
//         $set: { sellingPrice },
//       },
//       { session }
//     );

//     /* 📊 Total Stock */
//     const stockUpdate = await TotalStock.updateOne(
//       {
//         email,
//         name,
//         unit,
//         quantity: { $gte: quantity },
//       },
//       {
//         $inc: { quantity: -quantity, price: -cogsTotal },
//         $set: { updatedAt: txDate },
//       },
//       { session }
//     );

//     /* Preventing OverSelling */
//     if (stockUpdate.matchedCount === 0) {
//       throw new Error("INSUFFICIENT_STOCK");
//     }


//     await session.commitTransaction();
//     return NextResponse.json({ success: true, voucherNo });

//   } catch (err) {
//     await session.abortTransaction();
//     console.error(err);
//     return NextResponse.json({ error: "Sale failed" }, { status: 500 });
//   } finally {
//     session.endSession();
//   }
// }



