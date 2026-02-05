// models/CompanyProfileModel.ts
import { Schema, model, models } from "mongoose";

const CompanyProfileSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    logoUrl: String,

    address: String,
    city: String,
    state: String,
    pincode: String,

    gstin: String, // optional
    phone: String,
  },
  { timestamps: true }
);

export const CompanyProfile =
  models.CompanyProfile ||
  model("CompanyProfile", CompanyProfileSchema);
