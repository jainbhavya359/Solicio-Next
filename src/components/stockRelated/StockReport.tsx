"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Package, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";

export default function StockReport({
  visible,
  productSetter,
  purchaseSetter,
  saleSetter,
  reload,
}: any) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  if (!visible) return null;

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/inventory", {
          params: { email },
        });

        setSummary(res.data.summary);
        setItems(res.data.breakdown || []);
      } catch {
        toast.error("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, reload]);

  /* ✅ FIXED: correct product shape + direction */
  const adjustQty = (stock: any, delta: number) => {
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

  const statusMap: any = {
    fast: "fast",
    warming: "warning",
    slow: "slow",
    dead: "dead",
    "never-sold": "never sold",
  };

  return (
    <section className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-semibold text-slate-900">
          Inventory
        </h2>
        <p className="text-slate-500 mt-1">
          Real-time stock health & capital exposure
        </p>
      </div>

      {/* KPI STRIP */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Kpi
            label="Total Value"
            value={`₹${summary.totalStockValue.toLocaleString()}`}
            positive
          />
          <Kpi label="Products" value={summary.productCount} />
          <Kpi label="Total Units" value={summary.totalQuantity} />
          <Kpi
            label="At Risk"
            value={`${summary.slowStockPct}%`}
            danger
          />
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
              <th className="px-6 py-4 font-medium text-right">
                Actions
              </th>
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
                <tr
                  key={`${stock.product}-${stock.unit}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  {/* PRODUCT */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Package
                          size={18}
                          className="text-emerald-600"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 capitalize">
                          {stock.product}
                        </p>
                        <p className="text-xs text-slate-500">
                          {stock.unit}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* STOCK */}
                  <td className="px-6 py-5 text-lg font-semibold text-emerald-600">
                    {stock.quantity}
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-5">
                    ₹{stock.price}
                  </td>

                  {/* VALUE */}
                  <td className="px-6 py-5 font-semibold text-emerald-600">
                    ₹{stock.stockValue.toLocaleString()}
                  </td>

                  {/* DAYS LEFT (derived correctly) */}
                  <td className="px-6 py-5">
                    <DaysLeft days={stock.daysSinceLastSale} />
                  </td>

                  {/* STATUS (correct) */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs
                        ${
                          stock.category === "fast"
                            ? "bg-emerald-100 text-emerald-700"
                            : stock.category === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                    >
                      {statusMap[stock.category]}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        onClick={() => adjustQty(stock, -1)}
                      >
                        <Minus size={14} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => adjustQty(stock, 1)}
                        primary
                      >
                        <Plus size={14} />
                      </ActionButton>
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

/* ================= SUB COMPONENTS ================= */

function Kpi({ label, value, positive, danger }: any) {
  return (
    <div
      className={`rounded-xl border p-5 bg-white ${
        positive
          ? "border-emerald-300 bg-emerald-50"
          : danger
          ? "border-rose-300 bg-rose-50"
          : "border-slate-200"
      }`}
    >
      <p className="text-sm text-slate-600">{label}</p>
      <p
        className={`mt-2 text-3xl font-semibold ${
          positive
            ? "text-emerald-700"
            : danger
            ? "text-rose-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DaysLeft({ days }: { days: number | null }) {
  if (days == null) {
    return <span className="text-xs text-slate-400">No data</span>;
  }

  let color = "bg-emerald-500";
  if (days > 30) color = "bg-rose-500";
  else if (days > 14) color = "bg-amber-400";

  const pct = Math.min(100, (days / 30) * 100);

  return (
    <div className="w-28">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{days}d</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  primary,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`h-9 w-9 rounded-md flex items-center justify-center transition ${
        primary
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-slate-200 hover:bg-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
