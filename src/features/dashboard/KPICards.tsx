"use client";

import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

function Card({
  icon: Icon,
  title,
  value,
  pct,
  iconBg,
  iconColor,
}: any) {
  const up = pct >= 0;

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`h-12 w-12 rounded-2xl flex items-center justify-center ${iconBg} transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon size={24} className={iconColor} />
        </div>

        <span
          className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border ${up
              ? "text-emerald-700 bg-emerald-50 border-emerald-100"
              : "text-rose-700 bg-rose-50 border-rose-100"
            }`}
        >
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(pct)}%
        </span>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function KPICards({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        icon={DollarSign}
        title="Total Revenue"
        value={`₹${data.revenue.value.toLocaleString()}`}
        pct={data.revenue.pct}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />

      <Card
        icon={TrendingUp}
        title="Net Profit"
        value={`₹${data.profit.value.toLocaleString()}`}
        pct={data.profit.pct}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />

      <Card
        icon={Package}
        title="Total Inventory"
        value={data.inventory.value}
        pct={data.inventory.pct}
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
      />

      <Card
        icon={ShoppingCart}
        title="Total Orders"
        value={data.orders.value}
        pct={data.orders.pct}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
      />
    </div>
  );
}
