import { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema(
  {
    email: { type: String, required: true },

    type: {
      type: String,
      enum: ["Invoice", "Bill"],
      required: true,
    },

    // 🚀 DYNAMIC BILLING: Document classification driving GST & Inventory logic
    // Required functionally but defaulted to Retail ensuring legacy records don't crash
    documentType: {
      type: String,
      enum: ["Retail", "B2B", "Service", "Export"],
      default: "Retail"
    },

    voucherNo: {
      type: String,
      required: true,
      index: true,
    },

    date: { type: Date, required: true },

    /* ---------------- SELLER SNAPSHOT ---------------- */
    company: {
      name: String,
      gstin: String,
      state: String,
      address: String,
      logoUrl: String,
    },

    /* ---------------- PARTY ---------------- */
    party: {
      type: {
        type: String,
        enum: ["Customer", "Supplier"],
        required: true,
      },

      category: {
        type: String,
        enum: ["Individual", "Company"],
        required: true,
      },

      name: { type: String, required: true },
      taxId: String,
      address: String,
      state: String,
      paymentTerms: String,
    },

    /* ---------------- ITEM (single item for now) ---------------- */
    // Note: Legacy integration field strictly retained.
    item: {
      name: String,
      unit: String,
      quantity: Number,
      rate: Number,
      amount: Number,
      gstRate: Number,
    },

    // 🚀 SCALABLE ITEMS ARRAY: Supports multi-product invoices implicitly without breaking `item` logic
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Products" },
        name: String,
        unit: String,
        quantity: Number,
        rate: Number,
        amount: Number,
        gstRate: Number,
        hsnSac: String,
        batchNumber: String,
        locationId: { type: Schema.Types.ObjectId, ref: "Location" },
        isService: { type: Boolean, default: false }
      }
    ],

    // 🚀 ACCOUNTING INTEGRATION: Strict linkage to double-entry financial truth limits
    // Note: Document ceases to be financial truth; it is merely a business representation mapped mathematically here
    journalEntryId: {
      type: Schema.Types.ObjectId,
      ref: "JournalEntry",
    },

    // 🚀 INVENTORY INTEGRATION: Directly overrides StockLayer FIFO decay safely via parameter
    inventoryImpact: {
      type: Boolean,
      default: true
    },

    // Tracks exactly which granular stock batches were depleted for this legal document natively
    stockImpact: [
      {
        stockLayerId: { type: Schema.Types.ObjectId, ref: "StockLayer", required: true },
        qty: { type: Number, required: true }
      }
    ],

    subtotal: Number,

    tax: { type: Number, default: 0 },

    taxBreakup: {
      type: {
        type: String, // NONE | IGST | CGST_SGST
      },
      cgst: {
        rate: Number,
        amount: Number,
      },
      sgst: {
        rate: Number,
        amount: Number,
      },
      igst: {
        rate: Number,
        amount: Number,
      },
    },

    // 🚀 GST INTELLIGENCE UPGRADE: Modern compliant JSON replacing legacy flat arrays securely
    taxDetails: {
      type: { type: String, default: 'NONE' }, // 'NONE' | 'IGST' | 'CGST_SGST'
      cgst: { rate: { type: Number, default: 0 }, amount: { type: Number, default: 0 } },
      sgst: { rate: { type: Number, default: 0 }, amount: { type: Number, default: 0 } },
      igst: { rate: { type: Number, default: 0 }, amount: { type: Number, default: 0 } },
      totalTax: { type: Number, default: 0 }
    },

    placeOfSupply: String,
    isInterState: { type: Boolean, default: false },

    // 🚀 DYNAMIC PROCUREMENT METADATA
    charges: {
      freight: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      discountType: { type: String, enum: ["%", "₹", null], default: null }
    },

    reverseCharge: { type: Boolean, default: false },

    currencyDetails: {
      code: { type: String, default: "INR" },
      exchangeRate: { type: Number, default: 1 }
    },

    // 🚀 EXPORT BILLING ROUTING
    exportDetails: {
      isExport: { type: Boolean, default: false },
      exportType: { type: String, enum: ["with_tax", "without_tax", null], default: null },
      country: String,
      currency: String
    },

    // 🚀 E-INVOICE COMPLIANCE (B2B RESTRICTED)
    einvoice: {
      irn: String,
      ackNo: String,
      ackDate: Date,
      qrCode: String,
      status: { type: String, enum: ["pending", "generated", "failed", null], default: null }
    },

    // 🚀 STATUS & PAYMENT LIFECYCLE
    status: { type: String, enum: ["draft", "finalized", "cancelled"], default: "finalized" },
    paymentStatus: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" },
    syncState: { type: String, enum: ["synced", "pending", "conflict"], default: "synced" },

    total: Number,

    sourceVoucher: {
      type: String,
      enum: ["Sale", "Purchase", "Expense", "TaxPayment", "StockWriteOff"],
      required: true,
    },
  },
  { timestamps: true }
);

