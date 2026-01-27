"use client";

import axios from "axios";
import { useEffect, useState } from "react";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function useDashboardKPIs(email?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const now = new Date();
    const w1Start = new Date();
    w1Start.setDate(now.getDate() - 7);

    const w2Start = new Date();
    w2Start.setDate(now.getDate() - 14);

    const fetchAll = async () => {
      setLoading(true);

      const [
        salesNow,
        salesPrev,
        pnlNow,
        pnlPrev,
        inventoryNow,
      ] = await Promise.all([
        axios.get("/api/insights/sales-trend", {
          params: { email, days: 7 },
        }),
        axios.get("/api/insights/sales-trend", {
          params: { email, days: 14 },
        }),
        axios.get("/api/profit-loss", {
          params: { email, from: iso(w1Start), to: iso(now) },
        }),
        axios.get("/api/profit-loss", {
          params: { email, from: iso(w2Start), to: iso(w1Start) },
        }),
        axios.get("/api/totalStock", {
          params: { email },
        }),
      ]);

      const currentSales = salesNow.data.summary.totalSales;
      const prevSales =
        salesPrev.data.summary.totalSales - currentSales;

      const currentProfit = pnlNow.data.summary.netProfit;
      const prevProfit = pnlPrev.data.summary.netProfit;

      const currentOrders = salesNow.data.timeline.filter(
        (d: any) => d.sales > 0
      ).length;

      const prevOrders =
        salesPrev.data.timeline.filter((d: any) => d.sales > 0).length -
        currentOrders;

      setData({
        revenue: {
          value: currentSales,
          pct: percentChange(currentSales, prevSales),
        },
        profit: {
          value: currentProfit,
          pct: percentChange(currentProfit, prevProfit),
        },
        inventory: {
          value: inventoryNow.data.summary.totalQuantity,
          pct: inventoryNow.data.summary.slowStockPct * -1, // inverse signal
        },
        orders: {
          value: currentOrders,
          pct: percentChange(currentOrders, prevOrders),
        },
      });

      setLoading(false);
    };

    fetchAll();
  }, [email]);

  return { data, loading };
}

export function percentChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}