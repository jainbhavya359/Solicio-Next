import { Schema, model, models } from "mongoose";

const LicenseSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    // Core identity
    licenseName: {
      type: String,
      required: true, // e.g. GST Registration
    },

    licenseCategory: {
      type: String,
      enum: [
        "Tax",
        "Business",
        "Labor",
        "Environmental",
        "Financial",
        "Other",
      ],
      default: "Business",
    },

    issuingAuthority: {
      type: String,
      required: true, // e.g. Ministry of MSME
    },

    licenseNumber: {
      type: String, // optional but useful
    },

    // Validity
    issueDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },

    renewalRequired: {
      type: Boolean,
      default: true,
    },

    renewalFrequency: {
      type: String,
      enum: ["monthly", "yearly", "one-time"],
      default: "yearly",
    },

    // Compliance tracking
    status: {
      type: String,
      enum: ["active", "expired", "suspended"],
      default: "active",
      index: true,
    },

    gracePeriodDays: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
    },

    documentUrl: {
      type: String, // future: upload PDF
    },
  },
  { timestamps: true }
);

// Useful compound index
LicenseSchema.index({ email: 1, status: 1 });

export default models.License ||
  model("License", LicenseSchema);
