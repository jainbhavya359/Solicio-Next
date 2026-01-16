"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export default function ProfitLossReport() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-01-31");
  const [data, setData] = useState<any>(null);

  const load = async () => {
    const res = await axios.get(
      `/api/profit-loss?email=${email}&from=${from}&to=${to}`
    );
    setData(res.data);
  };

  useEffect(() => {
    if (email) load();
  }, [email]);

  if (!data) return null;

  return (
    <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-4">Profit & Loss</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-black/40 p-4 rounded-xl">
          <p className="text-slate-400 text-sm">Sales</p>
          <p className="text-xl font-bold">₹{data.summary.sales}</p>
        </div>
        <div className="bg-black/40 p-4 rounded-xl">
          <p className="text-slate-400 text-sm">COGS</p>
          <p className="text-xl font-bold">₹{data.summary.cogs}</p>
        </div>
        <div className="bg-black/40 p-4 rounded-xl">
          <p className="text-slate-400 text-sm">Gross Profit</p>
          <p className="text-xl font-bold text-emerald-400">
            ₹{data.summary.profit}
          </p>
        </div>
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 bg-black/40 text-xs px-4 py-2">
          <div>Product</div>
          <div>Sales</div>
          <div>COGS</div>
          <div className="text-right">Profit</div>
        </div>

        {data.products.map((p: any) => (
          <div key={p.product} className="grid grid-cols-4 px-4 py-2 border-t border-white/5">
            <div>{p.product}</div>
            <div>₹{p.sales}</div>
            <div>₹{p.cogs}</div>
            <div className="text-right font-semibold">
              ₹{p.sales - p.cogs}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
