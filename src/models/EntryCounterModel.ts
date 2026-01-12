import { Schema, model, models } from "mongoose";

const EntryCounterSchema = new Schema({
  email: { type: String, required: true },
  voucher: { type: String, required: true }, 
  dateKey: { type: String, required: true }, 
  seq: { type: Number, default: 0 },
});

export const EntryCounter =
  models.entrycounter || model("entrycounter", EntryCounterSchema);
