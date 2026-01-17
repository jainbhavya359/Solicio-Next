"use client";

interface Props {
  inventoryBalanceScore?: number;
  totalStockValue?: number;
  totalSalesValue?: number;
  stockToSalesRatio?: number;
}

export default function InventoryBalanceCard({
  inventoryBalanceScore = 0,
  totalStockValue = 0,
  totalSalesValue = 0,
  stockToSalesRatio = 0,
}: Props) {
  const ratioColor =
    stockToSalesRatio > 2
      ? "text-rose-400"
      : stockToSalesRatio > 1
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">
          Inventory Balance
        </h3>
        <span className="text-amber-400 font-bold">
          {inventoryBalanceScore} / 25
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Measures stock vs recent sales efficiency
      </p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Stock value</span>
          <span className="text-white">
            ₹{totalStockValue.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Sales (30 days)</span>
          <span className="text-white">
            ₹{totalSalesValue.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Stock / Sales</span>
          <span className={`font-medium ${ratioColor}`}>
            {stockToSalesRatio || "—"}
          </span>
        </div>
      </div>

      {totalSalesValue === 0 && totalStockValue > 0 && (
        <p className="mt-3 text-xs text-rose-400">
          No recent sales but inventory exists
        </p>
      )}
    </div>
  );
}
