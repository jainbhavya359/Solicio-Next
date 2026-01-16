import { Schema, model, models } from "mongoose";

const AccountingPeriodSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    // Example: 2026-01
    period: {
      type: String,
      required: true,
      index: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isClosed: {
      type: Boolean,
      default: false,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    closedBy: {
      type: String, // user email / admin
      default: null,
    },
  },
  { timestamps: true }
);

export const AccountingPeriod =
  models.accountingPeriod ||
  model("accountingPeriod", AccountingPeriodSchema);
