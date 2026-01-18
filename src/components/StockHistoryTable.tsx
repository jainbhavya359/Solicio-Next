"use client";

interface StockRow {
  _id: string;
  name: string;
  voucher: "Purchase" | "Sale";
  quantity: number;
  unit: string;
  price: number;
  entryNo: string;
  date: string;
}

interface Props {
  title: string;
  subtitle: string;
  rows: StockRow[];
  type: "Purchase" | "Sale";
}

export default function StockHistoryTable({
  title,
  subtitle,
  rows,
  type,
}: Props) {
  const color =
    type === "Purchase" ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
      {/* HEADER */}
      <div className="mb-4">
        <h3 className={`font-semibold ${color}`}>
          {title}
        </h3>
        <p className="text-xs text-slate-400">
          {subtitle}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No {type.toLowerCase()} records found.
        </p>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 text-xs text-slate-400 bg-black/50 px-4 py-3">
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Rate</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-3">Entry / Date</div>
          </div>

          {/* ROWS */}
          {rows.map((row, i) => (
            <div
              key={row._id}
              className={`grid grid-cols-12 px-4 py-3 text-sm
                border-t border-white/5
                ${i % 2 === 0 ? "bg-black/30" : "bg-black/20"}
                hover:bg-white/5 transition`}
            >
              <div className="col-span-3 font-medium text-white">
                {row.name}
                <div className="text-xs text-slate-400">
                  {row.unit}
                </div>
              </div>

              <div className="col-span-2">
                {row.quantity}
              </div>

              <div className="col-span-2">
                ₹{row.price}
              </div>

              <div className="col-span-2 font-medium">
                ₹{row.quantity * row.price}
              </div>

              <div className="col-span-3 text-xs text-slate-400">
                <div>{row.entryNo}</div>
                <div>
                  {new Date(row.date).toISOString().split("T")[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
