"use client";

import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useDashboardKPIs } from "@/src/utils/dashboardKPIs";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        {/* Icon */}
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={22} className={iconColor} />
        </div>

        {/* Percentage */}
        <span
          className={`text-sm font-semibold flex items-center gap-1 ${
            up ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {up ? "↑" : "↓"} {Math.abs(pct)}%
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-3xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function KPICards() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const { data, loading } = useDashboardKPIs(email);

  if (loading || !data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        icon={DollarSign}
        title="Total Revenue"
        value={`₹${data.revenue.value.toLocaleString()}`}
        pct={data.revenue.pct}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
      />

      <Card
        icon={TrendingUp}
        title="Net Profit"
        value={`₹${data.profit.value.toLocaleString()}`}
        pct={data.profit.pct}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />

      <Card
        icon={Package}
        title="Total Inventory"
        value={data.inventory.value}
        pct={data.inventory.pct}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
      />

      <Card
        icon={ShoppingCart}
        title="Total Orders"
        value={data.orders.value}
        pct={data.orders.pct}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
      />
    </div>
  );
}
