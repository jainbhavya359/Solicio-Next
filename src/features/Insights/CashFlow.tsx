import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

interface CashFlowData {
  purchases: number;
  sales: number;
  period: string;
}

export default function CashFlowWatch({ data }: { data: CashFlowData }) {
  if (!data) return null;

  const isHealthy = data.sales >= data.purchases;
  const net = data.sales - data.purchases;

  return (
    <section className="h-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isHealthy ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
            {isHealthy ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Cash Flow</h3>
            <p className="text-sm text-slate-500 mt-1">
              Net {isHealthy ? "positive" : "negative"} for {data.period.toLowerCase()}
            </p>
          </div>
        </div>

        <a
          href="/transactions"
          className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          Details
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Inflow</p>
          <p className="text-lg font-bold text-emerald-600">
            ₹{data.sales.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Outflow</p>
          <p className="text-lg font-bold text-rose-600">
            ₹{data.purchases.toLocaleString()}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isHealthy ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isHealthy ? "text-emerald-700" : "text-amber-700"}`}>
            Net
          </p>
          <p className={`text-lg font-bold ${isHealthy ? "text-emerald-700" : "text-amber-700"}`}>
            {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString()}
          </p>
        </div>
      </div>

      {/* FOOTER MESSAGE */}
      <div className={`mt-auto flex items-center gap-2 text-sm font-medium ${isHealthy ? "text-emerald-600" : "text-amber-600"}`}>
        {isHealthy ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Healthy cash flow. Spending is under control.
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            Attention: Outflow exceeds inflow this period.
          </>
        )}
      </div>
    </section>
  );
}

