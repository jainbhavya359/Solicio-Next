import { Schema, model, models } from "mongoose";

const EntryCounterSchema = new Schema({
  email: { type: String, required: true },
  series: { type: String, required: true }, // ✅ ONLY discriminator
  dateKey: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

EntryCounterSchema.index(
  { email: 1, series: 1, dateKey: 1 },
  { unique: true }
);

export const EntryCounter =
  models.entrycounter || model("entrycounter", EntryCounterSchema);


// import { Schema, model, models } from "mongoose";

// const EntryCounterSchema = new Schema({
//   email: { type: String, required: true },
//   voucher: { type: String, required: true }, 
//   dateKey: { type: String, required: true }, 
//   seq: { type: Number, default: 0 },
// });

// export const EntryCounter =
//   models.entrycounter || model("entrycounter", EntryCounterSchema);
