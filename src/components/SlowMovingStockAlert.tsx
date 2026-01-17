"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, CheckCircle } from "lucide-react";

interface SlowMovingItem {
  product: string;
  unit: string;
  quantity: number;
  lastMovedAt: string | null;
  daysSinceMovement: number | null;
}

export default function SlowMovingStock() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [data, setData] = useState<{
    count: number;
    products: SlowMovingItem[];
  } | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/slow-moving-stock?email=${email}`)
      .then(res => setData(res.data))
      .catch(() => setData({ count: 0, products: [] }));
  }, [email]);

  if (!data) return null;

  const isHealthy = data.count === 0;

  return (
    <section className="rounded-3xl p-6 bg-white/10 border border-white/15 backdrop-blur-xl">
      {/* Header */}
      <div className="flex gap-4">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center
          ${isHealthy ? "bg-emerald-500/20" : "bg-amber-500/20"}`}
        >
          {isHealthy ? "✅" : "📉"}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            Slow-Moving Stock
          </h3>

          <p className="text-sm text-slate-300 mt-1">
            {isHealthy
              ? "All products have moved in the last 30 days."
              : `${data.count} item${data.count > 1 ? "s" : ""} haven’t moved in over 30 days.`}
          </p>

          {!isHealthy && (
            <button
              onClick={() => setOpen(v => !v)}
              className="mt-3 text-sm text-emerald-400 hover:underline"
            >
              Analyze products →
            </button>
          )}
        </div>
      </div>

      {/* Healthy reassurance */}
      {isHealthy && (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          Inventory turnover looks healthy.
        </div>
      )}

      {/* Expanded problem list */}
      {!isHealthy && open && (
        <div className="mt-5 border-t border-white/10 pt-4 space-y-3">
          {data.products.map(p => (
            <div
              key={`${p.product}-${p.unit}`}
              className="p-4 border border-white/10 rounded-xl"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-white">{p.product}</p>
                  <p className="text-xs text-slate-400">{p.unit}</p>
                </div>

                <span className="text-xs text-slate-400">
                  Qty: {p.quantity}
                </span>
              </div>

              <div className="text-sm text-slate-300 mt-2">
                {p.daysSinceMovement !== null ? (
                  <p>
                    Last moved{" "}
                    <span className="font-semibold">
                      {p.daysSinceMovement} days ago
                    </span>
                  </p>
                ) : (
                  <p>No recorded movement</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
