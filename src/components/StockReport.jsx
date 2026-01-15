"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Package, Plus, Minus, AlertTriangle } from "lucide-react";

export default function StockReport({ visible, productSetter ,purchaseSetter ,saleSetter}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  const { user } = useUser();
  const email = user?.primaryEmailAddress.emailAddress;

  if (!visible) return null;

  /* ---------------- Fetch Stock ---------------- */
  useEffect(() => {
    if (!email) return;

    const fetchStock = async () => {
      try {
        const res = await axios.get("/api/totalStock", {
          params: { email },
        });
        setData(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError(true);
        toast.error("Failed to load stock");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [email]);

  /* ---------------- Derived Stats ---------------- */
  const totalValue = data.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const LOW_STOCK_LIMIT = 5;

  /* ---------------- Quick Adjust (UI-only hook) ---------------- */
  const adjustQty = async (stock, delta) => {
    if(delta == 1){
      purchaseSetter(true);
      saleSetter(false);
    }else{
      purchaseSetter(false);
      saleSetter(true);
    }

    productSetter(stock)
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl"
    >
      {/* Header */}
      <h3 className="text-2xl font-bold text-white mb-1">
        Inventory Overview
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Live stock & valuation
      </p>

      {/* ---------------- Summary Card ---------------- */}
      <div className="mb-8 grid sm:grid-cols-2 gap-4">
        <div
          className="bg-black/40 border border-white/10 rounded-2xl p-6
          hover:border-emerald-400/50 transition"
        >
          <p className="text-xs text-slate-400 mb-1">
            Total Inventory Value
          </p>
          <p className="text-3xl font-bold text-emerald-400">
            ₹{totalValue.toLocaleString()}
          </p>
        </div>

        <div
          className="bg-black/40 border border-white/10 rounded-2xl p-6"
        >
          <p className="text-xs text-slate-400 mb-1">
            Products Tracked
          </p>
          <p className="text-3xl font-bold text-white">
            {data.length}
          </p>
        </div>
      </div>

      {/* ---------------- States ---------------- */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400">Error loading stock</p>
      ) : data.length === 0 ? (
        <p className="text-slate-400">No stock available</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((stock) => {
            const lowStock = stock.quantity <= LOW_STOCK_LIMIT;

            return (
              <motion.div
                key={stock._id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative bg-black/40 border rounded-2xl p-5
                  transition
                  ${
                    lowStock
                      ? "border-amber-400/60"
                      : "border-white/10 hover:border-emerald-400/50"
                  }`}
              >
                {/* Low Stock Badge */}
                {lowStock && (
                  <div className="absolute top-3 right-3 flex items-center gap-1
                    text-xs text-amber-400 font-semibold">
                    <AlertTriangle size={14} />
                    Low stock
                  </div>
                )}

                {/* Product Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center
                    ${
                      lowStock
                        ? "bg-amber-400/20"
                        : "bg-emerald-400/20"
                    }`}
                  >
                    <Package
                      className={
                        lowStock
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    />
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      {stock.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Unit: {stock.unit}
                    </p>
                  </div>
                </div>

                {/* Quantity & Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Quantity
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        lowStock
                          ? "text-amber-400"
                          : "text-white"
                      }`}
                    >
                      {stock.quantity}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => adjustQty(stock, -1)}
                      className="h-9 w-9 rounded-lg bg-white/10
                      hover:bg-white/20"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      onClick={() => adjustQty(stock, 1)}
                      className="h-9 w-9 rounded-lg bg-white/10
                      hover:bg-white/20"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Value */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Total Value
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ₹{stock.price.toLocaleString()}
                  </span>
                </div>

                {/* Dates */}
                <div className="mt-4 text-xs text-slate-500 space-y-1">
                  <p>
                    Updated:{" "}
                    {new Date(stock.updatedAt)
                      .toISOString()
                      .split("T")[0]}
                  </p>
                  <p>
                    Created:{" "}
                    {new Date(stock.createdAt)
                      .toISOString()
                      .split("T")[0]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
