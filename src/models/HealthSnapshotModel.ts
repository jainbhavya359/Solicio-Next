import mongoose, { Schema } from "mongoose";

const HealthSnapshotSchema = new Schema(
  {
    email: { type: String, index: true },
    dateKey: { type: String, index: true },

    healthScore: Number,
    previousHealthScore: {
      type: Number,
      default: null,
    },

    status: String,

    breakdown: {
      stockMovementScore: Number,
      salesTrendScore: Number,
      inventoryBalanceScore: Number,
      activityRecencyScore: Number,
    },

    alerts: [
      {
        type: String,
        message: String,
        suggestion: String,
      },
    ],
  },
  { timestamps: true }
);


HealthSnapshotSchema.index(
  { email: 1, dateKey: 1 },
  { unique: true }
);

export const HealthSnapshot =
  mongoose.models.HealthSnapshot ||
  mongoose.model("HealthSnapshot", HealthSnapshotSchema);
