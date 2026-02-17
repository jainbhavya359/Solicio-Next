import axios from "axios";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function percentChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export async function fetchDashboardData(email: string) {
  const now = new Date();

  const w1Start = new Date();
  w1Start.setDate(now.getDate() - 7);

  const w2Start = new Date();
  w2Start.setDate(now.getDate() - 14);

  const [
    loans,
    sales7,
    sales14,
    profitNow,
    profitPrev,
    inventoryNow,
    cashFlow,
    healthSummary,
    lowStock,
    slowMoving,
  ] = await Promise.all([
    axios.get("/api/loans", { params: { email } }),
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
    axios.get("/api/totalStock", { params: { email } }),
    axios.get("/api/cash-flow", { params: { email } }),
    axios.get("/api/health/summary", { params: { email } }),
    axios.get("/api/low-stock", { params: { email } }),
    axios.get("/api/health/stock-movement", { params: { email } }),
  ]);

  /* ---------------- KPI CALCULATIONS ---------------- */

  const currentSales = sales7.data.summary.totalSales;
  const prevSales =
    sales14.data.summary.totalSales - currentSales;

  const currentProfit = profitNow.data.summary.netProfit;
  const prevProfit = profitPrev.data.summary.netProfit;

  const currentOrders = sales7.data.timeline.filter(
    (d: any) => d.sales > 0
  ).length;

  const prevOrders =
    sales14.data.timeline.filter((d: any) => d.sales > 0).length -
    currentOrders;

  const kpis = {
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
      pct: inventoryNow.data.summary.slowStockPct * -1,
    },
    orders: {
      value: currentOrders,
      pct: percentChange(currentOrders, prevOrders),
    },
  };

  return {
    loans: loans.data,
    salesTrend7: sales7.data,
    salesTrend14: sales14.data,
    kpis,
    cashFlow: cashFlow.data,
    healthSummary: healthSummary.data,
    lowStock: lowStock.data,
    slowMoving: slowMoving.data,
    inventory: inventoryNow.data,
  };
}