DocumentSchema.index({ email: 1, voucherNo: 1 });

// 🚀 DYNAMIC BILLING INDEX STRATEGY
DocumentSchema.index({ documentType: 1, date: -1 });
DocumentSchema.index({ "items.productId": 1 });

/* ========================================================= */
/* 🚀 ERP BILLING ENGINE: STRICT COMPLIANCE & VALIDATION     */
/* ========================================================= */

// 1. Pre-Validate: Enforce Data Integrity & Arithmetic Truth
DocumentSchema.pre("validate", function () {
  const doc = this as any;

  // 🔹 Derived Inventory Impact
  if (doc.documentType === "Service") {
    doc.inventoryImpact = false;
  } else {
    doc.inventoryImpact = true;
  }

  // 🔹 B2B GSTIN Compliance
  if (doc.documentType === "B2B") {
    if (!doc.party || !doc.party.taxId) {
      throw new Error(`GSTIN_REQUIRED: Document type 'B2B' requires party.taxId (GSTIN).`);
    }
  }

  // 🔹 Export Compliance
  if (doc.documentType === "Export") {
    if (!doc.exportDetails) doc.exportDetails = { isExport: true };
    doc.exportDetails.isExport = true;
  }

  // 🔹 E-Invoice Rules
  if (doc.einvoice && doc.einvoice.status && doc.einvoice.status !== "failed" && doc.einvoice.status !== "cancelled") {
    if (doc.documentType !== "B2B") {
      throw new Error(`EINVOICE_INVALID: E-Invoice generation is strictly restricted to B2B documents.`);
    }
    if (!doc.party || !doc.party.taxId) {
      throw new Error(`EINVOICE_INVALID: E-Invoice requires a valid party GSTIN.`);
    }
  }

  // 🔹 Finalization Rules (Double-Entry Gateway)
  if (doc.status === "finalized") {
    if (!doc.journalEntryId) {
      throw new Error(`ACCOUNTING_VIOLATION: Document MUST NOT be finalized without a valid mapped journalEntryId.`);
    }
  }

  // 🔹 Dynamic Math: Compute Totals exclusively from scalable `items[]` matrix
  if (doc.items && doc.items.length > 0) {
    let computedSubtotal = 0;
    for (const line of doc.items) {
      computedSubtotal += (line.quantity || 0) * (line.rate || 0);
    }
    doc.subtotal = computedSubtotal;
    // Note: taxDetails mapping acts as the single source of truth; legacy taxBreakup is deprecated read-only logic.
    const taxTotal = doc.taxDetails?.totalTax || 0;
    doc.tax = taxTotal;
    doc.total = computedSubtotal + taxTotal;
  }
});

// 2. Pre-Save: Enforce Strict Immutability (CA-Grade Audit Lock)
DocumentSchema.pre("save", async function () {
  const doc = this as any;
  if (!doc.isNew) {
    // Locate historical DB reference bypassing memory modification
    const modelClass = doc.constructor as any;
    const originalDoc = await modelClass.findById(doc._id).lean();
    if (originalDoc && originalDoc.status === "finalized") {
      // Document MUST be immutable after "finalized". Changes only via cancellation/reversal.
      if (doc.isModified() && doc.status !== "cancelled" && !doc.isModified("paymentStatus") && !doc.isModified("einvoice.status")) {
        throw new Error("IMMUTABILITY_LOCKED: Finalized documents cannot be physically altered. Issuance of a cancellation/reversal voucher is strictly required.");
      }
    }
  }
});


if (models.Document) {
  delete models.Document;
}

export const Document =
  models.Document || model("Document", DocumentSchema);
