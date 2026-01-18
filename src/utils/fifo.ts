import { Types } from "mongoose";

export interface FIFOLayer {
  _id: Types.ObjectId;
  qtyRemaining: number;
  rate: number;
}

export interface FIFOUpdate {
  updateOne: {
    filter: { _id: Types.ObjectId };
    update: { $inc: { qtyRemaining: number } };
  };
}

export interface FIFOBreakup {
  layerId: Types.ObjectId;
  qty: number;
  rate: number;
}

interface FIFOResult {
  cogs: number;
  updates: FIFOUpdate[];
  breakup: FIFOBreakup[];
}

/**
 * Pure FIFO costing calculation.
 * No DB writes. No side effects.
 */
export function calculateFIFO(
  layers: FIFOLayer[],
  quantity: number
): FIFOResult {
  let remaining = quantity;
  let cogs = 0;

  const updates: FIFOUpdate[] = [];
  const breakup: FIFOBreakup[] = [];

  for (const layer of layers) {
    if (remaining <= 0) break;

    const available = layer.qtyRemaining;
    if (available <= 0) continue;

    const consume = Math.min(available, remaining);

    breakup.push({
      layerId: layer._id,
      qty: consume,
      rate: layer.rate,
    });

    updates.push({
      updateOne: {
        filter: { _id: layer._id },
        update: { $inc: { qtyRemaining: -consume } },
      },
    });

    cogs += consume * layer.rate;
    remaining -= consume;
  }

  if (remaining > 0) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  return { cogs, updates, breakup };
}
