import { Schema, models, model, Types } from "mongoose";

const ProductSchema = new Schema(
  {
    email: { type: String, required: true },

    name: { type: String, required: true },

    unit: {
      type: String,
      required: true,
      immutable: true,
    },

    productType: {
      type: String,
      enum: ["simple", "composite"],
      default: "simple",
      index: true,
    },

    /* 🔹 Simple product stock */
    quantity: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },

    /* 🔹 Composite product recipe (BOM) */
    recipe: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Products",
          required: true,
        },
        productName: String, // denormalized for speed
        unit: String,        // ingredient unit
        qtyRequired: {
          type: Number,
          required: true,
          min: 0.0001,
        },
      },
    ],

    /* 🔹 Costing */
    costingMethod: {
      type: String,
      enum: ["FIFO", "WAVG"],
      default: "FIFO",
    },

    lowStockConfig: {
      minQty: { type: Number, default: 5 },
      warningQty: { type: Number, default: 10 },
    },
  },
  { timestamps: true }
);

ProductSchema.index({ email: 1, name: 1, unit: 1 }, { unique: true });
ProductSchema.index({ email: 1, productType: 1 });

export const Products =
  models.Products || model("Products", ProductSchema);
