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
        costingMethod: {
            type: String,
            enum: ["FIFO", "WAVG"],
            default: "FIFO",
        },
        // reorderLevel: {
        //     type: Number,
        //     default: 5,
        // }

    },
    { timestamps: true }
);

ProductSchema.index(
  { email: 1, name: 1 },
  { unique: true }
);


export const Products = models.product || model("product", ProductSchema);
