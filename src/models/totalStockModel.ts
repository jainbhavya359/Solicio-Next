import { Schema, model, models } from "mongoose";

const TotalStockSchema = new Schema(
  {
    email: { type: String, required: true },

    name: { type: String, required: true },
    unit: { type: String, required: true },

    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },

    /**
     * 🧠 Movement metadata (OPTIONAL but recommended)
     * Can be populated later for O(1) APIs
     */
    lastSaleAt: { type: Date, default: null },
    lastMovedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/* -------------------- INDEXES -------------------- */

/**
 * 1️⃣ Unique product per user
 */
TotalStockSchema.index(
  { email: 1, name: 1, unit: 1 },
  { unique: true }
);

/**
 * 2️⃣ Slow-moving stock queries
 */
TotalStockSchema.index({
  email: 1,
  quantity: 1,
});

/**
 * 3️⃣ Movement-based dashboards (future-ready)
 */
TotalStockSchema.index({
  email: 1,
  lastMovedAt: -1,
});

export const TotalStock =
  models.TotalStock || model("TotalStock", TotalStockSchema);
