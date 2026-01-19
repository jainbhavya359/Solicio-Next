"use client";

import { useState } from "react";
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

  units: string[];
  products: any[];
}

export default function AddProductModal({
  open,
  onClose,
  onSave,
  units,
  products,
}: AddProductModalProps) {
  const [productType, setProductType] = useState<"simple" | "composite">("simple");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [recipe, setRecipe] = useState<any[]>([]);

  if (!open) return null;

  const canSave =
    name &&
    unit &&
    (productType === "simple" || recipe.length > 0);

  const handleCustomUnit = () => {
    if (!customUnit.trim()) return;
    setUnit(customUnit.trim());
    setCustomUnit("");
  };

  const handleSave = async () => {
    if (!canSave) return;

    await onSave({
      productType,
      name: name.trim(),
      unit,
      sellingPrice: sellingPrice ? Number(sellingPrice) : undefined,
      recipe: productType === "composite" ? recipe : undefined,
    });

    // Reset after save
    setName("");
    setUnit("");
    setSellingPrice("");
    setRecipe([]);
    setProductType("simple");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div
        className="w-full max-w-md bg-slate-900 border border-white/10
        rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <h4 className="text-lg font-bold text-white mb-4">
          Add New Product
        </h4>

        {/* TYPE TOGGLE */}
        <div className="flex rounded-xl bg-black/40 p-1 mb-6">
          {[
            { key: "simple", label: "Simple Product" },
            { key: "composite", label: "Composite Product" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setProductType(t.key as any)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                ${
                  productType === t.key
                    ? "bg-emerald-400 text-black"
                    : "text-slate-400 hover:text-white"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PRODUCT DETAILS */}
        <div className="space-y-4 mb-6">
          <h5 className="text-sm font-semibold text-slate-300">
            Product Details
          </h5>

          <input
            placeholder="Product name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          />

          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          >
            <option value="">Select unit</option>
            {units.map(u => (
              <option key={u} value={u} className="bg-slate-900">
                {u}
              </option>
            ))}
          </select>

          {unit === "Custom" && (
            <input
              placeholder="Custom unit"
              value={customUnit}
              onChange={e => setCustomUnit(e.target.value)}
              onBlur={handleCustomUnit}
              className="px-4 py-3 rounded-xl bg-black/40 border border-white/10"
            />
          )}

          <input
            type="number"
            placeholder="Selling price per unit (optional)"
            value={sellingPrice}
            onChange={e => setSellingPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          />
        </div>

        {/* RECIPE */}
        {productType === "composite" && (
          <div className="border border-white/10 rounded-2xl p-4 bg-black/30 mb-6">
            <RecipeBuilder
              products={products.filter(p => !p.isComposite)}
              value={recipe}
              onChange={setRecipe}
            />

            {recipe.length > 0 && (
              <p className="mt-3 text-xs text-slate-400">
                {recipe.length} ingredient{recipe.length > 1 && "s"} added
              </p>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-slate-900 pt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white"
          >
            Cancel
          </button>

          <button
            disabled={!canSave}
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-400
            text-black font-semibold disabled:opacity-50"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
