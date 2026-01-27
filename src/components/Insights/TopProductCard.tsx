"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type ProductSignal = {
  _id: string;
  sales: number;
  qty: number;
};

export default function TopProductsCard() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [products, setProducts] = useState<ProductSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchTopProducts = async () => {
      try {
        const res = await axios.get("/api/insights/sales-trend", {
          params: { email, days: 30 },
        });

        setProducts(res.data.productSignals || []);
      } catch (err) {
        console.error("Failed to fetch top products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [email]);

  if (loading || products.length === 0) return null;

  const avgSales =
    products.reduce((s, p) => s + p.sales, 0) / products.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Top Products
      </h3>

      <div className="space-y-3">
        {products.map((p) => {
          const trending = p.sales >= avgSales;

          return (
            <div
              key={p._id}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              {/* Left */}
              <div>
                <p className="font-semibold text-slate-900">
                  {p._id}
                </p>
                <p className="text-sm text-slate-500">
                  {p.qty.toLocaleString()} units sold
                </p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="font-bold text-slate-900">
                  ₹{p.sales.toLocaleString()}
                </p>

                <div
                  className={`flex items-center justify-end gap-1 text-sm font-medium ${
                    trending
                      ? "text-emerald-600"
                      : "text-rose-500"
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
    </div>
  );
}
