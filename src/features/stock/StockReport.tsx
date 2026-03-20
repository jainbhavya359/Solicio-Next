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
  Search,
  Trash2,
  Edit2
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [localReload, setLocalReload] = useState(0);
  const [sortMode, setSortMode] = useState<"risk" | "value">("risk");

  const rawItems: StockItem[] = data?.breakdown || [];
  const loading = !data;

  // RISK-PRIORITY SORT: dead → warning → slow → never-sold → fast
  const riskOrder: Record<string, number> = { dead: 0, warning: 1, slow: 2, "never-sold": 3, fast: 4 };
  const items = [...rawItems].sort((a, b) => {
    if (sortMode === "risk") return (riskOrder[a.category] ?? 5) - (riskOrder[b.category] ?? 5);
    return b.stockValue - a.stockValue;
  });

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
  }, [email, visible, reloadKey, localReload]);

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

  const handleDeleteProduct = (stock: StockItem) => {
    setItemToDelete(stock);
    setShowDeleteModal(true);
  };

  const handleEditProduct = (stock: StockItem) => {
    const p = products.find((p) => p.name === stock.product && p.unit === stock.unit);
    if (p) {
      setItemToEdit(p);
      setShowAddProduct(true);
    } else {
      toast.error("Original product details not found in local cache. Try refreshing.");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await axios.delete("/api/products", {
        params: {
          email,
          name: itemToDelete.product,
          unit: itemToDelete.unit
        }
      });

      if (res.data.success) {
        toast.success("Asset decommissioned");
        setShowDeleteModal(false);
        setItemToDelete(null);
        setLocalReload(c => c + 1);
        if (reloadSetter) reloadSetter(Date.now());
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to decommission asset");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 sm:space-y-12 font-outfit"
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4 sm:gap-6 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Layers className="w-3 h-3" />
            Inventory Control
          </div>
          <div className="hidden sm:block">
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              Stock <span className="text-emerald-400">Ledger</span>
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-2 max-w-xl font-medium leading-relaxed">
              Real-time monitoring of your stock health, capital exposure, and turnover efficiency.
            </p>
          </div>
          {/* Mobile Title */}
          <h2 className="block sm:hidden text-2xl font-black text-white tracking-tight">
            Stock Ledger
          </h2>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="relative z-10 group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 h-12 sm:h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">New Strategic Asset</span>
            <span className="inline sm:hidden">Add</span>
          </span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative group hover:border-white/20 transition-all duration-500">
        
        {/* Sort Controls */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mr-2">Sort:</span>
          <button
            onClick={() => setSortMode("risk")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              sortMode === "risk"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
            }`}
          >
            ⚠ Risk First
          </button>
          <button
            onClick={() => setSortMode("value")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              sortMode === "value"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
            }`}
          >
            ₹ Value
          </button>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">In Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Stock Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sale Velocity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.tr
                        key={`skel-desk-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="animate-pulse border-b border-white/5"
                      >
                        <td className="px-8 py-6"><div className="flex gap-4 items-center"><div className="w-12 h-12 bg-white/10 rounded-2xl" /><div className="space-y-2"><div className="w-24 h-4 bg-white/10 rounded text-transparent">-</div><div className="w-12 h-2 bg-white/10 rounded text-transparent">-</div></div></div></td>
                        <td className="px-8 py-6"><div className="w-16 h-6 bg-white/10 rounded text-transparent">-</div></td>
                        <td className="px-8 py-6"><div className="w-12 h-4 bg-white/10 rounded text-transparent">-</div></td>
                        <td className="px-8 py-6 right"><div className="w-20 h-6 bg-white/10 rounded ml-auto text-transparent">-</div></td>
                        <td className="px-8 py-6"><div className="w-16 h-6 bg-white/10 rounded text-transparent">-</div></td>
                        <td className="px-8 py-6"><div className="w-24 h-6 bg-white/10 rounded-full text-transparent">-</div></td>
                        <td className="px-8 py-6" />
                      </motion.tr>
                    ))}
                  </>
                ) : (
                  items.map((stock, idx) => (
                    <motion.tr
                      key={`${stock.product}-${stock.unit}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group/row hover:bg-white/5 border-l-2 border-transparent hover:border-emerald-500 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center group-hover/row:bg-emerald-500/20 group-hover/row:text-emerald-400 group-hover/row:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 border border-white/10 group-hover/row:border-emerald-500/30">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-white capitalize tracking-tight group-hover/row:text-emerald-400 transition-colors">{stock.product}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stock.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-white tracking-tight">{stock.quantity}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest lowercase">{stock.unit}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-300">₹{stock.price}</td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-lg font-extrabold text-emerald-400 tracking-tight">₹{stock.stockValue.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-8 py-6">
                        <DaysLeft days={stock.daysSinceLastSale} />
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${stock.category === "fast" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                          stock.category === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${stock.category === "fast" ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" :
                            stock.category === "warning" ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" :
                              "bg-rose-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                            }`} />
                          {statusMap[stock.category] || stock.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/row:translate-x-0">
                          <ActionButton
                            onClick={() => handleEditProduct(stock)}
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </ActionButton>
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
                          {stock.quantity === 0 && (
                            <ActionButton
                              onClick={() => handleDeleteProduct(stock)}
                              danger
                              title="Decommission Product"
                            >
                              <Trash2 size={16} />
                            </ActionButton>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST VIEW */}
        <div className="block sm:hidden p-2">
          <div className="space-y-3">
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={`skel-mob-${i}`} className="p-4 rounded-2xl border border-white/5 bg-[#111] animate-pulse">
                    <div className="h-10 w-10 bg-white/10 rounded-xl mb-3" />
                  </div>
                ))}
              </>
            ) : (
              items.map((stock, idx) => (
                <motion.div
                  key={`mob-${stock.product}-${stock.unit}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="p-4 rounded-2xl bg-[#111] border border-white/5"
                >
                  {/* Row 1: Header & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 text-slate-400 border border-white/10 flex items-center justify-center shrink-0">
                        <Package size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm capitalize leading-tight">{stock.product}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stock.unit} • ₹{stock.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stock Level</p>
                      <p className="text-sm font-bold text-white">{stock.quantity} <span className="text-[10px] text-slate-500 font-medium">{stock.unit}</span></p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mb-1">Value</p>
                      <p className="text-sm font-bold text-emerald-400">₹{stock.stockValue.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Row 3: Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditProduct(stock)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 text-emerald-400 bg-white/5 shrink-0"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => adjustQty(stock, -1)}
                      className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl border border-white/10 text-slate-300 bg-white/5 font-bold text-xs"
                    >
                      <Minus size={14} /> Sale
                    </button>
                    <button
                      onClick={() => adjustQty(stock, 1)}
                      className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    >
                      <Plus size={14} /> Restock
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {!loading && items.length === 0 && (
          <div className="py-20 sm:py-32 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] bg-white/5 mb-6 text-slate-600 ring-1 ring-white/10">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active inventory detected</p>
            <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mt-2">Begin provisioning by clicking 'New Strategic Asset'</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddProduct && (
          <AddProductModal
            key={itemToEdit?._id ?? "new"}
            open={showAddProduct}
            onClose={() => {
              setShowAddProduct(false);
              setItemToEdit(null);
            }}
            initialData={itemToEdit}
            units={UNITS}
            products={products}
            onSave={async (payload: any) => {
              try {
                if (payload._id) {
                  // EDIT MODE
                  await axios.put("/api/products", {
                    _id: payload._id,
                    email,
                    name: payload.name,
                    unit: payload.unit,
                    sellingPrice: payload.sellingPrice,
                    gstRate: payload.gstRate
                  });
                  toast.success("Product Updated");
                } else {
                  // CREATE MODE
                  await axios.post(
                    payload.productType === "simple"
                      ? "/api/products"
                      : "/api/composite-product",
                    {
                      email,
                      name: payload.name,
                      unit: payload.unit,
                      sellingPrice: payload.sellingPrice,
                      gstRate: payload.gstRate,
                      recipe: payload.recipe,
                    }
                  );
                  toast.success("Product Created");
                }

                setShowAddProduct(false);
                setItemToEdit(null);
                setLocalReload(c => c + 1);
                if (reloadSetter) reloadSetter(Date.now());
              } catch {
                toast.error("Operation Failed");
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && itemToDelete && (
          <DeleteConfirmationModal
            item={itemToDelete}
            onClose={() => {
              setShowDeleteModal(false);
              setItemToDelete(null);
            }}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// Sub-components

function ActionButton({
  children,
  onClick,
  primary,
  danger,
  title
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg ${primary
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        : danger
          ? "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          : "bg-white/5 border border-white/10 text-[#A1A1AA] hover:border-white/30 hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}

function DeleteConfirmationModal({
  item,
  onClose,
  onConfirm
}: {
  item: StockItem;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#111] rounded-[2.5rem] shadow-[0_0_50px_rgba(244,63,94,0.1)] border border-rose-500/20 overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto border border-rose-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">Decommission Asset</h3>
            <p className="text-[#A1A1AA] font-medium text-sm leading-relaxed">
              Are you sure you want to remove <span className="text-rose-400 font-bold capitalize">{item.product}</span> ({item.unit})? This strategic decision cannot be reversed.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={onConfirm}
              className="w-full h-14 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(244,63,94,0.2)]"
            >
              Confirm Decommissioning
            </button>
            <button
              onClick={onClose}
              className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-[#A1A1AA] font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
            >
              Abeyance (Cancel)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DaysLeft({ days }: { days: number | null }) {
  if (days == null) return <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em]">Never Sold</span>;

  const intensity = Math.min(days / 60, 1);
  const isDead = days > 90;

  return (
    <div className="flex flex-col gap-2 w-28">
      <div className="flex justify-between items-end">
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDead ? "text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]" : "text-[#A1A1AA]"}`}>
          {isDead ? "Dead Asset" : days === 0 ? "Liquid Today" : `${days}D Since Salutation`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(5, 100 - (intensity * 100))}%` }}
          className={`h-full rounded-full transition-colors duration-500 shadow-[0_0_10px_currentColor] ${days < 7 ? "bg-emerald-400 text-emerald-400" : days < 30 ? "bg-amber-400 text-amber-400" : "bg-rose-400 text-rose-400"}`}
        />
      </div>
    </div>
  );
}
