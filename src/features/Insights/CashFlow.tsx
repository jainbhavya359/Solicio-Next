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
    <section className="h-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`p-2 sm:p-3 rounded-xl ${isHealthy ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
            {isHealthy ? (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </div>
          <div className="hidden sm:block">
            <h3 className="text-xl font-bold text-slate-900">Cash Flow</h3>
            <p className="text-sm text-slate-500 mt-1">
              Net {isHealthy ? "positive" : "negative"} for {data.period.toLowerCase()}
            </p>
          </div>
          {/* Mobile Text */}
          <div className="block sm:hidden">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Cash Analysis</h3>
            <p className="text-[10px] text-slate-500 font-medium">{isHealthy ? "Net Positive" : "Net Negative"}</p>
          </div>
        </div>

        <a
          href="/transactions"
          className="group flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
        >
          Details
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2">Inflow</p>
          <p className="text-sm sm:text-lg font-bold text-emerald-600 truncate">
            ₹{data.sales.toLocaleString()}
          </p>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2">Outflow</p>
          <p className="text-sm sm:text-lg font-bold text-rose-600 truncate">
            ₹{data.purchases.toLocaleString()}
          </p>
        </div>

        <div className={`col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${isHealthy ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
          <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2 ${isHealthy ? "text-emerald-700" : "text-amber-700"}`}>
            Net Cash
          </p>
          <p className={`text-base sm:text-lg font-bold ${isHealthy ? "text-emerald-700" : "text-amber-700"}`}>
            {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString()}
          </p>
        </div>
      </div>

      {/* FOOTER MESSAGE */}
      <div className={`mt-auto flex items-start sm:items-center gap-2 text-xs sm:text-sm font-medium ${isHealthy ? "text-emerald-600" : "text-amber-600"}`}>
        {isHealthy ? (
          <>
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 sm:mt-0" />
            <span>Healthy cash flow. Spending is under control.</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 sm:mt-0" />
            <span>Attention: Outflow exceeds inflow this period.</span>
          </>
        )}
      </div>
    </section>
  );
}

