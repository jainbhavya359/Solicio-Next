import { Schema, model, models } from "mongoose";

const LedgerEntrySchema = new Schema(
  {
    email: { type: String, required: true },

    date: { type: Date, required: true },

    voucherType: {
      type: String,
      enum: ["Purchase", "Sale", "PurchaseReturn", "SaleReturn"],
      required: true,
    },

    voucherNo: {
      type: String,
      required: true,
      unique: true, // ✅ correct place for uniqueness
    },

    partyName: {
      type: String,
      default: "Cash",
    },

    partyType: {
      type: String,
      enum: ["Customer", "Supplier", "Cash"],
      default: "Cash",
    },

    itemName: { type: String, required: true },
    unit: { type: String, required: true },

    debitQty: { type: Number, default: 0 },
    creditQty: { type: Number, default: 0 },

    rate: { type: Number, required: true },
    amount: { type: Number, required: true },

    costAmount: {
      type: Number,
      default: 0,
      required: true,
    },

    isReversal: { type: Boolean, default: false },

    reversedEntryId: {
      type: Schema.Types.ObjectId,
      ref: "LedgerEntry",
      default: null,
    },

    fifoBreakup: [
      {
        layerId: {
          type: Schema.Types.ObjectId,
          ref: "StockLayer",
        },
        qty: { type: Number },
        rate: { type: Number },
      },
    ],

    narration: { type: String, default: "" },
  },
  { timestamps: true }
);

/* -------------------- INDEXES -------------------- */

/**
 * 1️⃣ Ledger pagination & running balance
 */
LedgerEntrySchema.index({
  email: 1,
  date: 1,
  createdAt: 1,
});

/**
 * 2️⃣ Stock movement & health score aggregation
 */
LedgerEntrySchema.index({
  email: 1,
  voucherType: 1,
  isReversal: 1,
  date: -1,
});

/**
 * 3️⃣ Product-wise aggregation (FIFO, movement, analytics)
 */
LedgerEntrySchema.index({
  email: 1,
  itemName: 1,
  unit: 1,
  date: -1,
});

/**
 * 4️⃣ Enforce single reversal per entry (CRITICAL)
 */
LedgerEntrySchema.index(
  { reversedEntryId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      reversedEntryId: { $ne: null },
    },
  }
);

export const LedgerEntry =
  models.LedgerEntry || model("LedgerEntry", LedgerEntrySchema);
