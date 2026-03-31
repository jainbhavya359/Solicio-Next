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


    sku: { type: String }, // For multi-domain & catalog sync
    barcode: { type: String }, // Optimized for fast POS lookup

    mrp: { type: Number }, // Maximum Retail Price for compliance
    wholesalePrice: { type: Number }, // Basic B2B wholesale pricing
    pricingRules: [
      {
        type: { type: String }, // e.g., 'seasonal', 'bulk', 'b2b-tier1'
        minQty: Number,
        price: Number
      }
    ],

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

    /* 🔹 Add to Tax/Compliance section */
    isTaxInclusive: { type: Boolean, default: true },
    cess: { type: Number, default: 0 },
    countryOfOrigin: { type: String },

    /* 🔹 Add to Unit section */
    uom: {
      baseUnit: { type: String }, // The unit used for stock (e.g., 'pcs')
      purchaseUnit: { type: String }, // Unit from supplier (e.g., 'box')
      conversionFactor: { type: Number, default: 1 }
    },

    /* 🔹 Add to Stock section */
    isInventoryTracked: { type: Boolean, default: true },

    /* 🔹 Add to Logistics (Exports/Retail Shipping) */
    dimensions: {
      weight: Number,
      length: Number,
      width: Number,
      height: Number
    },

    isBatchTracked: { type: Boolean, default: false }, // Enforce batch/lot selection at billing
    isExpiryTracked: { type: Boolean, default: false }, // Requires expiry capturing
    shelfLifeDays: { type: Number }, // For automated expiry date prediction

    //Instead of embedding `locationStock` (which bloats documents),
    // we use a flag to indicate if we should query the `ProductLocationStock` collection.
    hasMultiLocation: { type: Boolean, default: false },

    // `totalSoldQty` and `totalRevenue` must ONLY be updated 
    // to prevent Race Conditions and MongoDB lock contention during high-velocity concurrent checkouts.
    totalSoldQty: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },

    category: { type: String }, // Logical grouping
    tags: [{ type: String }], // Used for AI/ML automated recommendations

    syncState: {
      type: String,
      enum: ['synced', 'pending', 'conflict'],
      default: 'synced'
    },
    lastSyncedAt: { type: Date, default: Date.now },
    // Structured alternative to schema-less Mixed types for conflict resolution.
    unsyncedChanges: {
      fields: [String],
      lastModifiedAt: Date,
      deviceId: String
    }
  },
  { timestamps: true }
);



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
