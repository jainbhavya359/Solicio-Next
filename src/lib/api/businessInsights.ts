import axios from "axios";

export async function fetchBusinessInsights(email: string) {
  const [lowStock, cashFlow, slowMoving, stockReport] =
    await Promise.all([
      axios.get("/api/low-stock", { params: { email } }),
      axios.get("/api/cash-flow", { params: { email } }),
      axios.get("/api/health/stock-movement", { params: { email } }),
      axios.get("/api/inventory", { params: { email } }),
    ]);

  return {
    lowStock: lowStock.data,
    cashFlow: cashFlow.data,
    slowMoving: slowMoving.data,
    stockReport: stockReport.data,
  };
}
