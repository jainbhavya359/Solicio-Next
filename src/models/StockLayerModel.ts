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
    },

    qtyIn: { type: Number, required: true },

    // SCALABILITY & INTEGRITY FIX: Prevents concurrent POS bursts from pushing stock negative.
    qtyRemaining: {
      type: Number,
      required: true,
      min: 0
    },

    rate: { type: Number, required: true },

    date: { type: Date, required: true },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: false,
      index: true
    },

    batchNumber: { type: String, index: true },
    expiryDate: { type: Date, index: true },

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      index: true
    },

    syncState: {
      type: String,
      enum: ["synced", "pending", "conflict"],
      default: "synced"
    }
  },
  { timestamps: true }
);

/* -------------------- LEGACY INDEXES (INTACT) -------------------- */

/**
 * 1️⃣ FIFO consumption (MOST IMPORTANT)
 * Supports: find({ qtyRemaining: { $gt: 0 } }).sort({ date: 1 })
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
 * 3️⃣ Fast lookup for associated transaction
 */
StockLayerSchema.index({ sourceLedgerId: 1 });

/* -------------------- MODERN INDEXES (ADDITIVE & OPTIMIZED) -------------------- */
// NOTE: Future queries replacing `productName` MUST use `productId`. Example:
// find({ email: email, productId: productId, qtyRemaining: { $gt: 0 } }).sort({ date: 1 })

/**
 * 4️⃣ Real FIFO Queries (Modern Path)
 * Optimizes the high-frequency POS checkout queries mapping exact products.
 */
StockLayerSchema.index({
  email: 1,
  productId: 1,
  qtyRemaining: 1,
  date: 1
});

/**
 * 5️⃣ Partial Index for Active Layers Only
 * Eliminates full collection scans and drastically shrinks index memory size 
 * by only indexing layers that still have stock left to sell.
 */
StockLayerSchema.index(
  { productId: 1, date: 1 },
  { partialFilterExpression: { qtyRemaining: { $gt: 0 } } }
);

/**
 * 6️⃣ Highly Selective Batch Index
 * Avoids global scans on generic batch strings by tying searches to a specific product.
 */
StockLayerSchema.index({ productId: 1, batchNumber: 1 });

/**
 * 7️⃣ Offline Sync & Multi-Location Constraints
 */
StockLayerSchema.index({ email: 1, syncState: 1 }); // Speeds up offline sync resolution
StockLayerSchema.index({ productId: 1, locationId: 1 }); // Scoped warehouse filtration

/* ========================================================= */
/* ⚠️ CONCURRENCY RISK GUIDANCE                             */
/* ========================================================= */
// High write concurrency against StockLayers (e.g. POS checkout bursts) can cause
// stock inconsistencies due to race conditions if documents are read, modified in JS memory, and saved.
//
// RECOMMENDATION FOR SERVICES:
// 1. ALWAYS use atomic operations (e.g., `$inc: { qtyRemaining: -consumedQty }`).
// 2. ALWAYS execute layer deductions inside MongoDB Transactions (`{ session }`).

export const StockLayer =
  models.StockLayer || model("StockLayer", StockLayerSchema);

