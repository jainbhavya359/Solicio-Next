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
    gstRate: { type: Number, default: 0 }, // Added GST Rate
    lastSaleAt: { type: Date, default: null },
    lastMovedAt: { type: Date, default: null },

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

    /* ========================================================= */
    /* 🚀 PRODUCT INTELLIGENCE LAYER: ADDITIVE & SCALABLE FIELDS */
    /* ========================================================= */

    /* 🔹 1. Identification & POS Workflow */
    sku: { type: String }, // For multi-domain & catalog sync
    barcode: { type: String }, // Optimized for fast POS lookup

    /* 🔹 2. Smart Pricing System */
    mrp: { type: Number }, // Maximum Retail Price for compliance
    wholesalePrice: { type: Number }, // Basic B2B wholesale pricing
    pricingRules: [
      {
        type: { type: String }, // e.g., 'seasonal', 'bulk', 'b2b-tier1'
        minQty: Number,
        price: Number
      }
    ],

    /* 🔹 3. GST & Tax Intelligence */
    hsnSac: { type: String }, // Required for valid GST B2B/Export billing
    taxability: { 
      type: String, 
      enum: ['taxable', 'exempt', 'nil-rated', 'non-gst'], 
      default: 'taxable' 
    },
    // Extensible property to differentiate logic without locking into 'service' only
    productNature: { 
      type: String, 
      enum: ["goods", "service"], 
      default: "goods" 
    },

    /* 🔹 4. Advanced Inventory & Multi-Location Support */
    isBatchTracked: { type: Boolean, default: false }, // Enforce batch/lot selection at billing
    isExpiryTracked: { type: Boolean, default: false }, // Requires expiry capturing
    shelfLifeDays: { type: Number }, // For automated expiry date prediction
    
    // SCALABILITY FIX: Instead of embedding `locationStock` (which bloats documents),
    // we use a flag to indicate if we should query the `ProductLocationStock` collection.
    hasMultiLocation: { type: Boolean, default: false },

    /* 🔹 5. Analytics & Smart Insights (Denormalized) */
    // SCALABILITY NOTE: `totalSoldQty` and `totalRevenue` must ONLY be updated 
    // via a centralized background service (queue/cron) or a specialized ledger aggregation layer
    // to prevent Race Conditions and MongoDB lock contention during high-velocity concurrent checkouts.
    totalSoldQty: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },

    /* 🔹 6. Automation Readiness */
    category: { type: String }, // Logical grouping
    tags: [{ type: String }], // Used for AI/ML automated recommendations

    /* 🔹 7. Offline-First Capability constraints */
    syncState: { 
      type: String, 
      enum: ['synced', 'pending', 'conflict'], 
      default: 'synced'
    },
    lastSyncedAt: { type: Date, default: Date.now },
    // SCALABILITY FIX: Structured alternative to schema-less Mixed types for conflict resolution.
    unsyncedChanges: {
      fields: [String],
      lastModifiedAt: Date,
      deviceId: String
    }
  },
  { timestamps: true }
);

// =========================================================
// 🚀 INDEXING STRATEGY FOR HIGH VELOCITY QUERIES
// =========================================================

// Existing Multi-tenant constraint
ProductSchema.index({ email: 1, name: 1, unit: 1 }, { unique: true });
ProductSchema.index({ email: 1, productType: 1 });

// POS Barcode & SKU lookup (high velocity)
ProductSchema.index({ email: 1, barcode: 1 }, { sparse: true });
ProductSchema.index({ email: 1, sku: 1 }, { sparse: true });

// Automation & Categorization grouping
ProductSchema.index({ email: 1, category: 1 });

// Sync querying
ProductSchema.index({ email: 1, syncState: 1 });


export const Products =
  models.Products || model("Products", ProductSchema);
