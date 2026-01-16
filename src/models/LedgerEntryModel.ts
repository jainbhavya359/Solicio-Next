import { Schema, model, models } from "mongoose";

const LedgerEntrySchema = new Schema({
  email: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },

  voucherType: {
    type: String,
    enum: ["Purchase", "Sale", "PurchaseReturn", "SaleReturn"],
    required: true,
    index: true,
  },

  voucherNo: { type: String, required: true, unique: true },

  itemName: { type: String, required: true },
  unit: { type: String, required: true },

  debitQty: { type: Number, default: 0 },
  creditQty: { type: Number, default: 0 },

  rate: { type: Number, required: true },
  amount: { type: Number, required: true },

  // ⭐ CRITICAL FOR COGS
  costAmount: {
    type: Number,
    default: 0,
    required: true,
  },

  isReversal: { type: Boolean, default: false },
  reversedEntryId: {
    type: Schema.Types.ObjectId,
    ref: "ledgerEntry",
    default: null,
  },

  fifoBreakup: [
    {
      layerId: { type: Schema.Types.ObjectId, ref: "stockLayer" },
      qty: Number,
      rate: Number,
    }
  ],
  narration: { type: String, default: "" },


}, { timestamps: true }
);


export const LedgerEntry = models.ledgerEntry || model("ledgerEntry", LedgerEntrySchema);
