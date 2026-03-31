import { Schema, model, models } from "mongoose";

const IdempotencyKeySchema = new Schema(
  {
    email: { type: String, required: true, index: true, immutable: true },

    // The strict UUID or Hash passed securely by POS clients/SDKs ensuring explicit request mapping
    key: { type: String, required: true, unique: true, immutable: true }, 
    
    operationType: { type: String, required: true, immutable: true }, // e.g., "CREATE_DOCUMENT", "RECEIVE_PAYMENT"
    
    requestPayload: { type: Schema.Types.Mixed, required: true, immutable: true }, // Forensic tracking explicitly saving original network parameters
    responsePayload: { type: Schema.Types.Mixed, required: true, immutable: true }, // The exact JSON generated securely returning to the client
    
    statusCode: { type: Number, required: true, immutable: true },
    
    // TTL index dropping native eviction limits avoiding bloated networks (e.g., automatically drops after 24-72 hours)
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, 

  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const IdempotencyKey = models.IdempotencyKey || model("IdempotencyKey", IdempotencyKeySchema);
