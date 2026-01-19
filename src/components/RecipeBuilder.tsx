"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  unit: string;
  purchasePrice?: number;
};

type RecipeItem = {
  productId: string;
  productName: string;
  unit: string;
  qtyRequired: number;
};


export default function RecipeBuilder({
  products,
  value,
  onChange,
}: {
  products: Product[];
  value: RecipeItem[];
  onChange: (items: RecipeItem[]) => void;
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [qty, setQty] = useState("");

  const selectedProduct = products.find(
    (p) => p._id === selectedProductId
  );

  const addIngredient = () => {
    if (!selectedProduct || !qty || Number(qty) <= 0) return;

    // prevent duplicates
    if (value.some((v) => v.productId === selectedProduct._id)) return;

    onChange([
      ...value,
      {
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        unit: selectedProduct.unit,
        qtyRequired: Number(qty),
      },
    ]);

    setSelectedProductId("");
    setQty("");
  };

  const removeIngredient = (id: string) => {
    onChange(value.filter((v) => v.productId !== id));
  };

  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-sm font-semibold text-slate-300">
        Recipe (Ingredients)
      </h4>

      {/* ADD INGREDIENT ROW */}
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-6">
          <label className="text-xs text-slate-400">Ingredient</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="loan-input"
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-4">
          <label className="text-xs text-slate-400">
            Quantity {selectedProduct && `(${selectedProduct.unit})`}
          </label>
          <input
            type="number"
            min={0}
            step="any"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="loan-input"
            placeholder="e.g. 2"
          />
        </div>

        <div className="col-span-2">
          <button
            onClick={addIngredient}
            disabled={!selectedProduct || !qty}
            className="w-full h-[46px] rounded-xl
            bg-emerald-400 text-black font-bold
            disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* INGREDIENT LIST */}
      {value.length > 0 && (
        <div className="mt-4 rounded-2xl bg-black/40 border border-white/10">
          {value.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center px-4 py-3
              border-b border-white/5 last:border-none"
            >
              <div>
                <p className="text-white font-medium">
                  {item.productName}
                </p>
                <p className="text-xs text-slate-400">
                  {item.qtyRequired} {item.unit}
                </p>
              </div>

              <button
                onClick={() => removeIngredient(item.productId)}
                className="text-slate-400 hover:text-rose-400"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <p className="text-xs text-slate-500">
          Add ingredients required to make this product
        </p>
      )}
    </div>
  );
}
