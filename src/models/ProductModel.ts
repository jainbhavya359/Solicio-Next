import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
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
    }
});

export const Products = models.product || model("product", ProductSchema);
