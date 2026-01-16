import { Schema, models, model } from "mongoose";

const StockLayerSchema = new Schema({
  email: { type: String, required: true },

  productName: { type: String, required: true },
  unit: { type: String, required: true },

  sourceLedgerId: {
    type: Schema.Types.ObjectId,
    ref: "LedgerEntry",
    required: true,
  },

  qtyIn: { type: Number, required: true },
  qtyRemaining: { type: Number, required: true },

  rate: { type: Number, required: true },

  date: { type: Date, required: true },
});

export const StockLayer = models.stockLayer || model("stockLayer", StockLayerSchema);
