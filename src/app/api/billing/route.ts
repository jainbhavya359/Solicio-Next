import connect from "@/src/dbConfig/dbConnection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { Products }        from "@/src/models/ProductModel";
import { StockLayer }      from "@/src/models/StockLayerModel";
import { LedgerEntry }     from "@/src/models/LedgerEntryModel";
import { Document }        from "@/src/models/DocumentModel";
import { CompanyProfile }  from "@/src/models/CompanyProfileModel";
import { Party }           from "@/src/models/PartyModel";

import { calculateFIFO }       from "@/src/utils/fifo";
import { generateVoucherNo }   from "@/src/utils/voucher";
import { computeGST }          from "@/src/utils/gst";

// ─── Types matching VoucherFormSchema ────────────────────────────────────────

interface ItemPayload {
  productId: string;
  qty:       number;
  uom:       string;
  rate:      number;
  discount:  number;
  gstRate:   number;
  taxType:   "CGST_SGST" | "IGST" | "NONE";
}

interface AddonPayload {
  label: string;
  value: number;
}

interface BillingPayload {
  email:       string;
  partyId:     string;
  date:        string;
  voucherType: "Sale" | "Purchase";
  items:       ItemPayload[];
  addons:      AddonPayload[];
}

// ─── POST /api/billing ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  await connect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body: BillingPayload = await req.json();
    const { email, partyId, date, voucherType, items, addons } = body;

    // ── Validate payload ────────────────────────────────────────────────────
    if (!email || !partyId || !date || !voucherType || !items?.length) {
      throw Object.assign(new Error("INVALID_PAYLOAD"), { status: 400 });
    }

    const txDate = new Date(date);
    const series = voucherType === "Sale" ? "SAL" : "PUR";

    // ── Generate voucher number atomically ──────────────────────────────────
    const voucherNo = await generateVoucherNo({ email, series, date: txDate, session });

    // ── Fetch company profile (for GST state comparison) ───────────────────
    const company = await CompanyProfile.findOne({ email }).lean();
    if (!company) throw new Error("COMPANY_NOT_FOUND");

    // ── Fetch party ─────────────────────────────────────────────────────────
    const party = await Party.findById(partyId).lean();
    if (!party) throw new Error("PARTY_NOT_FOUND");

    // ── Process each item ───────────────────────────────────────────────────
    let   subtotal     = 0;
    let   totalCGST    = 0;
    let   totalSGST    = 0;
    let   totalIGST    = 0;

    const ledgerLines: object[] = [];

    for (const item of items) {
      const product = await Products.findById(item.productId, null, { session }).lean();
      if (!product) throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);

      const lineAmount = item.qty * item.rate * (1 - item.discount / 100);
      subtotal += lineAmount;

      // ── Server-side GST revalidation (backend is authoritative) ────────
      const gst = computeGST({
        amount:       lineAmount,
        rate:         item.gstRate,
        companyState: (company as any).state,
        companyGSTIN: (company as any).gstin,
        partyState:   (party as any).state,
        partyGSTIN:   (party as any).taxId ?? (party as any).gstin,
      });

      if (gst.type === "CGST_SGST" && gst.breakup) {
        totalCGST += (gst.breakup as any).cgst.amount;
        totalSGST += (gst.breakup as any).sgst.amount;
      } else if (gst.type === "IGST" && gst.breakup) {
        totalIGST += (gst.breakup as any).igst.amount;
      }

      // ── Inventory: FIFO deduction (Sale) or Layer creation (Purchase) ──
      if (voucherType === "Sale") {
        const layers = await StockLayer.find(
          { email, productName: product.name, unit: product.unit, qtyRemaining: { $gt: 0 } },
          null,
          { session }
        ).sort({ date: 1 });

        const fifo = calculateFIFO(layers, item.qty);

        if (fifo.updates.length > 0) {
          await StockLayer.bulkWrite(fifo.updates, { session });
        }

        await Products.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.qty }, $set: { lastSaleAt: txDate, lastMovedAt: txDate } },
          { session }
        );

        ledgerLines.push({
          email,
          date: txDate,
          voucherType: "Sale",
          voucherNo,
          partyName:   (party as any).name,
          partyType:   "Customer",
          itemName:    product.name,
          unit:        product.unit,
          debitQty:    0,
          creditQty:   item.qty,
          rate:        item.rate,
          amount:      lineAmount,
          costAmount:  fifo.cogs,
          fifoBreakup: fifo.breakup,
          cgst:        gst.type === "CGST_SGST" ? (gst.breakup as any).cgst.amount : 0,
          sgst:        gst.type === "CGST_SGST" ? (gst.breakup as any).sgst.amount : 0,
          igst:        gst.type === "IGST"      ? (gst.breakup as any).igst.amount : 0,
          narration:   "",
        });

      } else {
        // Purchase: create a new stock layer
        await StockLayer.create(
          [{
            email,
            productId:    item.productId,
            productName:  product.name,
            unit:         product.unit,
            qtyAdded:     item.qty,
            qtyRemaining: item.qty,
            rate:         item.rate,
            date:         txDate,
            voucherNo,
          }],
          { session }
        );

        await Products.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.qty }, $set: { lastMovedAt: txDate } },
          { session }
        );

        ledgerLines.push({
          email,
          date: txDate,
          voucherType: "Purchase",
          voucherNo,
          partyName:   (party as any).name,
          partyType:   "Supplier",
          itemName:    product.name,
          unit:        product.unit,
          debitQty:    item.qty,
          creditQty:   0,
          rate:        item.rate,
          amount:      lineAmount,
          costAmount:  lineAmount,
          cgst:        gst.type === "CGST_SGST" ? (gst.breakup as any).cgst.amount : 0,
          sgst:        gst.type === "CGST_SGST" ? (gst.breakup as any).sgst.amount : 0,
          igst:        gst.type === "IGST"      ? (gst.breakup as any).igst.amount : 0,
          narration:   "",
        });
      }
    }

    // ── Batch write all ledger lines in one call ────────────────────────────
    await LedgerEntry.create(ledgerLines, { session });

    // ── Create Document (invoice record) ───────────────────────────────────
    const grandTotal = subtotal + totalCGST + totalSGST + totalIGST +
      addons.reduce((s, a) => s + a.value, 0);

    await Document.create(
      [{
        email,
        type:      voucherType === "Sale" ? "Invoice" : "PurchaseBill",
        voucherNo,
        date:      txDate,
        party: {
          type:    voucherType === "Sale" ? "Customer" : "Supplier",
          name:    (party as any).name,
          taxId:   (party as any).taxId ?? (party as any).gstin,
          state:   (party as any).state,
          address: (party as any).address,
        },
        company: {
          name:    (company as any).name,
          gstin:   (company as any).gstin,
          state:   (company as any).state,
          address: (company as any).address,
        },
        items:     items.map((item) => ({
          productId: item.productId,
          qty:       item.qty,
          uom:       item.uom,
          rate:      item.rate,
          discount:  item.discount,
          amount:    item.qty * item.rate * (1 - item.discount / 100),
          gstRate:   item.gstRate,
        })),
        addons,
        subtotal,
        taxSummary: { cgst: totalCGST, sgst: totalSGST, igst: totalIGST },
        grandTotal,
        sourceVoucher: voucherType,
      }],
      { session }
    );

    // ── Update party totals ─────────────────────────────────────────────────
    const totalTax = totalCGST + totalSGST + totalIGST;
    await Party.findByIdAndUpdate(
      partyId,
      {
        $inc: {
          ...(voucherType === "Sale"
            ? { totalSales: subtotal + totalTax }
            : { totalPurchases: subtotal + totalTax }),
        },
        $set: { lastTransactionDate: txDate },
      },
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json(
      {
        success:    true,
        voucherNo,
        grandTotal,
        taxSummary: { cgst: totalCGST, sgst: totalSGST, igst: totalIGST },
      },
      { status: 201 }
    );

  } catch (err: any) {
    if (session.inTransaction()) await session.abortTransaction();
    const status = err.status ?? 500;
    console.error("[/api/billing] Error:", err.message);
    return NextResponse.json(
      { message: err.message || "Billing failed" },
      { status }
    );
  } finally {
    session.endSession();
  }
}
