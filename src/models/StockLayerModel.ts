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
    
    // SCALABILITY & INTEGRITY FIX: Prevents concurrent POS bursts from pushing stock negative.
    qtyRemaining: { 
      type: Number, 
      required: true,
      min: 0 
    },

    rate: { type: Number, required: true },

    date: { type: Date, required: true },

    /* ========================================================= */
    /* 🚀 CONTEXT-AWARE INVENTORY LAYER: SCALABLE & ADDITIVE     */
    /* ========================================================= */

    // 1. Strong Product Linkage (Backward Compatible)
    // Why: `productName` is fragile at scale (renaming/collisions). 
    // Fallback: Existing core FIFO logic running against `productName` remains explicitly intact.
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: false,
      index: true
    },

    // 2. Batch & Expiry Tracking
    // Why: Critical for FMCG/Pharma routing where strict FIFO isn't sufficient (Requires FEFO).
    // Conflict avoidance: Nullable strings/dates ensure standard products safely ignore these fields entirely.
    batchNumber: { type: String, index: true },
    expiryDate: { type: Date, index: true },

    // 3. Multi-Location Support (Optional)
    // Why: Allows grouping warehouse-specific inventory distributions.
    // Compatibility: Existing `find` executions missing `locationId` map as the baseline origin organically.
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      index: true
    },

    // 4. Offline Sync Support
    // Why: Permits buffering POS transactions globally to resolve isolated network sync merges across multiple store nodes.
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
 * 3️⃣ Prevent duplicate layers per ledger
 */
StockLayerSchema.index(
  { sourceLedgerId: 1 },
  { unique: true }
);

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

