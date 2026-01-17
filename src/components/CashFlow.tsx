"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

interface CashFlowData {
  purchases: number;
  sales: number;
  period: string;
}

export default function CashFlowWatch() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [data, setData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    setLoading(true);

    axios
      .get(`/api/cash-flow?email=${email}`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [email]);

  // ⛔ Don’t show card if healthy or still loading
  if (loading || !data) return null;


  return (
    <section className="rounded-3xl p-6 bg-white/10 border border-white/15 backdrop-blur-xl">
      <div className="flex gap-4">
        {/* Icon */}
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center
            ${data.purchases > data.sales ? "bg-pink-500/20" : "bg-emerald-500/20"}`}
            >
            💰
            </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            Cash Flow Watch
          </h3>

          <p className="text-sm text-slate-300 mt-1">
            {data.purchases > data.sales
                ? `Purchases are higher than sales ${data.period.toLowerCase()}.`
                : `Cash flow is healthy ${data.period.toLowerCase()}.`}
            </p>




          <a
            href="/transactions"
            className="inline-flex items-center gap-1 mt-3 text-sm text-pink-400 hover:underline"
          >
            View transactions <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Optional breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-300">
        <div>
          <p className="text-xs text-slate-400">Purchases</p>
          <p className="font-semibold text-red-400">
            ₹{data.purchases}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Sales</p>
          <p className="font-semibold text-emerald-400">
            ₹{data.sales}
          </p>
        </div>
      </div>
    </section>
  );
}
