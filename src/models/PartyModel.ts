
import { Schema, model, models } from "mongoose";

const PartySchema = new Schema(
    {
        email: { type: String, required: true }, // The user (tenant) email

        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["Customer", "Supplier"],
            default: "Customer",
        },
        category: {
            type: String,
            enum: ["Individual", "Company"],
            default: "Individual",
        },

        /* 📞 Contact Info */
        contactPerson: String,
        phone: String,
        emailAddress: String, // The party's email

        /* 🏢 Company Info */
        gstin: String,
        pan: String,

        /* 📍 Address */
        address: String,
        city: String,
        state: String,
        pincode: String,

        /* 💰 Financials */
        paymentTerms: String,
        creditLimit: Number,

        /* 📈 Aggregates (Updated via transactions) */
        totalSales: { type: Number, default: 0 },
        totalPurchases: { type: Number, default: 0 },

        /* 💸 Payment Tracking */
        totalReceived: { type: Number, default: 0 }, // Money received from this party
        totalPaid: { type: Number, default: 0 }, // Money paid to this party

        outstandingBalance: { type: Number, default: 0 }, // +ve = Receivable, -ve = Payable

        lastTransactionDate: Date,
    },
    { timestamps: true }
);

// Compound index to prevent duplicate names for the same user
PartySchema.index({ email: 1, name: 1 }, { unique: true });

// Force Mongoose to re-register the schema so newly added fields during dev won't be dropped
if (models.Party) {
    delete models.Party;
}

export const Party = model("Party", PartySchema);
