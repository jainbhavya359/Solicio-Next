"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, X, ChevronRight, Layers, Box } from "lucide-react";
import RecipeBuilder from "./RecipeBuilder";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    productType: "simple" | "composite";
    name: string;
    unit: string;
    sellingPrice?: number;
    recipe?: any[];
  }) => Promise<void>;

  units?: string[];
  products?: any[];
}

export default function AddProductModal({
  open,
  onClose,
  onSave,
  units = [],
  products = [],
}: AddProductModalProps) {
  const [productType, setProductType] =
    useState<"simple" | "composite">("simple");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [recipe, setRecipe] = useState<any[]>([]);

  const safeUnits = Array.isArray(units) ? units : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const availableIngredients = useMemo(
    () => safeProducts.filter(p => !p?.isComposite),
    [safeProducts]
  );

  const canSave =
    name.trim() &&
    unit &&
    (productType === "simple" || recipe.length > 0);

  const handleCustomUnit = () => {
    const val = customUnit.trim();
    if (!val) return;
    setUnit(val);
    setCustomUnit("");
  };

  const handleSave = async () => {
    if (!canSave) return;

    await onSave({
      productType,
      name: name.trim(),
      unit,
      sellingPrice: sellingPrice
        ? Number(sellingPrice)
        : undefined,
      recipe:
        productType === "composite"
          ? recipe
          : undefined,
    });

    setName("");
    setUnit("");
    setCustomUnit("");
    setSellingPrice("");
    setRecipe([]);
    setProductType("simple");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden flex flex-col max-h-[90vh] font-outfit"
          >
            {/* HEADER */}
            <div className="px-10 pt-10 pb-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  <Package className="w-3 h-3" />
                  Product Index
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tightest">
                  Provision New <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">Asset</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-10 space-y-8 overflow-y-auto">

              {/* TYPE TOGGLE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Structure Architecture
                </label>
                <div className="grid grid-cols-2 p-1.5 bg-black/40 rounded-[1.5rem] border border-white/10 relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  {[
                    { key: "simple", label: "Simple Unit", icon: Box },
                    { key: "composite", label: "Composite Rig", icon: Layers },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setProductType(t.key as any)}
                      className={`relative z-10 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300
                        ${productType === t.key ? "text-slate-950" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {productType === t.key && (
                        <motion.div
                          layoutId="activeTabBasic"
                          className="absolute inset-0 bg-emerald-500 rounded-2xl shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <t.icon className={`relative z-20 w-4 h-4 ${productType === t.key ? "text-slate-950" : ""}`} />
                      <span className="relative z-20">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* NAME */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Designation Name
                  </label>
                  <input
                    placeholder="e.g. Premium Hub Cap"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>

                {/* UNIT */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Disclosure Unit
                  </label>
                  <div className="relative">
                    <select
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 text-sm font-bold text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">Select unit</option>
                      {safeUnits.map(u => (
                        <option key={u} value={u} className="bg-slate-900 text-white">{u}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {unit === "Custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Custom Metadata Unit
                  </label>
                  <input
                    placeholder="Enter singular unit name"
                    value={customUnit}
                    onChange={e => setCustomUnit(e.target.value)}
                    onBlur={handleCustomUnit}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-5 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  />
                </motion.div>
              )}

              {/* PRICE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Projected Selling Valuation
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 pl-10 pr-5 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* RECIPE */}
              {productType === "composite" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 pt-4"
                >
                  <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                    <RecipeBuilder
                      products={availableIngredients}
                      value={recipe}
                      onChange={setRecipe}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* FOOTER */}
            <div className="px-10 py-8 border-t border-white/5 flex items-center justify-between gap-6 bg-white/5 backdrop-blur-md">
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>

              <button
                disabled={!canSave}
                onClick={handleSave}
                className="flex-grow md:flex-none md:min-w-[200px] px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:bg-emerald-400 disabled:opacity-20 disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Initialize Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
