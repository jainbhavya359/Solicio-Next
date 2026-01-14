"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Purchase from"@/src/components/Purchase";
import { Toaster } from "react-hot-toast";
import StockReport from "./StockReport";
import Sale from "./Sale";


export default function BusinessInsights() {
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);
  const [ viewStock, setViewStock ] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white py-28">
      <Toaster />
      {/* Lively Ambient Blobs */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-indigo-500/30 blur-3xl rounded-full" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-pink-500/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-1/2 w-[24rem] h-[24rem] bg-emerald-400/20 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-24">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
            Business Insights
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Understand what’s happening in your business — and what to act on today.
          </p>
        </motion.div>

        {/* TODAY'S INSIGHTS */}
        <div className="space-y-10">
          <h2 className="text-3xl font-bold">Today at a Glance</h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Insight Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Low Stock Alert</h3>
              <p className="text-slate-300">
                2 products may run out within the next few days.
              </p>
              <button className="mt-4 text-indigo-400 hover:underline">
                Review inventory →
              </button>
            </motion.div>

            {/* Insight Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Cash Flow Watch</h3>
              <p className="text-slate-300">
                Purchases are higher than sales this week.
              </p>
              <button className="mt-4 text-pink-400 hover:underline">
                View transactions →
              </button>
            </motion.div>

            {/* Insight Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-4xl mb-4">📉</div>
              <h3 className="text-xl font-bold mb-2">Slow-Moving Stock</h3>
              <p className="text-slate-300">
                3 items haven’t moved in over 30 days.
              </p>
              <button className="mt-4 text-emerald-400 hover:underline">
                Analyze products →
              </button>
            </motion.div>

          </div>
        </div>

        {/* WHY THIS MATTERS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">
            Why these insights matter
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Most small businesses don’t fail because of lack of sales — they fail due to
            poor visibility. Missed stock issues, delayed decisions, and untracked cash
            quietly eat profits.
            <br /><br />
            Solicio highlights problems early so you can act before they hurt your business.
          </p>
        </motion.div>

        {/* ACTION CENTER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/20 via-pink-500/20 to-emerald-500/20 border border-white/20 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6">
            Take Action
          </h2>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                setNewPurchase(true);
                setNewSale(false);
                setViewStock(false);
              }} 
              className="px-6 py-3 rounded-full font-bold text-black bg-gradient-to-r from-indigo-400 to-indigo-600 hover:opacity-90 transition"
            >
              Add Purchase
            </button>

            <button 
              onClick={() => {
                setNewSale(true);
                setNewPurchase(false);
                setViewStock(false);
              }} 
              className="px-6 py-3 rounded-full font-bold text-black bg-gradient-to-r from-pink-400 to-pink-600 hover:opacity-90 transition"
            >
              Record Sale
            </button>

            <button
             onClick={() => {
                setNewSale(false);
                setNewPurchase(false);
                setViewStock(true);
              }} 
             className="px-6 py-3 rounded-full font-bold text-black bg-gradient-to-r from-emerald-400 to-emerald-600 hover:opacity-90 transition"
            >
              View Stock Report
            </button>
          </div>

          <p className="text-sm text-slate-300 mt-6">
            (Smarter recommendations coming soon)
          </p>
        </motion.div>

        {newPurchase && (
          <div className="space-y-6">
            <Purchase visible={newPurchase} />
          </div>
        )}

        {viewStock && (
          <div className="space-y-6">
            <StockReport visible={viewStock} />
          </div>
        )}

        {newSale && (
          <div className="space-y-6">
            <Sale visible={newSale} />
          </div>
        )}
      </div>

    </section>
  );
}
