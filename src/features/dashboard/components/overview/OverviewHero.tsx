"use client";

import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Package, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardKpis } from "../../types/dashboard";

function MetricCard({
  title,
  value,
  pct,
  icon: Icon,
  colorClass,
  delay
}: {
  title: string;
  value: string;
  pct: number;
  icon: any;
  colorClass: string;
  delay: number;
}) {
  const isUp = pct >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="relative group p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
    >
      {/* Background Glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-300 ${colorClass.split(' ')[0]}`} />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${colorClass.split(' ')[1]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full border ${isUp ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border-rose-400/20"}`}>
          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(pct)}%
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}

export default function OverviewHero({ data }: { data?: DashboardKpis }) {
  if (!data) return null;

  return (
    <section className="mb-12 relative w-full pt-4">
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2"
        >
          Your Business. <span className="text-emerald-400">At a Glance.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-400 font-medium"
        >
          AI-powered real-time snapshot of your operations
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Revenue"
          value={`₹${data.revenue.value.toLocaleString('en-IN')}`}
          pct={data.revenue.pct}
          icon={IndianRupee}
          colorClass="bg-indigo-500 text-indigo-400"
          delay={0.1}
        />
        <MetricCard
          title="Net Profit"
          value={`₹${data.profit.value.toLocaleString('en-IN')}`}
          pct={data.profit.pct}
          icon={TrendingUp}
          colorClass="bg-emerald-500 text-emerald-400"
          delay={0.2}
        />
        <MetricCard
          title="Active Inventory"
          value={data.inventory.value.toLocaleString('en-IN')}
          pct={data.inventory.pct}
          icon={Package}
          colorClass="bg-violet-500 text-violet-400"
          delay={0.3}
        />
        <MetricCard
          title="Total Orders"
          value={data.orders.value.toLocaleString('en-IN')}
          pct={data.orders.pct}
          icon={ShoppingCart}
          colorClass="bg-amber-500 text-amber-400"
          delay={0.4}
        />
      </div>
    </section>
  );
}
