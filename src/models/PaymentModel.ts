import { Schema, model, models, Types } from "mongoose";

const PaymentSchema = new Schema(
    {
        email: { type: String, required: true }, // Tenant email

        partyName: { type: String, required: true },
        type: {
            type: String,
            enum: ["RECEIVE", "PAY"],
            required: true
        },
        amount: { type: Number, required: true, min: 0 },
        date: { type: Date, required: true },

        notes: { type: String, default: "" },
        voucherNo: { type: String, required: true, unique: true },

        // 🚀 STRICT ERP: Explicit Accounting Mapping
        // Requires structural balancing generating Debits (Banks) and Credits (Parties) locally
        journalEntryId: {
            type: Types.ObjectId,
            ref: "JournalEntry",
            required: true,
            index: true
        },

        // 🚀 STRICT ERP: Direct Document Allocations unlocking partial/multi invoice settlements mathematically
        allocations: [
            {
                documentId: { type: Types.ObjectId, ref: "Document", required: true },
                amountSettled: { type: Number, required: true, min: 0 }
            }
        ],

        // Link to source transaction if generated automatically (Legacy fallbacks)
        sourceTransaction: { type: String, default: "" },
        
        status: { type: String, enum: ["completed", "reversed"], default: "completed" }
    },
    { timestamps: true }
);

// Payment Immutability Rule (CA-Grade Security)
PaymentSchema.pre("save", async function () {
  const doc = this as any;
  if (!doc.isNew) {
    const modelClass = doc.constructor as any;
    const originalDoc = await modelClass.findById(doc._id).lean();
    if (originalDoc && originalDoc.status === "completed") {
      if (doc.isModified() && doc.status !== "reversed") {
        throw new Error("IMMUTABILITY_LOCKED: Completed payments cannot be altered functionally. Must issue a reversal journal entry natively modifying balances.");
      }
    }
  }
});

PaymentSchema.index({ email: 1, date: -1 });

export const Payment = models.Payment || model("Payment", PaymentSchema);
