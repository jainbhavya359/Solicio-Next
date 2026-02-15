import axios from "axios";

export async function fetchInventorySnapshot(email: string) {
  const [inventory, lowStock, stockHistory] = await Promise.all([
    axios.get("/api/inventory", { params: { email } }),
    axios.get("/api/low-stock", { params: { email } }),
    axios.get("/api/stock", { params: { email } }),
  ]);

  return {
    inventory: inventory.data,
    lowStock: lowStock.data,
    stockHistory: stockHistory.data,
  };
}
