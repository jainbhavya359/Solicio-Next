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
