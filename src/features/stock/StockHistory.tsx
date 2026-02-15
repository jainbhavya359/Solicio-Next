"use client";

import StockHistoryTable from "./StockHistoryTable";

export default function StockHistory({
  data,
}: {
  data: any[];
}) {
  if (!data) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        </div>
      </section>
    );
  }

  const purchases = data.filter((r: any) => r.voucher === "Purchase");
  const sales = data.filter((r: any) => r.voucher === "Sale");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Stock History
        </h2>
        <p className="text-slate-500">
          Purchases and sales recorded in your inventory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockHistoryTable
          title="Purchases"
          subtitle="Stock added to inventory"
          rows={purchases}
          type="Purchase"
        />
        <StockHistoryTable
          title="Sales"
          subtitle="Stock sold to customers"
          rows={sales}
          type="Sale"
        />
      </div>
    </section>
  );
}



