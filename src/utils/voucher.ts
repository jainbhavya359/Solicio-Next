import { EntryCounter } from "@/src/models/EntryCounterModel";

export async function generateVoucherNo({
  email,
  series,
  date,
  session,
}: {
  email: string;
  series: string;
  date: Date;
  session?: any;
}) {
  const dateKey = date.toISOString().slice(0, 10).replace(/-/g, "");

  const counter = await EntryCounter.findOneAndUpdate(
    { email, series, dateKey },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, session }
  );

  return `${series}-${dateKey}-${String(counter.seq).padStart(3, "0")}`;
}
