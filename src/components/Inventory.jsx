"use client"

import { useState } from "react";
import Purchase from "./Purchase";
import StockHistory from "@/src/components/StockHistory";
//import StockReport from "./StockReport";

export default function Inventory() {
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);


  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-24">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Business Optimization
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Track inventory, manage purchases and sales, and gain clarity into
            your business operations.
          </p>
        </div>

        {/* INVENTORY ACTIONS */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Inventory Management</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => {
                setNewPurchase(true);
                setNewSale(false);
              }}
              className="flex-1 py-4 rounded-2xl font-bold text-black
              bg-gradient-to-r from-emerald-400 to-teal-400
              hover:opacity-90 transition shadow-lg"
            >
              + Bought Stock
            </button>

            <button
              onClick={() => {
                setNewSale(true);
                setNewPurchase(false);
              }}
              className="flex-1 py-4 rounded-2xl font-bold text-black
              bg-gradient-to-r from-rose-400 to-red-500
              hover:opacity-90 transition shadow-lg"
            >
              − Sold Stock
            </button>
          </div>
        </div>

        {/* PURCHASE */}
        {newPurchase && (
          <div className="space-y-6">
            <Purchase newPurchase={newPurchase}/>
          </div>
        )}

        {/* SOLD FORM */}
        {newSale && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
              Record a Sale
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-300">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g., Steel Pipes"
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Quantity</label>
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
                />
              </div>
            </div>

            <button
              className="mt-8 px-8 py-3 rounded-full font-bold text-black
              bg-gradient-to-r from-rose-400 to-red-500
              hover:opacity-90 transition shadow-lg"
            >
              Remove from Stock →
            </button>
          </div>
        )}

        {/*
        <StockReport />
        STOCK REPORT */}

        {/* SALES REPORT */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Sales Report
          </h2>

          <p className="text-slate-300 mb-4">
            Insights into your recent sales activity.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/10 text-slate-300">
                <tr>
                  <th className="py-3 text-left">Product</th>
                  <th className="py-3 text-left">Quantity</th>
                  <th className="py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="3"
                    className="py-6 text-center text-slate-400"
                  >
                    No sales history yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <StockHistory />

      </div>
    </section>
  );
}
