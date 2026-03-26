import connect from "@/src/dbConfig/dbConnection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { Products } from "@/src/models/ProductModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { Document } from "@/src/models/DocumentModel";
import { CompanyProfile } from "@/src/models/CompanyProfileModel";
import { Party } from "@/src/models/PartyModel";
import { Payment } from "@/src/models/PaymentModel";

import { generateVoucherNo } from "@/src/utils/voucher";
import { computeGST } from "@/src/utils/gst";

export async function POST(req: NextRequest) {
  await connect();
  await Payment.createCollection().catch(() => { }); // Ensure collection exists before transaction
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
    const amount = product.quantity * product.rate;

    /* 🔢 Voucher */
    const voucherNo = await generateVoucherNo({
      email,
      series: "PUR",
      date: txDate,
      session,
    });

    /* 📒 Ledger */
    const [ledger] = await LedgerEntry.create(
      [{
        email,
        date: txDate,
        voucherType: "Purchase",
        voucherNo,

        partyName: party?.name || "Cash",
        partyType: "Supplier",

        itemName: product.name,
        unit: product.unit,

        debitQty: product.quantity,
        creditQty: 0,

        rate: product.rate,
        amount,
        narration: meta?.notes || "",
      }],
      { session }
    );

    /* 📦 FIFO Layer */
    await StockLayer.create(
      [{
        email,
        productName: product.name,
        unit: product.unit,
        sourceLedgerId: ledger._id,
        qtyIn: product.quantity,
        qtyRemaining: product.quantity,
        rate: product.rate,
        date: txDate,
      }],
      { session }
    );

    /* 📦 Product quantity */
    await Products.updateOne(
      { email, name: product.name, unit: product.unit },
      { $inc: { quantity: product.quantity }, $set: { purchasePrice: product.rate } },
      { session }
    );

    /* 🏢 Company snapshot */
    const company = await CompanyProfile.findOne({ email }).lean();

    /* 📄 BILL DOCUMENT */
    const gst = computeGST({
      amount: product.quantity * product.rate,
      rate: meta?.gstRate || 0,
      companyState: company?.state,
      companyGSTIN: company?.gstin,
      partyState: party?.state,
      partyGSTIN: party?.taxId,
    });

    await Document.create(
      [{
        email,
        type: "Bill",
        voucherNo,
        date: txDate,

        party: {
          type: "Supplier",
          category: party.category,
          name: party.name || "Cash",
          taxId: party.taxId,
          address: party.address,
          state: party.state,
          paymentTerms: party.paymentTerms,
        },

        company: {
          name: company?.name,
          gstin: company?.gstin,
          state: company?.state,
          address: company?.address,
          logoUrl: company?.logoUrl,
        },

        item: {
          name: product.name,
          unit: product.unit,
          quantity: product.quantity,
          rate: product.rate,
          amount: product.quantity * product.rate,
          gstRate: meta?.gstRate || 0,
        },

        subtotal: product.quantity * product.rate,
        tax: gst.tax,
        taxBreakup: gst.type === "NONE"
          ? { type: "NONE" }
          : {
            type: gst.type,
            ...gst.breakup,
          },
        total: gst.total,

        sourceVoucher: "Purchase",
      }],
      { session }
    );

    /* 📇 Auto-create Party (Supplier) & Handle Immediate Payments */
    if (party?.name && party.name !== "Cash") {
      const isImmediate = party.paymentTerms === "IMMEDIATE";

      await Party.findOneAndUpdate(
        { email, name: party.name },
        {
          $setOnInsert: {
            email,
            name: party.name,
            type: "Supplier",
            category: party.category || "Individual",
            gstin: party.taxId,
            state: party.state,
            address: party.address,
            paymentTerms: party.paymentTerms,
          },
          $inc: {
            totalPurchases: amount,
            ...(isImmediate ? { totalPaid: amount } : {})
          },
          $set: { lastTransactionDate: txDate }
        },
        { upsert: true, session }
      );

      // Auto-generate Payment History if terms are IMMEDIATE
      if (isImmediate) {
        await Payment.create(
          [{
            email,
            partyName: party.name,
            type: "PAY", // Purchase = We pay supplier
            amount,
            date: txDate,
            notes: "Immediate settlement against Purchase",
            voucherNo: `PMT-${voucherNo}`,
            sourceTransaction: voucherNo
          }],
          { session }
        );
      }
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true, voucherNo });

  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("Purchase error:", err);
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
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

    const ledgerEntries = await LedgerEntry.find({ email }).sort({ date: -1, createdAt: -1 });

    // Map to legacy Stock format for UI compatibility
    const legacyStock = ledgerEntries.map(entry => ({
      _id: entry._id,
      name: entry.itemName,
      quantity: entry.debitQty || entry.creditQty, // For generic history, show the movement magnitude
      unit: entry.unit,
      entryNo: entry.voucherNo,
      price: entry.rate,
      date: entry.date,
      email: entry.email,
      voucher: entry.voucherType,
    }));

    return NextResponse.json(legacyStock);
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}