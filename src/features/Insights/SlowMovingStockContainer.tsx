"use client";

import { useState } from "react";
import SlowMovingStockView, {
  SlowMovingItem,
} from "./SlowMovingStockView";

export default function SlowMovingStockContainer({
  data,
}: {
  data: {
    slowMoving: SlowMovingItem[];
    slowMovingCount: number;
    slowStockValue: number;
  } | null;
}) {
  const [open, setOpen] = useState(false);

  if (!data) return null;

  return (
    <SlowMovingStockView
      slowMoving={data.slowMoving}
      slowMovingCount={data.slowMovingCount}
      slowStockValue={data.slowStockValue}
      open={open}
      onToggle={() => setOpen(v => !v)}
    />
  );
}


