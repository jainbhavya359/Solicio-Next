"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, X, Plus, ChevronRight, Layers, Box } from "lucide-react";
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

    // reset state
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] font-outfit"
          >
            {/* HEADER */}
            <div className="px-10 pt-10 pb-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-3 border border-slate-200/50">
                  <Package className="w-3 h-3 text-emerald-600" />
                  Product Index
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tightest">
                  Add New <span className="text-emerald-600">Product</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-10 space-y-8 overflow-y-auto">

              {/* TYPE TOGGLE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Structure Architecture
                </label>
                <div className="grid grid-cols-2 p-1.5 bg-slate-50 rounded-[1.5rem] border border-slate-100 relative">
                  {[
                    { key: "simple", label: "Simple Unit", icon: Box },
                    { key: "composite", label: "Composite Rig", icon: Layers },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setProductType(t.key as any)}
                      className={`relative z-10 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300
                        ${productType === t.key ? "text-white" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      {productType === t.key && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <t.icon className={`relative z-20 w-4 h-4 ${productType === t.key ? "text-emerald-400" : ""}`} />
                      <span className="relative z-20">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* NAME */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Designation Name
                  </label>
                  <input
                    placeholder="e.g. Premium Hub Cap"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* UNIT */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Disclosure Unit
                  </label>
                  <div className="relative">
                    <select
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select unit</option>
                      {safeUnits.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Custom Metadata Unit
                  </label>
                  <input
                    placeholder="Enter singular unit name"
                    value={customUnit}
                    onChange={e => setCustomUnit(e.target.value)}
                    onBlur={handleCustomUnit}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </motion.div>
              )}

              {/* PRICE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Projected Selling Valuta
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
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
                  <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 ring-1 ring-inset ring-slate-200/50">
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
            <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between gap-6 bg-white/80 backdrop-blur-md">
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
              >
                Cancel
              </button>

              <button
                disabled={!canSave}
                onClick={handleSave}
                className="flex-grow md:flex-none md:min-w-[200px] px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
