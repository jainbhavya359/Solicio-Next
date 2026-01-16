"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function StockValuation() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    const res = await axios.get(
      `/api/stock-valuation?email=${email}&date=${date}`
    );
    setRows(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (email) fetchReport();
  }, [email]);

  const totalValue = rows.reduce((s, r) => s + r.value, 0);

  return (
    <motion.section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-1">Stock Valuation</h2>
      <p className="text-sm text-slate-400 mb-4">
        Closing stock as of selected date
      </p>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="bg-black/40 px-4 py-2 rounded-lg mb-4"
      />

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 text-xs text-slate-400 bg-black/40 px-4 py-2">
            <div>Product</div>
            <div>Qty</div>
            <div>Unit</div>
            <div className="text-right">Value ₹</div>
          </div>

          {rows.map(r => (
            <div key={r.product} className="grid grid-cols-4 px-4 py-2 border-t border-white/5">
              <div className="text-white">{r.product}</div>
              <div>{r.quantity}</div>
              <div>{r.unit}</div>
              <div className="text-right font-semibold">₹{r.value}</div>
            </div>
          ))}

          <div className="grid grid-cols-4 px-4 py-3 border-t border-white/10 bg-black/50 font-bold">
            <div>Total</div>
            <div></div>
            <div></div>
            <div className="text-right">₹{totalValue}</div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
