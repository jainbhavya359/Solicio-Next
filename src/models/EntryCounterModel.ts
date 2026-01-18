import { Schema, model, models } from "mongoose";

const EntryCounterSchema = new Schema(
  {
    email: { type: String, required: true },

    series: {
      type: String,
      required: true, // PUR / SAL / REV / GEN
    },

    dateKey: {
      type: String,
      required: true, // YYYYMMDD
    },

    seq: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* -------------------- INDEXES -------------------- */

/**
 * Atomic voucher generation
 */
EntryCounterSchema.index(
  { email: 1, series: 1, dateKey: 1 },
  { unique: true }
);

export const EntryCounter =
  models.EntryCounter || model("EntryCounter", EntryCounterSchema);
