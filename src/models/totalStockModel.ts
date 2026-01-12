import { Schema, models, model } from "mongoose";

const currStock = new Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    unit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    email: {
        type: String,
        required: true,
    }
});

export const TotalStock = models.totalStock || model("totalStock", currStock);