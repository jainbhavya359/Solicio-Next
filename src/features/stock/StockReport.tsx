"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Minus,
  Layers,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Search,
  Sparkles
} from "lucide-react";
import AddProductModal from "./AddProductForm";
import { UNITS } from "../../utils/store";

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
  reloadSetter?: (val: any) => void;
}

export default function StockReport({
  data,
  visible,
  productSetter,
  purchaseSetter,
  saleSetter,
  reloadKey,
  reloadSetter,
}: StockReportProps) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const summary = data?.summary;
  const items: StockItem[] = data?.breakdown || [];
  const loading = !data;

  /* ---------------- Fetch Products (for Recipe Builder context) ---------------- */
  useEffect(() => {
    if (!email || !visible) return;
    axios
      .get("/api/products", { params: { email } })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.products ?? [];
        setProducts(list);
      })
      .catch(() => console.error("Failed to sync products for builder context"));
  }, [email, visible, reloadKey]);

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
      className="max-w-7xl mx-auto p-6 space-y-12 font-outfit"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3 h-3" />
            Inventory Control
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Stock <span className="text-emerald-600">Report</span>
          </h2>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl font-medium">
            Real-time monitoring of your stock health, capital exposure, and turnover efficiency.
          </p>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="group relative flex items-center justify-center gap-3 px-8 h-16 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            New Strategic Asset
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
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
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">In Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Stock Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sale Velocity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
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
                      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Loading inventory data...</p>
                    </td>
                  </motion.tr>
                ) : (
                  items.map((stock, idx) => (
                    <motion.tr
                      key={`${stock.product}-${stock.unit}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all duration-300">
                            <Package size={22} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-900 capitalize tracking-tight group-hover:text-emerald-700 transition-colors">{stock.product}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stock.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-slate-900 tracking-tight">{stock.quantity}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest lowercase">{stock.unit}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">₹{stock.price}</td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-lg font-extrabold text-emerald-600 tracking-tight">₹{stock.stockValue.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <DaysLeft days={stock.daysSinceLastSale} />
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${stock.category === "fast" ? "bg-emerald-100 text-emerald-700" :
                          stock.category === "warning" ? "bg-amber-100 text-amber-700" :
                            "bg-rose-50 text-rose-600"
                          }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${stock.category === "fast" ? "bg-emerald-500" :
                            stock.category === "warning" ? "bg-amber-500" :
                              "bg-rose-500"
                            }`} />
                          {statusMap[stock.category] || stock.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <ActionButton
                            onClick={() => adjustQty(stock, -1)}
                            title="Quick Sale"
                          >
                            <Minus size={16} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => adjustQty(stock, 1)}
                            primary
                            title="Restock"
                          >
                            <Plus size={16} />
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
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-50 mb-6 text-slate-300 ring-1 ring-slate-100">
              <Search size={40} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active inventory detected</p>
            <p className="text-slate-300 text-[10px] uppercase tracking-[0.2em] mt-2">Begin provisioning by clicking 'New Strategic Asset'</p>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {showAddProduct && (
          <AddProductModal
            open={showAddProduct}
            onClose={() => setShowAddProduct(false)}
            units={UNITS}
            products={products}
            onSave={async (payload: any) => {
              try {
                const res = await axios.post(
                  payload.productType === "simple"
                    ? "/api/products"
                    : "/api/composite-product",
                  {
                    email,
                    name: payload.name,
                    unit: payload.unit,
                    sellingPrice: payload.sellingPrice,
                    recipe: payload.recipe,
                  }
                );

                toast.success("Operational Hub Synchronized");
                setShowAddProduct(false);
                if (reloadSetter) reloadSetter(Date.now());
              } catch {
                toast.error("Cloud Sync Failed");
              }
            }}
          />
        )}
      </AnimatePresence>
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
    slate: "border-slate-100 bg-slate-50 text-slate-400 bg-slate-900/5",
  };

  return (
    <div className={`group rounded-[2rem] border p-8 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-emerald-200 cursor-default border-slate-100`}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}</span>
        <div className={`p-3 rounded-2xl ${styles[variant]} transition-all duration-500 group-hover:bg-slate-900 group-hover:text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-4xl font-extrabold text-slate-900 tracking-tightest">{value}</p>
      {description && (
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-2 line-clamp-1">{description}</p>
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
      className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg ${primary
        ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-900/10"
        : "bg-white border border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600 shadow-slate-200/50"
        }`}
    >
      {children}
    </button>
  );
}

function DaysLeft({ days }: { days: number | null }) {
  if (days == null) return <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Never Sold</span>;

  const intensity = Math.min(days / 60, 1);
  const isDead = days > 90;

  return (
    <div className="flex flex-col gap-2 w-28">
      <div className="flex justify-between items-end">
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDead ? "text-rose-500" : "text-slate-400"}`}>
          {isDead ? "Dead Asset" : days === 0 ? "Liquid Today" : `${days}D Since Salutation`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(5, 100 - (intensity * 100))}%` }}
          className={`h-full rounded-full transition-colors duration-500 ${days < 7 ? "bg-emerald-500" : days < 30 ? "bg-amber-400" : "bg-rose-500"}`}
        />
      </div>
    </div>
  );
}
