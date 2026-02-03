"use client";

import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useDashboardKPIs } from "@/src/utils/dashboardKPIs";
import { motion } from "framer-motion";

function Card({
  icon: Icon,
  title,
  value,
  pct,
  iconBg,
  iconColor,
  gradient,
  index,
}: any) {
  const up = pct >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-slate-200/60 bg-white p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden"
    >
      {/* Subtle gradient background on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          {/* Premium Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`h-14 w-14 rounded-xl flex items-center justify-center ${iconBg} shadow-lg backdrop-blur-sm border border-white/50`}
          >
            <Icon size={24} className={iconColor} strokeWidth={2.5} />
          </motion.div>

          {/* Premium Percentage Badge */}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
              up 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-sm" 
                : "bg-red-50 text-red-700 border-red-200/60 shadow-sm"
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={up ? "" : "rotate-180"}
            >
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            {Math.abs(pct)}%
          </motion.span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
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
        iconBg="bg-gradient-to-br from-indigo-100 to-indigo-50"
        iconColor="text-indigo-600"
        gradient="bg-gradient-to-br from-indigo-50/50 to-transparent"
        index={0}
      />

      <Card
        icon={TrendingUp}
        title="Net Profit"
        value={`₹${data.profit.value.toLocaleString()}`}
        pct={data.profit.pct}
        iconBg="bg-gradient-to-br from-emerald-100 to-emerald-50"
        iconColor="text-emerald-600"
        gradient="bg-gradient-to-br from-emerald-50/50 to-transparent"
        index={1}
      />

      <Card
        icon={Package}
        title="Total Inventory"
        value={data.inventory.value}
        pct={data.inventory.pct}
        iconBg="bg-gradient-to-br from-violet-100 to-violet-50"
        iconColor="text-violet-600"
        gradient="bg-gradient-to-br from-violet-50/50 to-transparent"
        index={2}
      />

      <Card
        icon={ShoppingCart}
        title="Total Orders"
        value={data.orders.value}
        pct={data.orders.pct}
        iconBg="bg-gradient-to-br from-cyan-100 to-cyan-50"
        iconColor="text-cyan-600"
        gradient="bg-gradient-to-br from-cyan-50/50 to-transparent"
        index={3}
      />
    </div>
  );
}
