"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Package, Calendar, Search } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Top Products
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Sales performance by SKU
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm self-stretch sm:self-auto">
            <div className="flex items-center gap-2 px-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-28 text-xs font-bold text-slate-600 border-none bg-transparent focus:ring-0 cursor-pointer"
              />
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 px-2">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-28 text-xs font-bold text-slate-600 border-none bg-transparent focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center"
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Calculating metrics...</p>
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-bold">No sales data found</p>
              <p className="text-xs text-slate-400 mt-1">Adjust filters to see performance</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } }
              }}
              className="space-y-4"
            >
              {products.map((p) => {
                const trending = p.sales >= avgSales;

                return (
                  <motion.div
                    key={p._id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95, y: 10 },
                      visible: { opacity: 1, scale: 1, y: 0 }
                    }}
                    className="group flex items-center justify-between rounded-2xl bg-white border border-slate-100 p-4 hover:border-indigo-200 hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 capitalize truncate max-w-[120px] sm:max-w-none">
                          {p._id}
                        </p>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                          {p.qty.toLocaleString()} units sold
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        ₹{(p.sales / 1000).toFixed(1)}k
                      </p>

                      <div
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${trending ? "text-emerald-600 bg-emerald-50" : "text-rose-500 bg-rose-50"
                          } px-2 py-0.5 rounded-full mt-1`}
                      >
                        {trending ? (
                          <>
                            <ArrowUpRight size={12} strokeWidth={3} />
                            Trending
                          </>
                        ) : (
                          <>
                            <ArrowDownRight size={12} strokeWidth={3} />
                            Declining
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER ACTION */}
      {!loading && products.length > 0 && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-center">
          <button className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">
            View Analytics Report
          </button>
        </div>
      )}
    </div>
  );
}
