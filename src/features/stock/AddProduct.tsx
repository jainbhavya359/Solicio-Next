"use client";

import { useState, useMemo } from "react";
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

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-stone-300 overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-stone-200">
          <h3 className="text-lg font-semibold text-stone-900">
            Add New Product
          </h3>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* TYPE TOGGLE */}
          <div className="flex rounded-lg border border-stone-300 overflow-hidden">
            {[
              { key: "simple", label: "Simple" },
              { key: "composite", label: "Composite" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() =>
                  setProductType(t.key as any)
                }
                className={`flex-1 py-2 text-sm font-medium transition
                  ${
                    productType === t.key
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-100"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* NAME */}
          <input
            placeholder="Product name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="h-11 w-full rounded-lg border border-stone-300 px-4 text-sm
            focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />

          {/* UNIT */}
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="h-11 w-full rounded-lg border border-stone-300 px-4 text-sm bg-white"
          >
            <option value="">Select unit</option>
            {safeUnits.map(u => (
              <option key={u} value={u}>
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
              className="h-11 w-full rounded-lg border border-stone-300 px-4 text-sm"
            />
          )}

          {/* PRICE */}
          <input
            type="number"
            placeholder="Selling price (optional)"
            value={sellingPrice}
            onChange={e => setSellingPrice(e.target.value)}
            className="h-11 w-full rounded-lg border border-stone-300 px-4 text-sm"
          />

          {/* RECIPE */}
          {productType === "composite" && (
            <div className="rounded-lg border border-stone-300 p-4 bg-stone-50">
              <RecipeBuilder
                products={availableIngredients}
                value={recipe}
                onChange={setRecipe}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-stone-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-sm hover:bg-stone-100"
          >
            Cancel
          </button>

          <button
            disabled={!canSave}
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white
            font-semibold disabled:opacity-50 hover:bg-emerald-700"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
