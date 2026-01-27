"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

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

    axios
      .get(`/api/cash-flow?email=${email}`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [email]);

  if (loading || !data) return null;

  const isHealthy = data.sales >= data.purchases;
  const net = data.sales - data.purchases;

  return (
    <section
      className={`rounded-2xl border p-6
        ${isHealthy
          ? "bg-emerald-50 border-emerald-200"
          : "bg-amber-50 border-amber-200"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-start gap-4">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center
            ${isHealthy ? "bg-emerald-100" : "bg-amber-100"}`}
        >
          {isHealthy ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">
            Cash Flow
          </h3>

          <p className="text-sm text-slate-600 mt-0.5">
            {isHealthy
              ? `Net positive cash flow ${data.period.toLowerCase()}`
              : `Cash outflow exceeded inflow ${data.period.toLowerCase()}`}
          </p>
        </div>

        <a
          href="/transactions"
          className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
        >
          View
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* AMOUNTS */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500">Purchases</p>
          <p className="font-semibold text-rose-600">
            ₹{data.purchases.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Sales</p>
          <p className="font-semibold text-emerald-600">
            ₹{data.sales.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Net</p>
          <p
            className={`font-semibold ${
              net >= 0 ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString()}
          </p>
        </div>
      </div>

      {/* REASSURANCE */}
      {isHealthy && (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4" />
          Spending is under control and cash inflow is steady.
        </div>
      )}
    </section>
  );
}

