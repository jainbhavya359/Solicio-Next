"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export type StockMovementResponse = {
  stockMovementScore: number;
  productCount: number;

  breakdown: {
    product: string;
    unit: string;
    daysSinceLastSale: number | null;
    score: number;
  }[];

  slowMovingCount: number;
  slowMoving: {
    product: string;
    unit: string;
    quantity: number;
    lastMovedAt: string | null;
    daysSinceMovement: number | null;
  }[];
};

export function useStockMovement(email?: string) {
  const [data, setData] = useState<StockMovementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    const fetchMovement = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/stock-movement", {
          params: { email },
        });
        setData(res.data);
      } catch {
        setError("Failed to load stock movement data");
      } finally {
        setLoading(false);
      }
    };

    fetchMovement();
  }, [email]);

  return { data, loading, error };
}
