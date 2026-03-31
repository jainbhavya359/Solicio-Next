import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { EntryCounter } from "@/src/models/EntryCounterModel";
import { Document } from "@/src/models/DocumentModel";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    await connect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, date, voucherType, amount, narration = "" } = await req.json();

        if (!email || !voucherType || !amount || amount <= 0) {
            return NextResponse.json(
                { error: "Missing required fields or invalid amount" },
                { status: 400 }
            );
        }

        if (!["Expense", "TaxPayment", "StockWriteOff"].includes(voucherType)) {
            return NextResponse.json({ error: "Invalid financial voucher type" }, { status: 400 });
        }

        const txDate = date ? new Date(date) : new Date();
        const dateKey = txDate.toISOString().slice(0, 10).replace(/-/g, "");

        let prefix = "EXP";
        if (voucherType === "TaxPayment") prefix = "TAX";
        if (voucherType === "StockWriteOff") prefix = "WRO";

        // 🔢 Voucher counter (atomic)
        const counter = await EntryCounter.findOneAndUpdate(
            { email, series: voucherType, dateKey },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true, session }
        );

        const voucherNo = `${prefix}-${dateKey}-${String(counter.seq).padStart(3, "0")}`;

        const [entry] = await LedgerEntry.create(
            [{
                email,
                date: txDate,
                voucherType,
                voucherNo,
                itemName: voucherType, // Default to the voucher type name
                unit: "N/A",
                debitQty: 0,
                creditQty: 0,
                rate: amount,
                amount: amount,
                costAmount: 0, // Required by LedgerEntryModel
                narration,
            }],
            { session }
        );

        // Also generate a generic Document so that clicking 'View' in the Ledger works
        const [doc] = await Document.create(
            [{
                email,
                type: voucherType === "Sale" ? "Invoice" : "Bill",
                voucherNo,
                date: txDate,
                party: {
                    type: "Customer",
                    category: "Individual",
                    name: "Cash",
                },
                item: {
                    name: "Financial Entry",
                    unit: "N/A",
                    quantity: 1,
                    rate: amount,
                    amount: amount,
                    gstRate: 0,
                },
                subtotal: amount,
                tax: 0,
                total: amount,
                sourceVoucher: voucherType,
            }],
            { session }
        );

        await session.commitTransaction();
        return NextResponse.json({ success: true, entry, doc });

    } catch (err: any) {
        await session.abortTransaction();
        console.error("FINANCIAL ENTRY POST ERROR:", err);
        return NextResponse.json(
            { error: err?.message || "Financial entry failed" },
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
        const type = searchParams.get("type");

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const query: any = { email };
        if (type) {
            query.voucherType = type;
        } else {
            query.voucherType = { $in: ["Expense", "TaxPayment", "StockWriteOff"] };
        }

        const entries = await LedgerEntry.find(query).sort({ date: -1, createdAt: -1 }).lean();
        return NextResponse.json(entries);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await connect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Entry ID required" }, { status: 400 });
        }

        await LedgerEntry.findByIdAndDelete(id, { session });
        await session.commitTransaction();

        return NextResponse.json({ success: true });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
    } finally {
        session.endSession();
    }
}
