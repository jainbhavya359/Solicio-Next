"use client";

import { Package, Plus, Minus } from "lucide-react";

// 1. Define the shape of a single Stock item
interface StockItem {
  product: string;
  unit: string;
  price: number;
  quantity: number;
  stockValue: number;
  daysSinceLastSale: number | null;
  category: "fast" | "warning" | "slow" | "dead" | "never-sold";
}

// 2. Define the Props for the component
interface StockReportProps {
  data: {
    summary?: {
      totalStockValue: number;
      productCount: number;
      totalQuantity: number;
      slowStockPct: number;
    };
    breakdown?: StockItem[];
  };
  visible: boolean;
  productSetter: (product: any) => void;
  purchaseSetter: (val: boolean) => void;
  saleSetter: (val: boolean) => void;
  reloadKey?: number;
}

export default function StockReport({
  data,
  visible,
  productSetter,
  purchaseSetter,
  saleSetter,
}: StockReportProps) {
  
  const summary = data?.summary;
  const items: StockItem[] = data?.breakdown || []; // 3. Apply the type here
  const loading = !data;

  if (!visible) return null;

  const adjustQty = (stock: StockItem, delta: number) => {
    const product = {
      name: stock.product,
      unit: stock.unit,
      price: stock.price,
      quantity: stock.quantity,
    };

    productSetter(product);

    if (delta > 0) {
      purchaseSetter(true);
      saleSetter(false);
    } else {
      purchaseSetter(false);
      saleSetter(true);
    }
  };

  const statusMap: Record<string, string> = {
    fast: "fast",
    warning: "warning",
    slow: "slow",
    dead: "dead",
    "never-sold": "never sold",
  };

  return (
    <section className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-semibold text-slate-900">Inventory</h2>
        <p className="text-slate-500 mt-1">Real-time stock health & capital exposure</p>
      </div>

      {/* KPI STRIP */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Kpi label="Total Value" value={`₹${summary.totalStockValue.toLocaleString()}`} positive />
          <Kpi label="Products" value={summary.productCount} />
          <Kpi label="Total Units" value={summary.totalQuantity} />
          <Kpi label="At Risk" value={`${summary.slowStockPct}%`} danger />
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">In Stock</th>
              <th className="px-6 py-4 font-medium">Unit Price</th>
              <th className="px-6 py-4 font-medium">Stock Value</th>
              <th className="px-6 py-4 font-medium">Days Since Sale</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="w-10 h-10 mx-auto border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                </td>
              </tr>
            ) : (
              items.map((stock) => (
                <tr key={`${stock.product}-${stock.unit}`} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Package size={18} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 capitalize">{stock.product}</p>
                        <p className="text-xs text-slate-500">{stock.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-lg font-semibold text-emerald-600">{stock.quantity}</td>
                  <td className="px-6 py-5">₹{stock.price}</td>
                  <td className="px-6 py-5 font-semibold text-emerald-600">₹{stock.stockValue.toLocaleString()}</td>
                  <td className="px-6 py-5"><DaysLeft days={stock.daysSinceLastSale} /></td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs ${
                        stock.category === "fast" ? "bg-emerald-100 text-emerald-700" : 
                        stock.category === "warning" ? "bg-amber-100 text-amber-700" : 
                        "bg-rose-100 text-rose-700"
                    }`}>
                      {statusMap[stock.category] || stock.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <ActionButton onClick={() => adjustQty(stock, -1)}><Minus size={14} /></ActionButton>
                      <ActionButton onClick={() => adjustQty(stock, 1)} primary><Plus size={14} /></ActionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Ensure sub-components are also typed to avoid more errors
function Kpi({ label, value, positive, danger }: { label: string; value: string | number; positive?: boolean; danger?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 bg-white ${positive ? "border-emerald-300 bg-emerald-50" : danger ? "border-rose-300 bg-rose-50" : "border-slate-200"}`}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${positive ? "text-emerald-700" : danger ? "text-rose-600" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

function ActionButton({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} className={`h-9 w-9 rounded-md flex items-center justify-center transition ${primary ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 hover:bg-slate-300"}`}>
      {children}
    </button>
  );
}

function DaysLeft({ days }: { days: number | null }) {
  if (days == null) return <span className="text-xs text-slate-400">No data</span>;
  return <div className="w-28 text-xs text-slate-500">{days}d</div>;
}
