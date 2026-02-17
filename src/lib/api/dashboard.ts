import axios from "axios";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function percentChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export async function fetchDashboardData(email: string, from?: string, to?: string) {
  const now = new Date();

  // If dates are provided, use them; otherwise default to last 7 days
  const startDate = from ? new Date(from) : new Date();
  if (!from) startDate.setDate(now.getDate() - 7);

  const endDate = to ? new Date(to) : now;

  // For comparison periods (previous 7/14 days logic, or double the range)
  const rangeMs = endDate.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - rangeMs);
  const prevEndDate = new Date(startDate);

  const [
    loans,
    salesCurrent,
    salesPrevious,
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
      params: { email, from: iso(startDate), to: iso(endDate) },
    }),
    axios.get("/api/insights/sales-trend", {
      params: { email, from: iso(prevStartDate), to: iso(prevEndDate) },
    }),
    axios.get("/api/profit-loss", {
      params: { email, from: iso(startDate), to: iso(endDate) },
    }),
    axios.get("/api/profit-loss", {
      params: { email, from: iso(prevStartDate), to: iso(prevEndDate) },
    }),
    axios.get("/api/totalStock", { params: { email } }),
    axios.get("/api/cash-flow", { params: { email } }),
    axios.get("/api/health/summary", { params: { email } }),
    axios.get("/api/low-stock", { params: { email } }),
    axios.get("/api/health/stock-movement", { params: { email } }),
  ]);

  /* ---------------- KPI CALCULATIONS ---------------- */

  const currentSales = salesCurrent.data.summary.totalSales;
  const prevSales = salesPrevious.data.summary.totalSales;

  const currentProfit = profitNow.data.summary.netProfit;
  const prevProfit = profitPrev.data.summary.netProfit;

  const currentOrders = salesCurrent.data.timeline.filter(
    (d: any) => d.sales > 0
  ).length;

  const prevOrders = salesPrevious.data.timeline.filter(
    (d: any) => d.sales > 0
  ).length;

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
    salesTrend7: salesCurrent.data, // Keeping key names for compatibility
    salesTrend14: salesPrevious.data,
    kpis,
    cashFlow: cashFlow.data,
    healthSummary: healthSummary.data,
    lowStock: lowStock.data,
    slowMoving: slowMoving.data,
    inventory: inventoryNow.data,
  };
}
