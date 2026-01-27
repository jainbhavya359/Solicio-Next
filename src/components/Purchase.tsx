"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Minus, Package } from "lucide-react";
import AddProductModal from "./AddProduct";
import { UNITS } from "../utils/store";

export default function Purchase({
  visible,
  preSelectedProduct,
  reloadSetter,
  reload,
}: any) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProducts, setShowProducts] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [units, setUnits] = useState(UNITS);


  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [partyName, setPartyName] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  /* ---------------- Outside Click ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProducts(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    if (!email) return;

    if(preSelectedProduct.length !== 0){
      setSelectedProduct(preSelectedProduct);
    }

    axios
      .get("/api/products", { params: { email } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.products ?? [];
        setProducts(list);
      })
      .catch(() => toast.error("Failed to load products"));
  }, [email, reload, preSelectedProduct]);

  /* ---------------- Submit ---------------- */
  const addStock = async () => {
    if (!selectedProduct || Number(price) <= 0) {
      toast.error("Select product and enter price");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/stock", {
        email,
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        quantity,
        price,
        partyName,
        date,
        voucher: "Purchase",
      });

      toast.success("Purchase added");
      setQuantity(1);
      setPrice("");
      setPartyName("");
      setSelectedProduct(null);
      reloadSetter(!reload);
    } catch {
      toast.error("Failed to add purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-stone-300 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-stone-200">
        <h3 className="text-lg font-semibold text-stone-900">
          Quick Purchase
        </h3>
        <p className="text-sm text-stone-500">
          Restock items instantly
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Product Selector */}
        <div ref={dropdownRef} className="relative">
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Product
          </label>

          <button
            onClick={() => setShowProducts((v) => !v)}
            className="
              w-full h-11 px-4 rounded-lg text-left
              border border-stone-300 bg-white
              hover:border-emerald-500
              focus:ring-2 focus:ring-emerald-500/20
              transition
            "
          >
            {selectedProduct
              ? `${selectedProduct.name} (${selectedProduct.unit})`
              : "Select product"}
          </button>

          {showProducts && (
            <div
              className="
                absolute z-50 mt-2 w-full
                max-h-64 overflow-y-auto
                rounded-lg border border-stone-300
                bg-white shadow-xl
              "
            >
              {products.map((p) => (
                <button
                  key={p._id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowProducts(false);
                  }}
                  className="
                    w-full px-4 py-3 text-left
                    hover:bg-stone-50 transition
                  "
                >
                  <p className="text-sm font-medium text-stone-900">
                    {p.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    Unit: {p.unit}
                  </p>
                </button>
              ))}

              {/* ADD PRODUCT — RESTORED */}
              <button
                onClick={() => {
                  setShowAddProduct(true);
                  setShowProducts(false);
                }}
                className="
                  w-full px-4 py-3 text-left
                  text-emerald-600 font-medium
                  hover:bg-emerald-50
                  border-t border-stone-200
                "
              >
                ➕ Add new product
              </button>
            </div>
          )}
        </div>

        {/* Selected Product */}
        {selectedProduct && (
          <div className="flex items-center justify-between rounded-lg border border-stone-300 bg-stone-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-emerald-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {selectedProduct.name}
                </p>
                <p className="text-xs text-stone-500">
                  Unit: {selectedProduct.unit}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-8 w-8 rounded-md border border-stone-300 hover:bg-stone-100"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="h-8 w-8 rounded-md border border-stone-300 hover:bg-stone-100"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Supplier name (optional)"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            className="h-11 px-4 rounded-lg border border-stone-300 text-sm"
          />
          <input
            type="number"
            placeholder="Purchase price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="h-11 px-4 rounded-lg border border-stone-300 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 px-4 rounded-lg border border-stone-300 text-sm"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
        <p className="text-xs text-stone-500">
          Inventory updates instantly
        </p>

        <button
          onClick={addStock}
          disabled={loading}
          className="
            px-6 py-2.5 rounded-lg
            bg-emerald-600 text-white
            font-semibold text-sm
            hover:bg-emerald-700
            disabled:opacity-50
            transition
          "
        >
          {loading ? "Adding…" : "Add Purchase"}
        </button>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddProduct && (
        <AddProductModal
          open={showAddProduct}
          onClose={() => setShowAddProduct(false)}
          units={units}
          products={products}
          onSave={async (payload) => {
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

              const created = res.data?.product ?? res.data;

              setProducts((prev) => [...prev, created]);
              setSelectedProduct(created);

              toast.success("Product added");
              setShowAddProduct(false);
            } catch {
              toast.error("Failed to add product");
            }
          }}
        />
      )}
    </div>
  );
}

