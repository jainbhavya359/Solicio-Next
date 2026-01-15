import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 0,
        },
        purchasePrice: {
            type: Number,
            default: 0
        },
        sellingPrice: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

export const Products = models.product || model("product", ProductSchema);
