import connect from "@/src/dbConfig/dbConnection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { Payment } from "@/src/models/PaymentModel";
import { Party } from "@/src/models/PartyModel";
import { generateVoucherNo } from "@/src/utils/voucher";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    await connect();
    await Payment.createCollection().catch(() => { });
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, partyName, type, amount, date, notes } = await req.json();

        if (!email || !partyName || !type || amount == null || !date) {
            throw new Error("INVALID_PAYLOAD");
        }

        const txDate = new Date(date);
        const numAmount = Number(amount);

        if (numAmount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        // Generate Voucher
        const voucherNo = await generateVoucherNo({
            email,
            series: type === "RECEIVE" ? "REC" : "PAY",
            date: txDate,
            session,
        });

        // Create Payment Record
        const [payment] = await Payment.create(
            [{
                email,
                partyName,
                type,
                amount: numAmount,
                date: txDate,
                notes: notes || "",
                voucherNo
            }],
            { session }
        );

        // Update Party Balance
        const updateField = type === "RECEIVE" ? { totalReceived: numAmount } : { totalPaid: numAmount };

        const updatedParty = await Party.findOneAndUpdate(
            { email, name: partyName },
            {
                $inc: updateField,
                $set: { lastTransactionDate: txDate } // Consider a payment as a transaction activity
            },
            { new: true, session }
        );

        if (!updatedParty) {
            throw new Error("Party not found");
        }

        await session.commitTransaction();
        return NextResponse.json({ success: true, payment, party: updatedParty });

    } catch (err: any) {
        if (session.inTransaction()) await session.abortTransaction();
        console.error("Payment error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to record payment" },
            { status: 500 }
        );
    } finally {
        session.endSession();
    }
}

export async function GET(request: NextRequest) {
    await connect();
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const partyName = searchParams.get("partyName");

        if (!email) {
            return NextResponse.json({ error: "No email Found" }, { status: 400 });
        }

        const query: any = { email };
        if (partyName) {
            query.partyName = partyName;
        }

        const payments = await Payment.find(query).sort({ date: -1, createdAt: -1 });

        return NextResponse.json(payments);
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }
}
