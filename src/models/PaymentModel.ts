import { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
    {
        email: { type: String, required: true }, // Tenant email

        partyName: { type: String, required: true },
        type: {
            type: String,
            enum: ["RECEIVE", "PAY"],
            required: true
        },
        amount: { type: Number, required: true },
        date: { type: Date, required: true },

        notes: { type: String, default: "" },
        voucherNo: { type: String, required: true },

        // Link to source transaction if generated automatically
        sourceTransaction: { type: String, default: "" },
    },
    { timestamps: true }
);

export const Payment = models.Payment || model("Payment", PaymentSchema);
