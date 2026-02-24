import { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema(
  {
    email: { type: String, required: true },

    type: {
      type: String,
      enum: ["Invoice", "Bill"],
      required: true,
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
    item: {
      name: String,
      unit: String,
      quantity: Number,
      rate: Number,
      amount: Number,
      gstRate: Number,
    },

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

if (process.env.NODE_ENV !== "production") {
  delete models.Document;
}

export const Document =
  models.Document || model("Document", DocumentSchema);
