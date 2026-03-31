import { AccountingPeriod } from "@/src/models/AccountingPeriodModel";

export async function isPeriodLocked(email: string, date: Date) {
  const periodKey = date.toISOString().slice(0, 7); // YYYY-MM

  const period = await AccountingPeriod.findOne({
    email,
    period: periodKey,
    isClosed: true,
  });

  return Boolean(period);
}

/**
 * Resolves a core system account for a tenant.
 * Finds or creates (Upsert) the account to ensure a consistent ID exists for routing.
 * Accounts mapping:
 * - Purchases -> Expense
 * - Freight Inward -> Expense
 * - Input CGST/SGST/IGST -> Asset (gstType: input)
 * - Output GST (RCM) -> Liability (gstType: output)
 * - Cash/Bank -> Asset
 */
export async function resolveSystemAccount({
  email,
  name,
  code,
  type,
  gstType = null,
  session,
}: {
  email: string;
  name: string;
  code: string;
  type: "Asset" | "Liability" | "Income" | "Expense" | "Equity";
  gstType?: "input" | "output" | null;
  session?: any;
}) {
  const { Account } = require("@/src/models/AccountModel");

  const account = await Account.findOneAndUpdate(
    { email, code, isSystemAccount: true },
    {
      $setOnInsert: {
        email,
        name,
        code,
        type,
        gstType,
        path: `/${type}/${name}`, // Materialized path root for system accounts
        isSystemAccount: true,
        isActive: true,
      },
    },
    { upsert: true, session, returnDocument: "after" }
  );

  return account._id;
}