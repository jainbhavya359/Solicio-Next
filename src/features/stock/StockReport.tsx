"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Minus,
  Layers,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Search
} from "lucide-react";

// 1. Define the shape of a single Stock item
interface StockItem {
  product: string;
  unit: string;
  price: number;
  quantity: number;
  stockValue: number;
  daysSinceLastSale: number | null;
  category: "fast" | "warning" | "slow" | "dead" | "never-sold";
}

// 2. Define the Props for the component
interface StockReportProps {
  data: {
    summary?: {
      totalStockValue: number;
      productCount: number;
      totalQuantity: number;
      slowStockPct: number;
    };
    breakdown?: StockItem[];
  };
  visible: boolean;
  productSetter: (product: any) => void;
  purchaseSetter: (val: boolean) => void;
  saleSetter: (val: boolean) => void;
  reloadKey?: number;
}

export default function StockReport({
  data,
  visible,
  productSetter,
  purchaseSetter,
  saleSetter,
}: StockReportProps) {

  const summary = data?.summary;
  const items: StockItem[] = data?.breakdown || [];
  const loading = !data;

  if (!visible) return null;

  const adjustQty = (stock: StockItem, delta: number) => {
    const product = {
      name: stock.product,
      unit: stock.unit,
      price: stock.price,
      quantity: stock.quantity,
    };

    productSetter(product);

    if (delta > 0) {
      purchaseSetter(true);
      saleSetter(false);
    } else {
      purchaseSetter(false);
      saleSetter(true);
    }
  };

  const statusMap: Record<string, string> = {
    fast: "Fast Moving",
    warning: "Low Stock",
    slow: "Slow Moving",
    dead: "Dead Stock",
    "never-sold": "Never Sold",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3 h-3" />
            Inventory Control
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Stock <span className="text-emerald-600">Report</span>
          </h2>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl">
            Real-time monitoring of your stock health, capital exposure, and turnover efficiency.
          </p>
        </div>
      </div>

      {/* KPI STRIP */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Kpi
            label="Total Stock Value"
            value={`₹${summary.totalStockValue.toLocaleString()}`}
            icon={TrendingUp}
            variant="emerald"
            description="Working capital locked"
          />
          <Kpi
            label="Active Products"
            value={summary.productCount}
            icon={Package}
            variant="slate"
            description="Unique SKUs in stock"
          />
          <Kpi
            label="Total Units"
            value={summary.totalQuantity.toLocaleString()}
            icon={Layers}
            variant="slate"
            description="Physical units count"
          />
          <Kpi
            label="At Risk"
            value={`${summary.slowStockPct}%`}
            icon={AlertTriangle}
            variant="amber"
            description="Slow moving capital"
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">In Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Stock Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sale Velocity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={7} className="py-24 text-center">
                      <div className="relative w-12 h-12 mx-auto">
                        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-slate-400">Loading inventory data...</p>
                    </td>
                  </motion.tr>
                ) : (
                  items.map((stock, idx) => (
                    <motion.tr
                      key={`${stock.product}-${stock.unit}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 capitalize">{stock.product}</p>
                            <p className="text-xs font-medium text-slate-400">{stock.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-slate-900">{stock.quantity}</span>
                          <span className="text-xs font-medium text-slate-400 lowercase">{stock.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600">₹{stock.price}</td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-base font-bold text-emerald-600">₹{stock.stockValue.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <DaysLeft days={stock.daysSinceLastSale} />
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stock.category === "fast" ? "bg-emerald-100 text-emerald-600" :
                            stock.category === "warning" ? "bg-amber-100 text-amber-600" :
                              "bg-rose-50 text-rose-500"
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${stock.category === "fast" ? "bg-emerald-500" :
                              stock.category === "warning" ? "bg-amber-500" :
                                "bg-rose-500"
                            }`} />
                          {statusMap[stock.category] || stock.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ActionButton
                            onClick={() => adjustQty(stock, -1)}
                            title="Quick Sale"
                          >
                            <Minus size={14} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => adjustQty(stock, 1)}
                            primary
                            title="Restock"
                          >
                            <Plus size={14} />
                          </ActionButton>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!loading && items.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-medium">No inventory items found</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

// Sub-components
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
  variant?: "emerald" | "amber" | "slate";
  description?: string;
}) {
  const styles = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-600 bg-emerald-500/10",
    amber: "border-amber-100 bg-amber-50 text-amber-600 bg-amber-500/10",
    slate: "border-slate-200 bg-white text-slate-400 bg-slate-500/5",
  };

  return (
    <div className={`group rounded-3xl border p-6 bg-white transition-all hover:shadow-md hover:border-emerald-200 cursor-default`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`p-2.5 rounded-2xl ${styles[variant]} transition-colors group-hover:bg-emerald-500 group-hover:text-white`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      {description && (
        <p className="text-xs font-medium text-slate-400 mt-1 line-clamp-1">{description}</p>
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  primary,
  title
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${primary
          ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-sm"
          : "bg-white border border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
        }`}
    >
      {children}
    </button>
  );
}

function DaysLeft({ days }: { days: number | null }) {
  if (days == null) return <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Never Sold</span>;

  const intensity = Math.min(days / 60, 1);
  const isDead = days > 90;

  return (
    <div className="flex flex-col gap-1.5 w-24">
      <div className="flex justify-between items-end">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDead ? "text-rose-500" : "text-slate-400"}`}>
          {isDead ? "Dead Stock" : days === 0 ? "Selling Today" : `${days}d since sale`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(5, 100 - (intensity * 100))}%` }}
          className={`h-full rounded-full ${days < 7 ? "bg-emerald-500" : days < 30 ? "bg-amber-400" : "bg-rose-400"}`}
        />
      </div>
    </div>
  );
}
