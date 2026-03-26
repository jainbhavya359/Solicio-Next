import { Schema, model, models, Types } from "mongoose";

const JournalEntrySchema = new Schema(
  {
    email: { type: String, required: true, index: true, immutable: true },

    date: { type: Date, required: true, immutable: true, index: true },
    
    voucherType: {
      type: String,
      required: true,
      immutable: true,
      index: true
    },
    
    voucherNo: { type: String, required: true, immutable: true, index: true },

    // Idempotency: Drop duplicate network retries natively atomically
    idempotencyKey: { type: String, required: true, unique: true, immutable: true },

    entries: [
      {
        accountId: { type: Types.ObjectId, ref: "Account", required: true, immutable: true },
        type: { type: String, enum: ["debit", "credit"], required: true, immutable: true },
        amount: { type: Number, required: true, min: 0, immutable: true },
        narration: { type: String, default: "" }
      }
    ],

    totalAmount: { type: Number, required: true, min: 0, immutable: true },

    // Hard linkage mappings
    referenceId: { type: Types.ObjectId, default: null, immutable: true }, // e.g., LedgerEntry ID
    referenceModel: { type: String, enum: ["LedgerEntry", "Payment", null], default: null, immutable: true },

    // Audit Trail
    createdBy: { type: Types.ObjectId, ref: "User", default: null, immutable: true },
    source: { type: String, enum: ["API", "System_Migration", "Manual_Adjustment"], default: "API", immutable: true },

    // Correction Logic: Immutable records must be reversed dynamically using counter-vouchers
    isReversed: { type: Boolean, default: false },
    reversalJournalId: { type: Types.ObjectId, ref: "JournalEntry", default: null }
  },
  { timestamps: true }
);

/* -------------------- CA-GRADE VALIDATION -------------------- */
// 1. Double-Entry Balance Enforcement (Driver Level)
JournalEntrySchema.pre("save", function(next: any) {
  let debitTotal = 0;
  let creditTotal = 0;

  for (const entry of this.entries) {
    if (entry.type === "debit") debitTotal += entry.amount;
    if (entry.type === "credit") creditTotal += entry.amount;
  }

  // Float precision buffer mapping Javascript arithmetic drift
  if (Math.abs(debitTotal - creditTotal) > 0.001) {
    const err = new Error(`DOUBLE_ENTRY_VIOLATION: Debits (${debitTotal}) do not equal Credits (${creditTotal}).`);
    return next(err);
  }

  // Total validation
  if (Math.abs(debitTotal - this.totalAmount) > 0.001) {
    const err = new Error(`TOTAL_AMOUNT_MISMATCH: Computed total (${debitTotal}) does not match declared totalAmount.`);
    return next(err);
  }

  next();
});

JournalEntrySchema.index({ email: 1, date: 1 });
JournalEntrySchema.index({ email: 1, voucherNo: 1 });

export const JournalEntry = models.JournalEntry || model("JournalEntry", JournalEntrySchema);
