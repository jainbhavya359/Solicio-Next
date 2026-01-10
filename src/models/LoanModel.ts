import { Schema, model, models } from "mongoose";

const Loans = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    loan: {
        type: String,
        required: true
    },
    lender: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    pan_number: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    tenure: {
        type: String,
        required: true,
    }
});

const Loan = models.loans || model("loans", Loans);

export default Loan;