"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronRight, Sparkles, Plus } from "lucide-react";

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
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">
          Recipe Manifest
        </h4>
      </div>

      {/* ADD INGREDIENT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-[0_0_40px_rgba(52,211,153,0.02)]">
        <div className="md:col-span-6 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Ingredient Selector
          </label>
          <div className="relative">
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-bold text-white appearance-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer outline-none"
            >
              <option value="" className="bg-slate-900 text-slate-300">Select asset</option>
              {safeProducts.map(p => (
                <option key={p._id} value={p._id} className="bg-slate-900 text-white">
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Volume {selectedProduct && `(${selectedProduct.unit})`}
          </label>
          <input
            type="number"
            min={0}
            step="any"
            value={qty}
            onChange={e => setQty(e.target.value)}
            placeholder="0.00"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <button
            onClick={addIngredient}
            disabled={!selectedProduct || !qty}
            className="h-12 w-full rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] disabled:opacity-20 disabled:shadow-none transition-all duration-300"
          >
            <Plus size={20} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* INGREDIENT LIST */}
      <AnimatePresence initial={false}>
        {safeValue.length > 0 ? (
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Active Parameters
            </label>
            <div className="grid gap-3">
              {safeValue.map(item => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-sm hover:border-emerald-500/30 hover:shadow-[0_8px_32px_rgba(52,211,153,0.05)] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight">
                        {item.productName}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        {item.qtyRequired} {item.unit}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeIngredient(item.productId)}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)] transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border border-dashed border-white/10 bg-white/5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              No configuration detected.
            </p>
            <p className="text-[10px] text-slate-600 mt-2">
              Add structural components required to formulate this asset.
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
