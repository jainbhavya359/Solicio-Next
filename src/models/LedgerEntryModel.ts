import { Schema, model, models } from "mongoose";

const LedgerEntrySchema = new Schema(
  {
    email: { type: String, required: true },

    date: { type: Date, required: true },

    voucherType: {
      type: String,
      enum: ["Purchase", "Sale", "PurchaseReturn", "SaleReturn", "Expense", "TaxPayment", "StockWriteOff"],
      required: true,
    },

    voucherNo: {
      type: String,
      required: true,
      unique: true,
    },

    partyName: {
      type: String,
      default: "Cash",
    },

    partyType: {
      type: String,
      enum: ["Customer", "Supplier", "Cash"],
      default: "Cash",
    },

    itemName: { type: String, required: true },
    unit: { type: String, required: true },

    debitQty: { type: Number, default: 0 },
    creditQty: { type: Number, default: 0 },

    rate: { type: Number, required: true },
    amount: { type: Number, required: true },

    costAmount: {
      type: Number,
      default: 0,
      required: true,
    },

    isReversal: { type: Boolean, default: false },

    reversedEntryId: {
      type: Schema.Types.ObjectId,
      ref: "LedgerEntry",
      default: null,
    },

    fifoBreakup: [
      {
        layerId: {
          type: Schema.Types.ObjectId,
          ref: "StockLayer",
        },
        qty: { type: Number },
        rate: { type: Number },
      },
    ],

    /* ========================================================= */
    /* 🚀 ERP ACCOUNTING LAYER: ADDITIVE COMPLIANCE METADATA     */
    /* ========================================================= */

    // Core Accounting Spine Linkage
    journalEntryId: {
      type: Schema.Types.ObjectId,
      ref: "JournalEntry",
      default: null,
      index: true
    },
    
    // Explicit Product Entity Linkage (Backwards Compatible alongside itemName)
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      default: null,
      index: true
    },

    // Multi-Item Invoice Mapping (Scales beyond single itemName entries)
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Products" },
        qty: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
        gstRate: { type: Number, default: 0 },
        hsnSac: { type: String, default: "" },
        batchNumber: { type: String, default: "" },
        locationId: { type: Schema.Types.ObjectId, ref: "Location" }
      }
    ],

    // GST Specific Routing (GSTR1/GSTR3B)
    taxDetails: {
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 }
    },

    // IRP E-Invoice Payload Storage
    einvoice: {
      irn: { type: String, default: null },
      ackNo: { type: String, default: null },
      ackDate: { type: Date, default: null },
      qrCode: { type: String, default: null }, // Usually base64 or secure URL
      status: {
        type: String,
        enum: ["pending", "generated", "failed", "cancelled", null],
        default: null
      }
    },

    // Synchronization Buffers
    syncState: {
      type: String,
      enum: ["synced", "pending", "conflict"],
      default: "synced",
      index: true
    },
    
    meta: { type: Schema.Types.Mixed, default: {} },

    narration: { type: String, default: "" },
  },
  { timestamps: true, bufferCommands: false }
);

/* -------------------- INDEXES -------------------- */

/**
 * 1️⃣ Ledger pagination & running balance
 */
LedgerEntrySchema.index({
  email: 1,
  date: 1,
  createdAt: 1,
});

/**
 * 2️⃣ Stock movement & health score aggregation
 */
LedgerEntrySchema.index({
  email: 1,
  voucherType: 1,
  isReversal: 1,
  date: -1,
});

/**
 * 3️⃣ Product-wise aggregation (FIFO, movement, analytics)
 */
LedgerEntrySchema.index({
  email: 1,
  itemName: 1,
  unit: 1,
  date: -1,
});

/**
 * 4️⃣ Enforce single reversal per entry (CRITICAL)
 */
LedgerEntrySchema.index(
  { reversedEntryId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      reversedEntryId: { $ne: null },
    },
  }
);

LedgerEntrySchema.index({ email: 1, date: 1 });
LedgerEntrySchema.index({ voucherType: 1 });


export const LedgerEntry =
  models.LedgerEntry || model("LedgerEntry", LedgerEntrySchema);
