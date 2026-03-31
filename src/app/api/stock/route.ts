import connect from "@/src/dbConfig/dbConnection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { Products } from "@/src/models/ProductModel";
import { StockLayer } from "@/src/models/StockLayerModel";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { JournalEntry } from "@/src/models/JournalEntryModel";
import { Document } from "@/src/models/DocumentModel";
import { CompanyProfile } from "@/src/models/CompanyProfileModel";
import { Party } from "@/src/models/PartyModel";
import { Payment } from "@/src/models/PaymentModel";

import { generateVoucherNo } from "@/src/utils/voucher";
import { resolveSystemAccount } from "@/src/utils/accounting";

// In-memory idempotency lock to prevent double-click race conditions concurrently
const processingKeys = new Set<string>();

export async function POST(req: NextRequest) {
  await connect();
  
  // Ensure collections exist before transaction
  await Promise.all([
    Payment.createCollection().catch(() => {}),
    JournalEntry.createCollection().catch(() => {}),
    Document.createCollection().catch(() => {}),
    StockLayer.createCollection().catch(() => {}),
    LedgerEntry.createCollection().catch(() => {})
  ]);

  const session = await mongoose.startSession();

  try {
    const payload = await req.json();
    const { email, transaction, product, party, meta, idempotencyKey } = payload;

    if (!email || !transaction?.date || !product?.name || !product?.quantity) {
      return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    // --- IDEMPOTENCY CHECK ---
    // If client provides a key, use it. Otherwise, hash the payload.
    const uniqueKey = idempotencyKey || crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    
    if (processingKeys.has(uniqueKey)) {
      return NextResponse.json({ error: "Duplicate request detected. Processing in progress." }, { status: 429 });
    }
    processingKeys.add(uniqueKey);

    // Additionally check DB for idempotency
    const existingDoc = await Document.findOne({ 
      email, 
      "party.name": party.name || "Cash Vendor",
      date: new Date(transaction.date),
      total: meta.totalAmount,
      "item.name": product.name,
    }).lean();

    if (existingDoc && !idempotencyKey) {
      // Very likely a duplicate double-click
      processingKeys.delete(uniqueKey);
      return NextResponse.json({ success: true, voucherNo: existingDoc.voucherNo, message: "Duplicate recovered." });
    }

    session.startTransaction();

    // 1. Validation & Constants
    const txDate = new Date(transaction.date);
    const isInformal = meta.entryType === "Informal (Cash Memo)";
    const isExport = transaction.supplyType === "Export";
    const exchangeRate = Number(transaction.exchangeRate) || 1;

    // --- REVERSE-MATH: Tax Inclusive Logic ---
    let baseRate = Number(product.rate);
    const gstRate = Number(meta.gstRate) || 0;
    if (product.isTaxInclusive && gstRate > 0) {
      baseRate = baseRate / (1 + (gstRate / 100)); // Remove GST from gross unit rate
    }
    
    // Ensure base arithmetic matches UI
    const totalBasePrice = baseRate * product.quantity;
    
    let discountAmount = 0;
    if (meta.discountValue) {
      discountAmount = meta.discountType === "%" 
        ? (totalBasePrice * (Number(meta.discountValue) / 100))
        : Number(meta.discountValue);
    }

    const freightAmount = Number(meta.freightCharge) || 0;
    const cgst = Number(meta.cgst) || 0;
    const sgst = Number(meta.sgst) || 0;
    const igst = Number(meta.igst) || 0;
    const totalTax = cgst + sgst + igst;
    
    // Convert to Base Currency (INR) for Accounting Backbone
    const baseTotalAmount = Number(meta.totalAmount) * exchangeRate;
    const baseBasePrice = totalBasePrice * exchangeRate;
    const baseDiscount = discountAmount * exchangeRate;
    const baseFreight = freightAmount * exchangeRate;

    const baseCgst = cgst * exchangeRate;
    const baseSgst = sgst * exchangeRate;
    const baseIgst = igst * exchangeRate;

    // 2. Resolve Product reference
    let productRef = await Products.findOne({ email, name: product.name }).session(session);
    if (!productRef) {
      throw new Error(`Product ${product.name} not found. Ensure asset exists.`);
    }

    // 3. True Cost / Landed Cost Calculation
    // ITC (Input Tax Credit) is claimable if it's B2B/Registered. If informal, tax is a cost.
    const irrecoverableTax = isInformal ? totalTax : 0; 
    const landedCost = (totalBasePrice - discountAmount) + freightAmount + irrecoverableTax;
    const trueUnitRate = landedCost / product.quantity;

    // 4. Resolve / Create Party
    let resolvedPartyId = null;
    const isCashProcurement = !party?.name || party.name === "Cash Vendor";
    let partyRef = null;

    if (!isCashProcurement) {
      partyRef = await Party.findOneAndUpdate(
        { email, name: party.name },
        {
          $setOnInsert: {
            email,
            name: party.name,
            type: "Supplier",
            category: party.category || "Company",
            gstin: party.taxId,
          },
        },
        { upsert: true, session, returnDocument: 'after' }
      );
      resolvedPartyId = partyRef._id;
    }

    // 5. Generate Core Voucher No
    const voucherNo = await generateVoucherNo({
      email,
      series: "PUR",
      date: txDate,
      session,
    });

    // 6. Accounting Engine (Double-Entry Journal Splitting)
    const journalEntries = [];

    // DR: Purchase Account
    journalEntries.push({
      accountId: await resolveSystemAccount({ email, name: "Purchases", code: "ACC-PURCHASES", type: "Expense", session }),
      type: "debit",
      amount: baseBasePrice - baseDiscount,
      narration: `Purchase of ${product.quantity} ${product.unit} ${product.name}`
    });

    // DR: Freight Inward
    if (baseFreight > 0) {
      journalEntries.push({
        accountId: await resolveSystemAccount({ email, name: "Freight Inward", code: "ACC-FREIGHT-IN", type: "Expense", session }),
        type: "debit",
        amount: baseFreight,
        narration: `Freight Inward for ${voucherNo}`
      });
    }

    // DR/CR: Taxes
    if (meta.reverseCharge) {
      // RCM Logic
      const rcmTotal = baseCgst + baseSgst + baseIgst;
      if (rcmTotal > 0) {
        journalEntries.push({
          accountId: await resolveSystemAccount({ email, name: "Input GST RCM Claimable", code: "TAX-IN-RCM-CLAIM", type: "Asset", gstType: "input", session }),
          type: "debit",
          amount: rcmTotal,
          narration: `RCM Input Tax Claim`
        });
        journalEntries.push({
          accountId: await resolveSystemAccount({ email, name: "Output GST RCM Payable", code: "TAX-OUT-RCM-PAY", type: "Liability", gstType: "output", session }),
          type: "credit",
          amount: rcmTotal,
          narration: `RCM Liability to Govt`
        });
      }
    } else if (!isInformal) {
      // Normal ITC
      if (baseCgst > 0) {
        journalEntries.push({
          accountId: await resolveSystemAccount({ email, name: "Input CGST", code: "TAX-IN-CGST", type: "Asset", gstType: "input", session }),
          type: "debit",
          amount: baseCgst,
          narration: "Input CGST"
        });
      }
      if (baseSgst > 0) {
        journalEntries.push({
          accountId: await resolveSystemAccount({ email, name: "Input SGST", code: "TAX-IN-SGST", type: "Asset", gstType: "input", session }),
          type: "debit",
          amount: baseSgst,
          narration: "Input SGST"
        });
      }
      if (baseIgst > 0) {
        journalEntries.push({
          accountId: await resolveSystemAccount({ email, name: "Input IGST", code: "TAX-IN-IGST", type: "Asset", gstType: "input", session }),
          type: "debit",
          amount: baseIgst,
          narration: "Input IGST"
        });
      }
    }

    // CR: Supplier Account (Liability Booking)
    // In RCM, the supplier doesn't get paid the tax amount!
    const supplierCreditableAmount = meta.reverseCharge ? (baseTotalAmount - baseCgst - baseSgst - baseIgst) : baseTotalAmount;
    
    // We book the full Supplier Liability here. Payments will reverse this via Debits.
    journalEntries.push({
      accountId: resolvedPartyId || await resolveSystemAccount({ email, name: "Cash Vendor Default A/c", code: "ACC-CASH-VENDOR", type: "Liability", session }),
      type: "credit",
      amount: supplierCreditableAmount, 
      narration: `Purchase Invoice ${voucherNo}`
    });

    const [journalTx] = await JournalEntry.create([{
      email,
      date: txDate,
      voucherType: "Purchase",
      voucherNo,
      idempotencyKey: uniqueKey,
      entries: journalEntries,
      totalAmount: supplierCreditableAmount, // Gross liability size
      source: "API"
    }], { session });

    // 7. Mapped Document wrapper creation
    const [doc] = await Document.create([{
      email,
      type: "Bill",
      documentType: isInformal ? "Retail" : (isExport ? "Export" : "B2B"),
      voucherNo,
      date: txDate,

      party: {
        type: "Supplier",
        category: (party?.category === "Corporate") ? "Company" : (party?.category || "Company"),
        name: party?.name || "Cash Vendor",
        taxId: party?.taxId,
      },

      items: [{
        productId: productRef._id,
        name: product.name,
        unit: product.unit,
        quantity: Number(product.quantity),
        rate: baseRate,
        amount: totalBasePrice,
        gstRate: gstRate,
        hsnSac: productRef.hsnSac || "",
        batchNumber: meta.batchNo || "",
        isService: productRef.productNature === "service"
      }],

      charges: {
        freight: freightAmount,
        discount: discountAmount, // stored as absolute INR/$ value
        discountType: "₹"
      },

      reverseCharge: meta.reverseCharge || false,
      currencyDetails: { code: transaction.currency || "INR", exchangeRate },

      journalEntryId: journalTx._id,
      inventoryImpact: productRef.productNature !== "service",
      
      subtotal: totalBasePrice - discountAmount + freightAmount,
      tax: totalTax,
      taxDetails: {
        type: cgst > 0 ? "CGST_SGST" : (igst > 0 ? "IGST" : "NONE"),
        cgst: { rate: gstRate/2, amount: cgst },
        sgst: { rate: gstRate/2, amount: sgst },
        igst: { rate: gstRate, amount: igst },
        totalTax
      },
      exportDetails: { isExport },
      
      total: meta.totalAmount,
      status: "finalized",
      sourceVoucher: "Purchase"
    }], { session });

    // 8. Inventory Matrix (If Goods)
    if (productRef.productNature !== "service") {
      const [stockLayerTx] = await StockLayer.create([{
        email,
        productId: productRef._id,
        productName: product.name,
        unit: product.unit,
        sourceLedgerId: journalTx._id, // Hook layer to the journal event 
        qtyIn: product.quantity,
        qtyRemaining: product.quantity,
        rate: trueUnitRate, // FIFO Cost rate
        date: txDate,
        batchNumber: meta.batchNo || undefined,
        expiryDate: meta.expiryDate ? new Date(meta.expiryDate) : undefined,
      }], { session });

      // Atomic Master Stock Increment
      await Products.updateOne(
        { _id: productRef._id },
        { 
          $inc: { quantity: product.quantity },
          $set: { purchasePrice: trueUnitRate } // Updates moving avg/latest cost
        },
        { session }
      );
    }

    // 9. Payment & AP Settlement
    const paidAmount = Number(meta.amountPaid) || 0;
    
    // Increment total purchases
    if (!isCashProcurement) {
      await Party.updateOne(
        { _id: resolvedPartyId },
        { 
          $inc: { 
            totalPurchases: baseTotalAmount,
            // Supplier outstanding increases on credit purchase. Decrease when paid.
            outstandingBalance: supplierCreditableAmount 
          },
          $set: { lastTransactionDate: txDate }
        },
        { session }
      );
    }

    // Auto-receive payment processing
    if (paidAmount > 0) {
      const basePaidAmount = paidAmount * exchangeRate;
      
      // Secondary settlement Journal (DR Supplier, CR Cash)
      const pmtJournal = await JournalEntry.create([{
        email,
        date: txDate,
        voucherType: "Payment",
        voucherNo: `PMT-${voucherNo}`,
        idempotencyKey: `PMT-${uniqueKey}`,
        entries: [
          {
            accountId: resolvedPartyId || await resolveSystemAccount({ email, name: "Cash Vendor Default A/c", code: "ACC-CASH-VENDOR", type: "Liability", session }),
            type: "debit",
            amount: basePaidAmount,
            narration: `Payment for ${voucherNo}`
          },
          {
            accountId: await resolveSystemAccount({ email, name: "Cash/Bank A/c", code: "ACC-CASH-BANK", type: "Asset", session }),
            type: "credit",
            amount: basePaidAmount,
            narration: `Outflow for ${voucherNo}`
          }
        ],
        totalAmount: basePaidAmount
      }], { session });

      await Payment.create([{
        email,
        partyName: party?.name || "Cash Vendor",
        type: "PAY",
        amount: paidAmount, // Real face value payment
        date: txDate,
        notes: "Automated payment receipt logging.",
        voucherNo: `PMT-${voucherNo}`,
        journalEntryId: pmtJournal[0]._id,
        allocations: [{
          documentId: doc._id,
          amountSettled: paidAmount
        }]
      }], { session });

      if (!isCashProcurement) {
         // Decrease supplier AP since they were paid
         await Party.updateOne(
          { _id: resolvedPartyId },
          { $inc: { outstandingBalance: -basePaidAmount, totalPaid: basePaidAmount } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    processingKeys.delete(uniqueKey);
    return NextResponse.json({ success: true, voucherNo });

  } catch (err: any) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("Purchase Transaction Rolled Back:", err);
    return NextResponse.json({ error: err.message || "Purchase failed" }, { status: 500 });
  } finally {
    session.endSession();
  }
}

export async function GET(request: NextRequest) {
  // Read Legacy fallback logic
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "No email Found" }, { status: 400 });
    }

    // Use Document model for modern fetching
    const documents = await Document.find({ email, sourceVoucher: "Purchase" }).sort({ date: -1, createdAt: -1 });

    const modernStock = documents.map((doc: any) => ({
      _id: doc._id,
      name: doc.items?.[0]?.name || doc.item?.name,
      quantity: doc.items?.[0]?.quantity || doc.item?.quantity,
      unit: doc.items?.[0]?.unit || doc.item?.unit,
      entryNo: doc.voucherNo,
      price: doc.items?.[0]?.rate || doc.item?.rate,
      date: doc.date,
      email: doc.email,
      voucher: doc.sourceVoucher,
    }));

    return NextResponse.json(modernStock);
  } catch (error) {
    console.error("GET Stock Error: ", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}