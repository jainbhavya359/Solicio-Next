import connect from "@/src/dbConfig/dbConnection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { Products } from "@/src/models/ProductModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import Stock from "@/src/models/stockModel";
import { TotalStock } from "@/src/models/totalStockModel";
import { Document } from "@/src/models/DocumentModel";
import { CompanyProfile } from "@/src/models/CompanyProfileModel";

import { calculateCompositeStock } from "@/src/utils/compositeStock";
import { calculateFIFO } from "@/src/utils/fifo";
import { generateVoucherNo } from "@/src/utils/voucher";
import { computeGST } from "@/src/utils/gst";

export async function POST(req: NextRequest) {
  await connect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, transaction, product, party, meta } = await req.json();

    if (
      !email ||
      !transaction?.date ||
      !product?.name ||
      !product?.unit ||
      !product?.quantity ||
      product.rate == null
    ) {
      throw new Error("INVALID_PAYLOAD");
    }

    const txDate = new Date(transaction.date);
    const soldQty = product.quantity;
    const amount = soldQty * product.rate;

    /* 🔢 Voucher */
    const voucherNo = await generateVoucherNo({
      email,
      series: "SAL",
      date: txDate,
      session,
    });

    /* 🏢 Company snapshot */
    const company = await CompanyProfile.findOne({ email }).lean();

    /* 🔍 Product */
    const dbProduct = await Products.findOne(
      { email, name: product.name, unit: product.unit },
      null,
      { session }
    ).lean();

    if (!dbProduct) throw new Error("PRODUCT_NOT_FOUND");

    /* 🧩 Composite validation */
    if (dbProduct.productType === "composite") {
      const maxQty = await calculateCompositeStock(dbProduct, session);
      if (soldQty > maxQty) throw new Error("INSUFFICIENT_INGREDIENT_STOCK");
    }

    /* 📦 FIFO / COGS / STOCK UPDATES */
    let cogsTotal = 0;
    let fifoBreakup: any[] = [];
    let bulkUpdates: any[] = [];

    if (dbProduct.productType === "composite") {
      /* 🧩 Deduct from Ingredients */
      for (const item of dbProduct.recipe) {
        const neededQty = soldQty * item.qtyRequired;

        const layers = await StockLayer.find(
          {
            email,
            productName: item.productName,
            unit: item.unit,
            qtyRemaining: { $gt: 0 },
          },
          null,
          { session }
        ).sort({ date: 1 });

        const fifo = calculateFIFO(layers, neededQty);
        cogsTotal += fifo.cogs;

        // Tag the breakup with ingredient info for better audit trail
        fifoBreakup.push(
          ...fifo.breakup.map((b) => ({
            ...b,
            parentIngredient: item.productName,
          }))
        );

        bulkUpdates.push(...fifo.updates);

        // Decrease physical stock of the ingredient
        await Products.updateOne(
          { _id: item.productId, email },
          {
            $inc: { quantity: -neededQty },
            $set: { lastMovedAt: txDate },
          },
          { session }
        );
      }

      // Update the composite product's sale metadata
      await Products.updateOne(
        { email, name: product.name, unit: product.unit },
        { $set: { lastSaleAt: txDate, lastMovedAt: txDate } },
        { session }
      );
    } else {
      /* 💎 Simple Product Deduction */
      const layers = await StockLayer.find(
        {
          email,
          productName: product.name,
          unit: product.unit,
          qtyRemaining: { $gt: 0 },
        },
        null,
        { session }
      ).sort({ date: 1 });

      const fifo = calculateFIFO(layers, soldQty);
      cogsTotal = fifo.cogs;
      fifoBreakup = fifo.breakup;
      bulkUpdates = fifo.updates;

      await Products.updateOne(
        { email, name: product.name, unit: product.unit },
        {
          $inc: { quantity: -soldQty },
          $set: { lastSaleAt: txDate, lastMovedAt: txDate },
        },
        { session }
      );
    }

    /* ⚡ Execute FIFO Layer Updates */
    if (bulkUpdates.length > 0) {
      await StockLayer.bulkWrite(bulkUpdates, { session });
    }

    /* 🧾 GST */
    const gst = computeGST({
      amount: soldQty * product.rate,
      rate: meta?.gstRate || 0,
      companyState: company?.state,
      companyGSTIN: company?.gstin,
      partyState: party?.state,
      partyGSTIN: party?.taxId,
    });


    /* 📦 Stock history */
    await Stock.create(
      [{
        email,
        name: product.name,
        unit: product.unit,
        quantity: soldQty,
        price: product.rate,
        date: txDate,
        entryNo: voucherNo,
        voucher: "Sale",
      }],
      { session }
    );

    /* 📒 Ledger */
    await LedgerEntry.create(
      [{
        email,
        date: txDate,
        voucherType: "Sale",
        voucherNo,

        partyName: party?.name || "Cash",
        partyType: "Customer",

        itemName: product.name,
        unit: product.unit,

        debitQty: 0,
        creditQty: soldQty,

        rate: product.rate,
        amount,
        costAmount: cogsTotal,
        fifoBreakup,
        narration: meta?.notes || "",
      }],
      { session }
    );

    /* 📄 INVOICE DOCUMENT */
    await Document.create(
      [{
        email,
        type: "Invoice",
        voucherNo,
        date: txDate,

        party: {
          type: "Customer",
          category: party.category,
          name: party.name || "Cash",
          taxId: party.taxId,
          address: party.address,
          paymentTerms: party.paymentTerms,
        },

        item: {
          name: product.name,
          unit: product.unit,
          quantity: soldQty,
          rate: product.rate,
          amount: soldQty * product.rate,
          gstRate: meta?.gstRate || 0,
        },

        subtotal: soldQty * product.rate,
        tax: gst.tax,
        taxBreakup: gst.type === "NONE"
          ? { type: "NONE" }
          : {
            type: gst.type,
            ...gst.breakup,
          },
        total: gst.total,

        sourceVoucher: "Sale",
      }],
      { session }
    );

    await session.commitTransaction();
    return NextResponse.json({ success: true, voucherNo });

  } catch (err: any) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("Sale error:", err);
    return NextResponse.json(
      { error: err.message || "Sale failed" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "No email Found" }, { status: 400 });
    }

    const Stocks = await Stock.find({ email, voucher: "Sale" }).sort({ date: -1, createdAt: -1 });

    return NextResponse.json(Stocks);
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
