"use client";

interface StockMovementItem {
  itemName: string;
  daysSinceLastSale: number;
  score: number;
}

interface Props {
  stockMovementScore: number;
  productCount: number;
  breakdown?: StockMovementItem[];
}

export default function StockMovementCard({
  stockMovementScore,
  productCount,
  breakdown = [],
}: Props) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Stock Movement</h3>
        <span className="text-emerald-400 font-bold">
          {stockMovementScore} / 30
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Based on how recently products have sold
      </p>

      {productCount === 0 ? (
        <p className="text-slate-500 text-sm">
          No sales recorded yet
        </p>
      ) : (
        <div className="space-y-2">
          {breakdown.map((b) => (
            <div
              key={b.itemName}
              className="flex justify-between text-sm"
            >
              <div>
                <span className="text-white">{b.itemName}</span>
                <span className="ml-2 text-xs text-slate-400">
                  {b.daysSinceLastSale} days ago
                </span>
              </div>

              <span
                className={
                  b.score <= 10
                    ? "text-rose-400"
                    : "text-emerald-400"
                }
              >
                {b.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

