import { Schema, model, models, Types } from "mongoose";

const AccountSchema = new Schema(
  {
    email: { type: String, required: true, index: true },
    
    name: { type: String, required: true },
    
    // Core accounting groups mapping Trial Balance
    type: {
      type: String,
      enum: ["Asset", "Liability", "Income", "Expense", "Equity"],
      required: true,
      index: true
    },
    
    // Materialized Path for CA-grade hierarchical P&L aggregation (e.g., "/Assets/Current/Bank/HDFC")
    // Prevents expensive recursive database graph lookups at massive scale
    path: { type: String, required: true, index: true },
    parentAccountId: { type: Types.ObjectId, ref: "Account", default: null },
    
    // DB System lock for critical automatic routing ledgers (Sales, Tax Payables, etc.)
    isSystemAccount: { type: Boolean, default: false },
    
    // Explicit GST compliance mapping routing outputs precisely for GSTR-3B filings
    gstType: {
      type: String,
      enum: ["input", "output", null],
      default: null,
    },
    
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Prevent duplicate account nomenclatures colliding within the same hierarchy per tenant map
AccountSchema.index({ email: 1, name: 1, parentAccountId: 1 }, { unique: true });

export const Account = models.Account || model("Account", AccountSchema);
