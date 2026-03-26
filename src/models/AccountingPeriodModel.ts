import { Schema, model, models } from "mongoose";

const AccountingPeriodSchema = new Schema(
  {
    email: { type: String, required: true, index: true },
    
    periodName: { type: String, required: true }, // e.g., "FY 2026-27 Q1"
    
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    // CRITICAL: Permanent chronological lock blocking historical journal manipulation
    // Prevents users from retroactively altering filed GST returns/Balance sheets
    isClosed: { type: Boolean, default: false, index: true },
    
    closedAt: { type: Date, default: null },
    closedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

// Ensure chronologically isolated financial limits per tenant avoiding overlaps natively
AccountingPeriodSchema.index({ email: 1, startDate: 1, endDate: 1 }, { unique: true });

export const AccountingPeriod = models.AccountingPeriod || model("AccountingPeriod", AccountingPeriodSchema);
