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
  const isPurchase = type === "Purchase";

  const accent = isPurchase ? "emerald" : "rose";
  const bgTint = isPurchase
    ? "bg-emerald-50/60"
    : "bg-rose-50/60";
  const valueColor = isPurchase
    ? "text-emerald-700"
    : "text-rose-700";

  return (
    <div
      className={`rounded-xl border border-slate-200 ${bgTint}`}
    >
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white rounded-t-xl">
        <h3
          className={`font-semibold text-${accent}-600`}
        >
          {title}
        </h3>
        <p className="text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="px-6 py-8 text-sm text-slate-500">
          No {type.toLowerCase()} records found.
        </p>
      ) : (
        <div className="divide-y divide-slate-200">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 px-6 py-3 text-xs font-medium text-slate-500 bg-slate-100">
            <div className="col-span-3">Product</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Value</div>
            <div className="col-span-3 text-center">Entry / Date</div>
          </div>

          {/* ROWS */}
          {rows.map(row => (
            <div
              key={row._id}
              className="grid grid-cols-12 gap-3 px-6 py-4 text-sm bg-white hover:bg-slate-50 transition"
            >
              {/* Product */}
              <div className="col-span-3">
                <div className="font-medium text-slate-900">
                  {row.name}
                </div>
                <div className="text-xs text-slate-500">
                  {row.unit}
                </div>
              </div>

              {/* Qty */}
              <div className="col-span-2 text-right font-medium text-slate-900">
                {row.quantity}
              </div>

              {/* Rate */}
              <div className="col-span-2 text-right text-slate-700">
                ₹{row.price}
              </div>

              {/* Value */}
              <div
                className={`col-span-2 text-right font-semibold ${valueColor}`}
              >
                ₹{row.quantity * row.price}
              </div>

              {/* Entry */}
              <div className="col-span-3 text-xs text-center text-slate-500">
                <div className="font-medium">
                  {row.entryNo}
                </div>
                <div>
                  {new Date(row.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
