import { Schema, model, models } from "mongoose";

const LoanSchema = new Schema(
  {
    email: { type: String, required: true, index: true },

    loanType: { type: String, required: true },
    lender: { type: String, required: true },

    principalAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },

    interestType: {
      type: String,
      enum: ["Fixed", "Floating"],
      default: "Fixed",
    },

    tenure: { type: Number, required: true },
    tenureUnit: {
      type: String,
      enum: ["months", "years"],
      default: "months",
    },

    repaymentFrequency: {
      type: String,
      enum: ["monthly", "weekly", "quarterly"],
      default: "monthly",
    },

    emiAmount: { type: Number, required: true },
    totalPayable: { type: Number, required: true },
    totalInterest: { type: Number, required: true },

    loanStartDate: { type: Date, required: true },
    firstEmIDate: { type: Date, required: true },

    nextDueDate: { type: Date, index: true },
    lastPaidAt: { type: Date }, // 🔔 future payments

    gracePeriodDays: { type: Number, default: 5 },
    lateFeePerDay: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "closed", "overdue"],
      default: "active",
      index: true,
    },

    panNumber: String,
    remarks: String,
  },
  { timestamps: true }
);

LoanSchema.index({ email: 1, status: 1 });

export default models.Loan || model("Loan", LoanSchema);
