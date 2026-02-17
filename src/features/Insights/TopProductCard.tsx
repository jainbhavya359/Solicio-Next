"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

type ProductSignal = {
  _id: string;
  sales: number;
  qty: number;
};

export default function TopProductsCard() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const monthAgo = lastMonth.toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(monthAgo);
  const [toDate, setToDate] = useState(today);
  const [products, setProducts] = useState<ProductSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/insights/sales-trend", {
          params: { email, from: fromDate, to: toDate },
        });
        setProducts(res.data.productSignals || []);
      } catch (err) {
        console.error("Failed to fetch top products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [email, fromDate, toDate]);

  const avgSales =
    products.length > 0
      ? products.reduce((s, p) => s + p.sales, 0) / products.length
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Top Products
        </h3>

        <div className="flex gap-2 text-sm">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="self-center text-slate-400">-</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center">
          <div className="w-8 h-8 border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-slate-500 text-sm">
          No sales data found for this period.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => {
            const trending = p.sales >= avgSales;

            return (
              <div
                key={p._id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900 capitalize">
                    {p._id}
                  </p>
                  <p className="text-sm text-slate-500">
                    {p.qty.toLocaleString()} units sold
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    ₹{p.sales.toLocaleString()}
                  </p>

                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${trending ? "text-emerald-600" : "text-rose-500"
                      }`}
                  >
                    {trending ? (
                      <>
                        <ArrowUpRight size={16} />
                        Trending
                      </>
                    ) : (
                      <>
                        <ArrowDownRight size={16} />
                        Declining
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
