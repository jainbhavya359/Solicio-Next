import {Schema, model, models} from "mongoose";

export const StockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: "pcs",
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    email: {
        type: String,
        required: true,
    }
});

const Stock = models.stock || model("stock", StockSchema);

export default Stock;