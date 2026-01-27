"use client";

interface StockMovementItem {
  product: string;
  unit: string;
  daysSinceLastSale: number | null;
  score: number;
  category: "fast" | "warming" | "slow" | "dead" | "never-sold";
}

interface Props {
  stockMovementScore?: number;
  productCount?: number;
  slowStockPct?: number;
  slowMovingCount?: number;
  deadStockCount?: number;
  breakdown?: StockMovementItem[];
}

export default function StockMovementCard({
  stockMovementScore = 0,
  productCount = 0,
  slowStockPct = 0,
  slowMovingCount = 0,
  deadStockCount = 0,
  breakdown = [],
}: Props) {
  const scoreColor =
    stockMovementScore >= 20
      ? "text-emerald-600"
      : stockMovementScore >= 10
      ? "text-amber-600"
      : "text-rose-600";

  const healthLabel =
    stockMovementScore >= 20
      ? "Healthy movement"
      : stockMovementScore >= 10
      ? "Some stock is slowing"
      : "Inventory is stuck";

  const fast = breakdown.filter(b => b.category === "fast");
  const warming = breakdown.filter(b => b.category === "warming");
  const slow = breakdown.filter(
    b => b.category === "slow" || b.category === "dead"
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-900 font-semibold">
            Stock Movement Health
          </h3>
          <p className="text-sm text-slate-500">
            How efficiently inventory converts into sales
          </p>
        </div>

        <div className="text-right">
          <div className={`font-semibold ${scoreColor}`}>
            {stockMovementScore} / 30
          </div>
          <div className="text-xs text-slate-500">
            {healthLabel}
          </div>
        </div>
      </div>

      {/* SUMMARY METRICS */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-slate-900 text-lg font-semibold">
            {productCount}
          </div>
          <div className="text-xs text-slate-500">Products</div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-amber-600 text-lg font-semibold">
            {slowMovingCount}
          </div>
          <div className="text-xs text-slate-500">Slow</div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-rose-600 text-lg font-semibold">
            {deadStockCount}
          </div>
          <div className="text-xs text-slate-500">Dead</div>
        </div>
      </div>

      {/* DISTRIBUTION */}
      <div className="space-y-1">
        <p className="text-xs text-slate-500">
          Movement distribution
        </p>

        <div className="flex text-xs">
          <div
            className="bg-emerald-500 h-2 rounded-l"
            style={{
              width: `${(fast.length / productCount) * 100 || 0}%`,
            }}
          />
          <div
            className="bg-amber-400 h-2"
            style={{
              width: `${(warming.length / productCount) * 100 || 0}%`,
            }}
          />
          <div
            className="bg-rose-400 h-2 rounded-r"
            style={{
              width: `${(slow.length / productCount) * 100 || 0}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500">
          <span>Fast: {fast.length}</span>
          <span>Warming: {warming.length}</span>
          <span>Slow/Dead: {slow.length}</span>
        </div>
      </div>

      {/* RISK INSIGHT */}
      {slowStockPct > 0 ? (
        <p className="text-sm text-amber-600">
          {slowStockPct}% of inventory value is tied up in slow-moving items
        </p>
      ) : (
        <p className="text-sm text-emerald-600">
          All stocked products are moving within healthy timeframes
        </p>
      )}

      {/* EXAMPLES */}
      {fast.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2">
            Recently sold
          </p>
          <p className="text-sm text-slate-900">
            {fast[0].product}{" "}
            <span className="text-slate-500">
              ({fast[0].daysSinceLastSale} days ago)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}


// "use client";

// interface StockMovementItem {
//   product: string;
//   unit: string;
//   daysSinceLastSale: number | null;
//   score: number;
// }

// interface Props {
//   stockMovementScore: number;
//   productCount: number;
//   breakdown?: StockMovementItem[];
// }

// export default function StockMovementCard({
//   stockMovementScore,
//   productCount,
//   breakdown = [],
// }: Props) {
//   return (
//     <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-white font-semibold">Stock Movement</h3>
//         <span className="text-emerald-400 font-bold">
//           {stockMovementScore} / 30
//         </span>
//       </div>

//       <p className="text-xs text-slate-400 mb-3">
//         Based on how recently products have sold
//       </p>

//       {productCount === 0 ? (
//         <p className="text-slate-500 text-sm">
//           No products with sales yet
//         </p>
//       ) : (
//         <div className="space-y-2">
//           {breakdown.map((b) => (
//             <div
//               key={`${b.product}-${b.unit}`}
//               className="flex justify-between text-sm"
//             >
//               <div>
//                 <span className="text-white">
//                   {b.product}
//                 </span>
//                 <span className="ml-1 text-xs text-slate-400">
//                   ({b.unit})
//                 </span>

//                 <div className="text-xs text-slate-400">
//                   {b.daysSinceLastSale === null
//                     ? "Never sold"
//                     : `${b.daysSinceLastSale} days ago`}
//                 </div>
//               </div>

//               <span
//                 className={
//                   b.score <= 10
//                     ? "text-rose-400"
//                     : "text-emerald-400"
//                 }
//               >
//                 {b.score}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

