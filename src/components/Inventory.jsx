"use client"

import { useEffect, useState } from "react";
import Purchase from "./Purchase";
import StockHistory from "@/src/components/StockHistory";
import { Toaster } from "react-hot-toast";
import StockReport from "./StockReport";
import Sale from "./Sale"
import { useUser } from "@clerk/nextjs";

export default function Inventory() {
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);
  const [ reload, setReload ] = useState(false);

  const {user} = useUser();

  const email = user?.primaryEmailAddress.emailAddress;

  useEffect(()=>{
    if(!email){
      return;
    }
  },[email]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">
      <Toaster />
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
            <Purchase newPurchase={newPurchase} setReload={setReload} email={email}/>
          </div>
        )}

        {/* SOLD FORM */}
        {newSale && (
          <Sale email={email}/>
        )}

        {/* STOCK REPORT */}
        <StockReport email={email}/>

        {/* SALES REPORT */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Sales Report
          </h2>

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

        <StockHistory relaod={reload} email={email}/>

      </div>
    </section>
  );
}
