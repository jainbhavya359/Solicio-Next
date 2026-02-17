"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, ChevronRight, Sparkles } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  unit: string;
  purchasePrice?: number;
  isComposite?: boolean;
};

type RecipeItem = {
  productId: string;
  productName: string;
  unit: string;
  qtyRequired: number;
};

export default function RecipeBuilder({
  products = [],
  value = [],
  onChange,
}: {
  products?: Product[];
  value?: RecipeItem[];
  onChange: (items: RecipeItem[]) => void;
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeValue = Array.isArray(value) ? value : [];

  const [selectedProductId, setSelectedProductId] = useState("");
  const [qty, setQty] = useState("");

  const selectedProduct = useMemo(
    () => safeProducts.find(p => p._id === selectedProductId),
    [safeProducts, selectedProductId]
  );

  const addIngredient = () => {
    if (!selectedProduct) return;
    const amount = Number(qty);
    if (!amount || amount <= 0) return;

    if (safeValue.some(v => v.productId === selectedProduct._id)) return;

    onChange([
      ...safeValue,
      {
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        unit: selectedProduct.unit,
        qtyRequired: amount,
      },
    ]);

    setSelectedProductId("");
    setQty("");
  };

  const removeIngredient = (id: string) => {
    onChange(safeValue.filter(v => v.productId !== id));
  };

  return (
    <div className="space-y-8 font-outfit">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
          Recipe Manifest
        </h4>
      </div>

      {/* ADD INGREDIENT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="md:col-span-6 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Ingredient Selector
          </label>
          <div className="relative">
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold appearance-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="">Select product</option>
              {safeProducts.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Quantity {selectedProduct && `(${selectedProduct.unit})`}
          </label>
          <input
            type="number"
            min={0}
            step="any"
            value={qty}
            onChange={e => setQty(e.target.value)}
            placeholder="0.00"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <button
            onClick={addIngredient}
            disabled={!selectedProduct || !qty}
            className="h-12 w-full rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-40 transition-all duration-300 shadow-lg shadow-slate-900/10"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* INGREDIENT LIST */}
      <AnimatePresence initial={false}>
        {safeValue.length > 0 ? (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Active Ingredients List
            </label>
            <div className="grid gap-3">
              {safeValue.map(item => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 tracking-tight">
                        {item.productName}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        {item.qtyRequired} {item.unit}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeIngredient(item.productId)}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              No configuration detected.
            </p>
            <p className="text-[10px] text-slate-300 mt-2">
              Add ingredients required to formulate this composite product.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Box({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
