"use client"

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Purchase({ newPurchase }) {

  const [email, setEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(1000);
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  const date = new Date().toISOString().split("T")[0];

  const { user } = useUser();

  
  useEffect(()=>{
    if(!email){
      setEmail(user?.primaryEmailAddress.emailAddress);
      return;
    }
  },[email]);

  const addStock = async () => {
    if (!productName || purchaseQuantity <= 0 || purchasePrice <= 0) {
      toast("Invalid Purchase");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/stock",
        JSON.stringify({
            email,
            productName,
            purchaseQuantity,
            purchasePrice,
            unit,
            date,
          })
      );

      if (response.data.success) {
        setProductName("");
        setPurchaseQuantity(1);
        setPurchasePrice(1000);
        toast("Stock added successfully");
      } else {
        console.error("Failed to add stock");
        toast("Failed to add stock");
      }
    } catch (err) {
      console.error("Error:", err);
      toast("Failed to add stock onto server");
    } finally {
      setLoading(false);
    }
  };

  if (!newPurchase) return null;

  return (
    <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
      <Toaster />
      <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Record a New Purchase
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-slate-300">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Steel Pipes"
            className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Quantity</label>
          <input
            type="number"
            min="1"
            value={purchaseQuantity}
            onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
            className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g., Pcs"
            className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Price (₹)</label>
          <input
            type="number"
            min="0"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
              <label className="text-sm text-slate-300">Purchase Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
              />
            </div>
      </div>

      <button
        onClick={addStock}
        disabled={loading}
        className="mt-8 px-8 py-3 rounded-full font-bold text-black
        bg-gradient-to-r from-emerald-400 to-teal-400
        hover:opacity-90 transition shadow-lg disabled:opacity-50"
      >
        {loading ? "Adding..." : "+ Add to Stock"}
      </button>
    </section>
  );
}
