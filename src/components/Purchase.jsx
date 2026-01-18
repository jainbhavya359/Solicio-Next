"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Minus, Package } from "lucide-react";
import { UNITS } from "../utils/store";

export default function Purchase({ visible, preSelectedProduct, reloadSetter, reload }) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress.emailAddress;
  
  const dropdownRef = useRef(null);
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [units, setUnits] = useState(UNITS);
  const [customUnit, setCustomUnit] = useState("");

  const [newProductName, setNewProductName] = useState("");
  const [partyName, setPartyName] = useState("");
  const [newUnit, setNewUnit] = useState("");

  const [loading, setLoading] = useState(false);

  if (!visible) return null;

    const handleCustomUnit = () => {
    const formatted = customUnit.trim();

    if (!formatted) return;

    // Normalize (important)
    const normalized =
      formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();

    // Prevent duplicates
    if (!units.includes(normalized)) {
      setUnits((prev) => [...prev.filter(u => u !== "Custom"), normalized, "Custom"]);
    }

    // Auto-select new unit
    setNewUnit(normalized);
    setCustomUnit("");
  };

  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("click", handler);
    return () =>
      document.removeEventListener("click", handler);
  }, []);

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    if (!email) return;

    if(preSelectedProduct.length != 0){
      setSelectedProduct(preSelectedProduct);
    }
    
    axios
      .get("/api/products", { params: { email } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.products ?? [];

        setProducts(list.filter(p => p?.name && p?.unit));
      })
      .catch(() => toast.error("Failed to load products"));

  }, [email, reload]);

  /* ---------------- Quantity Controls ---------------- */
  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  /* ---------------- Submit Purchase ---------------- */
  const addStock = async () => {
    if (!selectedProduct || price <= 0) {
      toast.error("Select product and enter price");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/stock", {
        email,
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        quantity,
        price,
        sellingPrice,
        partyName,
        date,
        voucher: "Purchase",
      });

      if (res.data.success) {
        toast.success("Purchase added");
        setQuantity(1);
        setPrice("");
        setSellingPrice("");
        setSelectedProduct(null);
      }
    } catch {
      toast.error("Failed to add purchase");
    } finally {
      setLoading(false);
      reloadSetter(!reload);
    }
  };

  return (
    <section className="relative bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <h3 className="text-2xl font-bold text-white mb-1">
        Quick Purchase
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Restock items instantly
      </p>

      {/* Product Selector */}
      <div className="mb-6" ref={dropdownRef}>
        <label className="text-xs text-slate-400 mb-1 block">
          Product
        </label>

        <button
          onClick={() => setShowProducts(v => !v)}
          className="w-full px-5 py-4 rounded-2xl
          bg-black/50 border border-white/10
          text-left text-white
          hover:border-emerald-400 transition"
        >
          {selectedProduct
            ? `${selectedProduct.name} (${selectedProduct.unit})`
            : "Select product"}
        </button>

        {showProducts && (
          <div className="absolute z-50 mt-2 w-full
            rounded-2xl border border-white/10
            bg-slate-900/95 backdrop-blur-xl
            shadow-2xl max-h-64 overflow-auto">

            {products.map((p) => (
              <button
                key={p._id ?? `${p.name}-${p.unit}`}
                onClick={() => {
                  setSelectedProduct(p);
                  setShowProducts(false);
                  setPrice(p.purchasePrice ?? "");
                  setSellingPrice(p.sellingPrice ?? "");
                }}
                className="w-full px-5 py-3 text-left
                hover:bg-white/10 transition"
              >
                <p className="text-white font-medium">{p.name}</p>
                <p className="text-xs text-slate-400">
                  Unit: {p.unit}
                </p>
              </button>
            ))}

            <button
              onClick={() => {
                setShowAddProduct(true);
                setShowProducts(false);
              }}
              className="w-full px-5 py-3 text-left
              text-emerald-400 hover:bg-white/10"
            >
              ➕ Add new product
            </button>
          </div>
        )}
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-white mb-4">
              Add New Product
            </h4>

            <div className="space-y-4">
              <input
                placeholder="Product name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
              />

              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none text-slate-200 focus:border-emerald-400"
              >
                <option value="">Select unit</option>
                {units.map((u) => (
                  <option key={u} value={u} className="bg-slate-900">
                    {u}
                  </option>
                ))}
              </select>

              {newUnit === "Custom" && (
                <input
                  type="text"
                  placeholder="Custom unit"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  onBlur={handleCustomUnit}
                  className="px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                />
              )}

              <input
                type="number"
                placeholder="Selling Price per unit (Optional)"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!newProductName || !newUnit) {
                    toast.error("Fill all fields");
                    return;
                  }

                  try {
                    const res = await axios.post("/api/products", {
                      email,
                      name: newProductName.toLowerCase(),
                      unit: newUnit,
                      sellingPrice,
                    });

                    const created = res.data?.product ?? res.data;

                    if (!created?.name || !created?.unit) {
                      toast.error("Invalid product response");
                      return;
                    }

                    setProducts((prev) => [...prev, created]);
                    setSelectedProduct(created);
                    
                    toast.success("Product added");
                    setShowAddProduct(false);
                    setNewProductName("");
                    setNewUnit("");
                    setSellingPrice("");
                  } catch {
                    toast.error("Failed to add product");
                  }
                }}
                className="px-5 py-2 rounded-lg bg-emerald-400 text-black font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Card */}
      {selectedProduct && (
        <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <Package className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold">
                {selectedProduct.name}
              </p>
              <p className="text-xs text-slate-400">
                Unit: {selectedProduct.unit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={decrement} className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20">
              <Minus />
            </button>
            <span className="w-8 text-center text-white font-bold">
              {quantity}
            </span>
            <button onClick={increment} className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20">
              <Plus />
            </button>
          </div>
        </div>
      )}

      {/* Prices & Date */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Supplier name (optional)"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          className="px-4 py-3 rounded-xl bg-black/40 border border-white/10
          text-white placeholder:text-slate-500"
        />
        <input
          type="number"
          placeholder="Purchase price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
        />

        <div className="rounded-2xl bg-black/40 border border-white/10 p-4
          hover:border-emerald-400 transition">
          <label className="text-xs text-slate-400">
            Purchase Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full bg-transparent text-white text-sm outline-none
            [color-scheme:dark]"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-400">
          Inventory updated instantly
        </p>

        <button
          onClick={addStock}
          disabled={loading}
          className="px-6 py-3 rounded-xl font-bold text-black
          bg-gradient-to-r from-emerald-400 to-teal-400
          disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add Purchase"}
        </button>
      </div>
    </section>
  );
}
