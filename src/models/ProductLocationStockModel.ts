import { Schema, models, model, Types } from "mongoose";

// SCALABILITY: This collection prevents the Product model from exceeding 
// MongoDB's 16MB document limit and optimizes read/write operations when dealing 
// with multi-warehouse or branch-based inventory distributions.
const ProductLocationStockSchema = new Schema(
  {
    email: { type: String, required: true, index: true },
    productId: { type: Types.ObjectId, ref: "Products", required: true, index: true },
    locationId: { type: Types.ObjectId, required: true },
    quantity: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Prevent duplicate location records for a single product within an organization
ProductLocationStockSchema.index({ email: 1, productId: 1, locationId: 1 }, { unique: true });

export const ProductLocationStock =
  models.ProductLocationStock || model("ProductLocationStock", ProductLocationStockSchema);
