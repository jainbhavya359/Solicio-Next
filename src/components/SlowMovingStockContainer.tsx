"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import SlowMovingStockView, {
  SlowMovingItem,
} from "./SlowMovingStockView";

export default function SlowMovingStockContainer() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [open, setOpen] = useState(false);
  const [slowMoving, setSlowMoving] = useState<SlowMovingItem[]>([]);
  const [slowMovingCount, setSlowMovingCount] = useState(0);

  useEffect(() => {
    if (!email) return;

    axios
      .get("/api/health/stock-movement", { params: { email } })
      .then(res => {
        setSlowMoving(res.data?.slowMoving ?? []);
        setSlowMovingCount(res.data?.slowMovingCount ?? 0);
      })
      .catch(() => {
        setSlowMoving([]);
        setSlowMovingCount(0);
      });
  }, [email]);

  return (
    <SlowMovingStockView
      slowMoving={slowMoving}
      slowMovingCount={slowMovingCount}
      open={open}
      onToggle={() => setOpen(v => !v)}
    />
  );
}
