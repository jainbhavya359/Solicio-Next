import { Schema, model, models } from "mongoose";

const TelemetrySchema = new Schema(
  {
    level: {
      type: String,
      enum: ["trace", "debug", "info", "warn", "error", "fatal"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      default: "solicio-erp",
    },
    trace_id: {
      type: String,
      default: null,
    },
    user_id: {
      type: String,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// TTL Index: expireAfterSeconds 604800 is 7 days
TelemetrySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });
// Index on trace_id for fast lookup
TelemetrySchema.index({ trace_id: 1 });

const TelemetryModel = models.Telemetry || model("Telemetry", TelemetrySchema);

export default TelemetryModel;
