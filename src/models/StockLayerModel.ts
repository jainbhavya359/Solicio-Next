import { Schema, models, model } from "mongoose";

const StockLayerSchema = new Schema(
  {
    email: { type: String, required: true },

    productName: { type: String, required: true },
    unit: { type: String, required: true },

    sourceLedgerId: {
      type: Schema.Types.ObjectId,
      ref: "LedgerEntry",
      required: true,
      index: true, // 🔥 used during reversal restore
    },

    qtyIn: { type: Number, required: true },
    qtyRemaining: { type: Number, required: true },

    rate: { type: Number, required: true },

    date: { type: Date, required: true },
  },
  { timestamps: true }
);

/* -------------------- INDEXES -------------------- */

/**
 * 1️⃣ FIFO consumption (MOST IMPORTANT)
 * Supports:
 *   find({ qtyRemaining: { $gt: 0 } }).sort({ date: 1 })
 */
StockLayerSchema.index({
  email: 1,
  productName: 1,
  unit: 1,
  date: 1,
});

/**
 * 2️⃣ Fast remaining-stock filtering
 */
StockLayerSchema.index({
  email: 1,
  productName: 1,
  unit: 1,
  qtyRemaining: 1,
});

/**
 * 3️⃣ Prevent duplicate layers per ledger
 */
StockLayerSchema.index(
  { sourceLedgerId: 1 },
  { unique: true }
);

export const StockLayer =
  models.StockLayer || model("StockLayer", StockLayerSchema);
