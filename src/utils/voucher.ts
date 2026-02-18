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

  // ⚡ Remove session to ensure atomic increment is committed immediately
  // This prevents transaction isolation from causing duplicate numbers
  const counter = await EntryCounter.findOneAndUpdate(
    { email, series, dateKey },
    { $inc: { seq: 1 } },
    { upsert: true, new: true } // Removed session here
  );

  return `${series}-${dateKey}-${String(counter.seq).padStart(3, "0")}`;
}
