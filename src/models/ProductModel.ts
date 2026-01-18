import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    email: { type: String, required: true },

    name: { type: String, required: true },

    unit: {
      type: String,
      required: true,
      immutable: true, // 🔒 unit lock
    },

    quantity: { type: Number, default: 0 },

    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },

    costingMethod: {
      type: String,
      enum: ["FIFO", "WAVG"],
      default: "FIFO",
    },

    lowStockConfig: {
      minQty: { type: Number, default: 5 },
      warningQty: { type: Number, default: 10 },
      criticalDays: { type: Number, default: 3 },
      warningDays: { type: Number, default: 7 },
      lowDays: { type: Number, default: 14 },
    },
  },
  { timestamps: true }
);

/* -------------------- INDEXES -------------------- */

/**
 * Unique product per user per unit
 */
ProductSchema.index(
  { email: 1, name: 1, unit: 1 },
  { unique: true }
);

/**
 * Fast stock dashboards
 */
ProductSchema.index({
  email: 1,
  quantity: 1,
});

export const Products =
  models.Products || model("Products", ProductSchema);
