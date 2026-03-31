import { Schema, model, models, Types } from "mongoose";

const AuditLogSchema = new Schema(
  {
    email: { type: String, required: true, index: true, immutable: true },

    collectionName: { type: String, required: true, index: true, immutable: true }, // e.g., "Document", "JournalEntry", "Payment"
    documentId: { type: Types.ObjectId, required: true, index: true, immutable: true },
    
    action: { 
      type: String, 
      enum: ["CREATE", "UPDATE", "DELETE", "CANCEL", "REVERSE", "FINALIZE"], 
      required: true, 
      immutable: true 
    },
    
    priorState: { type: Schema.Types.Mixed, default: null, immutable: true },
    newState: { type: Schema.Types.Mixed, required: true, immutable: true },
    
    // Mandatory forensic routing tracking explicitly the absolute token initiating the data limits
    actorId: { type: Types.ObjectId, ref: "User", required: true, immutable: true }, 
    sourceIp: { type: String, default: null, immutable: true },
    userAgent: { type: String, default: null, immutable: true },

  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);
