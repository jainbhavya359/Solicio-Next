"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type ProductSignal = {
  _id: string;
  sales: number;
  qty: number;
};

// 1. Define the shape of the data prop using your existing Type
interface TopProductsProps {
  data: {
    productSignals: ProductSignal[];
  };
}

export default function TopProductsCard({ data }: TopProductsProps) {
  // 2. Since products is derived from data.productSignals, 
  // it now correctly inherits the ProductSignal[] type.
  const products = data?.productSignals || [];

  // Note: loading is always true here. Ensure you have a 
  // useEffect to set it to false when data arrives.
  if (products.length === 0) return null;

  const avgSales =
    products.reduce((s, p) => s + p.sales, 0) / products.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Top Products
      </h3>

      <div className="space-y-3">
        {products.map((p) => {
          // 3. 'p' is no longer 'any', it is now 'ProductSignal'
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
                  className={`flex items-center justify-end gap-1 text-sm font-medium ${
                    trending ? "text-emerald-600" : "text-rose-500"
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
