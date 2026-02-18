"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Package,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Layers,
  Search,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export interface SlowMovingItem {
  product: string;
  unit: string;
  quantity: number;
  value: number;
  daysSinceLastSale: number | null;
  category: "slow" | "dead";
}

interface Props {
  slowMovingCount: number;
  slowStockValue: number;
  slowMoving: SlowMovingItem[];
  open: boolean;
  onToggle: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
  },
} as any;

export default function SlowMovingStockView({
  slowMovingCount,
  slowStockValue,
  slowMoving,
  open,
  onToggle,
}: Props) {
  const isHealthy = slowMovingCount === 0;

  // Calculate avg stall days
  const avgStallDays = slowMoving.length > 0
    ? Math.round(slowMoving.reduce((acc, item) => acc + (item.daysSinceLastSale || 0), 0) / slowMoving.length)
    : 0;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="max-w-7xl mx-auto space-y-6 sm:space-y-12"
    >
      {/* Header - Hidden on Mobile to reduce clutter */}
      <div className="hidden sm:flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3 h-3" />
            Inventory Analysis
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Slow-Moving <span className="text-amber-600">Stock</span>
          </h2>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl">
            Identify stagnant inventory, free up blocked working capital, and optimize product turnover.
          </p>
        </div>

        {!isHealthy && (
          <button
            onClick={onToggle}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
          >
            {open ? "Hide Inventory Breakdown" : "Review Stalled Stock"}
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>

      {/* Mobile Header Button Only */}
      <div className="block sm:hidden">
        {!isHealthy && (
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md active:scale-95"
          >
            {open ? "Hide Breakdown" : "Review Stalled Stock"}
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Kpi
          label="Total Stalled"
          value={slowMovingCount}
          icon={Package}
          variant="amber"
          description="Actionable SKUs"
        />
        <Kpi
          label="Value at Risk"
          value={`₹${slowStockValue.toLocaleString()}`}
          icon={TrendingDown}
          variant="rose"
          description="Blocked capital"
        />
        <Kpi
          label="Avg. Stall Days"
          value={`${avgStallDays}d`}
          icon={ShieldCheck}
          variant="slate"
          description="Since last sale"
        />
        <Kpi
          label="Health Index"
          value={isHealthy ? "100%" : "68%"}
          icon={CheckCircle}
          variant={isHealthy ? "emerald" : "amber"}
          description="Efficiency"
        />
      </div>

      {/* COMPACT LIST / TABLE */}
      <AnimatePresence>
        {!isHealthy && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6 sm:mb-12">
              {/* DESKTOP TABLE */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">In Stock</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Value</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stall Duration</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {slowMoving.map((item, idx) => (
                      <motion.tr
                        key={`${item.product}-${item.unit}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 capitalize">{item.product}</p>
                              <p className="text-xs font-medium text-slate-400">{item.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-slate-900">{item.quantity}</span>
                            <span className="text-xs font-medium text-slate-400 lowercase">{item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-base font-bold text-rose-600">₹{item.value.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-700">
                              {item.daysSinceLastSale === null ? "Absolute Zero" : `${item.daysSinceLastSale} days`}
                            </span>
                            <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.category === 'dead' ? 'bg-rose-500' : 'bg-amber-500'}`}
                                style={{ width: `${Math.min(100, ((item.daysSinceLastSale || 90) / 90) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.category === "slow" ? "bg-amber-100 text-amber-600" : "bg-rose-50 text-rose-500"
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.category === "slow" ? "bg-amber-500" : "bg-rose-500"
                              }`} />
                            {item.category === "slow" ? "Slow Moving" : "Dead Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/inventory?action=sale&product=${item.product}`}
                              className="h-9 w-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:border-amber-200 hover:text-amber-600 transition-all"
                            >
                              <ArrowUpRight size={14} />
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE LIST */}
              <div className="block sm:hidden">
                <div className="divide-y divide-slate-100/50">
                  {slowMoving.map((item, idx) => (
                    <motion.div
                      key={`mob-${item.product}-${item.unit}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-4"
                    >
                      {/* Row 1: Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm capitalize leading-tight">{item.product}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{item.unit}</p>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${item.category === "slow" ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-rose-50 border-rose-100 text-rose-500"}`}>
                                {item.category === "slow" ? "Slow" : "Dead"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/inventory?action=sale&product=${item.product}`}
                          className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400"
                        >
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>

                      {/* Row 2: Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3 pl-13">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100/50">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Value Stuck</p>
                          <p className="text-sm font-bold text-rose-600">₹{item.value.toLocaleString()}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100/50">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                          <p className="text-sm font-bold text-slate-700">{item.quantity} <span className="text-[10px] text-slate-400 font-medium">{item.unit}</span></p>
                        </div>
                      </div>

                      {/* Row 3: Stall Duration */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stalled {item.daysSinceLastSale || 0}d</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.category === 'dead' ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, ((item.daysSinceLastSale || 90) / 90) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-3 sm:gap-4 mb-4"
            >
              <AlertTriangle className="text-amber-600 shrink-0 w-5 h-5 sm:w-7 sm:h-7" />
              <div>
                <p className="font-bold text-amber-900 text-sm sm:text-base tracking-tight uppercase">Strategic Insight</p>
                <p className="text-xs sm:text-sm text-amber-800/80 font-medium leading-relaxed mt-1">
                  High-risk items found in your inventory. Consider liquidation or promotional discounting to free up <span className="font-bold">₹{slowStockValue.toLocaleString()}</span> in blocked working capital and improve your overall health score.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Healthy reassurance footer */}
      {isHealthy && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-emerald-50/30 rounded-3xl border border-emerald-100 border-dashed">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900">Your Inventory is Optimized</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold">All items showing optimal turnover</p>
        </div>
      )}
    </motion.section>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  variant = "slate",
  description
}: {
  label: string;
  value: string | number;
  icon: any;
  variant?: "emerald" | "amber" | "rose" | "slate";
  description?: string;
}) {
  const styles = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-600 bg-emerald-500/10",
    amber: "border-amber-100 bg-amber-50 text-amber-600 bg-amber-500/10",
    rose: "border-rose-100 bg-rose-50 text-rose-600 bg-rose-500/10",
    slate: "border-slate-200 bg-white text-slate-400 bg-slate-500/5",
  };

  return (
    <div className={`group rounded-2xl sm:rounded-3xl border p-4 sm:p-6 bg-white transition-all hover:shadow-md hover:border-emerald-200 cursor-default`}>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl ${styles[variant]} transition-colors group-hover:bg-emerald-500 group-hover:text-white`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <p className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      {description && (
        <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1 line-clamp-1">{description}</p>
      )}
    </div>
  );
}
