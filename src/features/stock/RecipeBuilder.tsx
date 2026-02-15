"use client";

import { useState, useMemo } from "react";
import { X, Plus } from "lucide-react";

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
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-stone-700">
        Recipe (Ingredients)
      </h4>

      {/* ADD INGREDIENT */}
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-6">
          <label className="text-xs text-stone-500 mb-1 block">
            Ingredient
          </label>
          <select
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            className="
              h-11 w-full rounded-lg border border-stone-300
              bg-white px-3 text-sm
              focus:ring-2 focus:ring-emerald-500/20
              focus:border-emerald-500
            "
          >
            <option value="">Select product</option>
            {safeProducts.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-4">
          <label className="text-xs text-stone-500 mb-1 block">
            Quantity {selectedProduct && `(${selectedProduct.unit})`}
          </label>
          <input
            type="number"
            min={0}
            step="any"
            value={qty}
            onChange={e => setQty(e.target.value)}
            placeholder="e.g. 2"
            className="
              h-11 w-full rounded-lg border border-stone-300
              bg-white px-3 text-sm
              focus:ring-2 focus:ring-emerald-500/20
              focus:border-emerald-500
            "
          />
        </div>

        <div className="col-span-2">
          <button
            onClick={addIngredient}
            disabled={!selectedProduct || !qty}
            className="
              h-11 w-full rounded-lg
              bg-emerald-600 text-white
              flex items-center justify-center
              hover:bg-emerald-700
              disabled:opacity-40
            "
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* INGREDIENT LIST */}
      {safeValue.length > 0 ? (
        <div className="rounded-lg border border-stone-300 overflow-hidden">
          {safeValue.map(item => (
            <div
              key={item.productId}
              className="
                flex items-center justify-between
                px-4 py-3
                bg-white
                border-b border-stone-200 last:border-none
              "
            >
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {item.productName}
                </p>
                <p className="text-xs text-stone-500">
                  {item.qtyRequired} {item.unit}
                </p>
              </div>

              <button
                onClick={() => removeIngredient(item.productId)}
                className="
                  h-8 w-8 rounded-md
                  flex items-center justify-center
                  text-stone-400
                  hover:text-rose-500
                  hover:bg-stone-100
                "
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-stone-500">
          Add ingredients required to make this product
        </p>
      )}
    </div>
  );
}
