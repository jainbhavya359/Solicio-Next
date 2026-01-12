"use client"

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UNITS } from "../utils/store";
import { useRouter } from "next/navigation";

export default function Purchase({ newPurchase }) {

  const [productName, setProductName] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(1000);
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState( new Date().toISOString().split("T")[0] );
  const [loading, setLoading] = useState(false);

  const [units, setUnits] = useState(UNITS);
  const [customUnit, setCustomUnit] = useState("");

  const {user} = useUser();
  
  const email = user?.primaryEmailAddress.emailAddress;

  useEffect(()=>{
    if(!email) return;
  },[email]);

  const handleCustomUnit = () => {
    const formatted = customUnit.trim();

    if (!formatted) return;

    // Normalize (important)
    const normalized =
      formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();

    // Prevent duplicates
    if (!units.includes(normalized)) {
      setUnits((prev) => [...prev.filter(u => u !== "Custom"), normalized, "Custom"]);
    }

    // Auto-select new unit
    setUnit(normalized);
    setCustomUnit("");
  };

  const addStock = async () => {
    

    if (!productName || purchaseQuantity <= 0 || purchasePrice <= 0 || unit.length == 0) {
      toast("Invalid Purchase");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/stock",
        JSON.stringify({
            email,
            name: productName.toLowerCase(),
            quantity: purchaseQuantity,
            price: purchasePrice,
            unit,
            date,
            voucher: "Purchase",
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
        <label className="text-sm text-slate-300">Unit (Recomended to keep same)</label>

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="mt-2 w-full px-4 py-3 rounded-xl 
                    bg-black/40 border border-white/10 
                    outline-none focus:border-emerald-400
                    text-slate-200"
        >
          <option value="" className="bg-slate-900">Select Unit</option>

          {units.map((u) => (
            <option key={u} value={u} className="bg-slate-900">
              {u}
            </option>
          ))}
        </select>

          {unit === "Custom" && (
            <input
              type="text"
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
              onBlur={handleCustomUnit}
              placeholder="Enter custom unit"
              className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
            />
          )}

      </div>

        <div>
          <label className="text-sm text-slate-300">Price per unit(₹)</label>
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
