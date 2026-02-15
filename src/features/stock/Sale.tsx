"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Minus, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sale({
  visible,
  preSelectedProduct,
  reloadSetter,
  reload,
}: any) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const [partyCategory, setPartyCategory] =
    useState<"Individual" | "Company">("Individual");

  const [taxId, setTaxId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [partyState, setPartyState] = useState("");
  const [gstRate, setGstRate] = useState(0);

  const [partyName, setPartyName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);

    const GST_RATES = [
    { label: "No GST", value: 0 },
    { label: "GST 5%", value: 5 },
    { label: "GST 12%", value: 12 },
    { label: "GST 18%", value: 18 },
    { label: "GST 28%", value: 28 },
  ];

  const PAYMENT_TERMS = [
    { label: "Immediate", value: "IMMEDIATE" },
    { label: "Net 7", value: "NET_7" },
    { label: "Net 15", value: "NET_15" },
    { label: "Net 30", value: "NET_30" },
  ];

  if (!visible) return null;

  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    if (!email) return;

    if (preSelectedProduct && Object.keys(preSelectedProduct).length) {
      setSelectedProduct(preSelectedProduct);
    }

    axios
      .get("/api/products", { params: { email } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

        setProducts(list.filter((p:any) => p?.name && p?.unit));
      })
      .catch(() => toast.error("Failed to load products"));
  }, [email, reload, preSelectedProduct]);

  /* ---------------- Quantity Controls ---------------- */
  const increment = () => {
    if (!selectedProduct) return;

    const maxQty =
      selectedProduct.availableQty ?? selectedProduct.quantity ?? 0;

    setQuantity(q => {
      if (q >= maxQty) {
        toast.error("Not enough stock");
        return q;
      }
      return q + 1;
    });
  };

  const decrement = () =>
    setQuantity(q => (q > 1 ? q - 1 : 1));

  /* ---------------- Submit Sale ---------------- */
  const removeStock = async () => {
    if (!selectedProduct || Number(price) <= 0) {
      toast.error("Select product and enter price");
      return;
    }

    const payload = {
      email,

      transaction: {
        type: "Sale",
        date,
      },

      product: {
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        quantity,
        rate: Number(price),
      },

      party: {
        type: "Customer",
        category: partyCategory,
        name: partyName || "Cash",
        taxId: partyCategory === "Company" ? taxId : undefined,
        state: partyCategory === "Company" ? partyState : undefined,
        paymentTerms:
          partyCategory === "Company" ? paymentTerms : undefined,
      },

      meta: {
        notes,
        gstRate,
      },
    };


    setLoading(true);
    try {
      const res = await axios.post("/api/sellStock", payload);

      if (res.data?.success) {
        toast.success("Sale recorded");
        setQuantity(1);
        setPrice("");
        setPartyName("");
        setTaxId("");
        setPaymentTerms("");
        setNotes("");
        setSelectedProduct(null);
        reloadSetter(!reload);

        router.push(`/invoice/${res.data.voucherNo}`);
      }
    } catch {
      toast.error("Failed to record sale");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <h3 className="text-xl font-bold text-stone-900">
        Quick Sale
      </h3>
      <p className="text-sm text-stone-500 mb-6">
        Click to sell items from stock
      </p>

      {/* Product Selector */}
      <div className="mb-6 relative" ref={dropdownRef}>
        <label className="text-xs text-stone-500 mb-1 block">
          Product
        </label>

        <button
          onClick={() => setShowProducts(v => !v)}
          className="
            w-full h-12 px-4 rounded-lg border border-stone-300
            bg-white text-left text-stone-900
            hover:border-rose-400 transition
          "
        >
          {selectedProduct
            ? `${selectedProduct.name} (${selectedProduct.unit})`
            : "Select product"}
        </button>

        {showProducts && (
          <div
            className="
              absolute left-0 right-0 z-50 mt-2
              max-h-64 overflow-y-auto overflow-x-hidden
              rounded-lg border border-stone-200 bg-white shadow-lg
            "
          >
            {products.map(p => {
              const stock =
                p.availableQty ?? p.quantity ?? 0;

              const outOfStock = stock <= 0;

              return (
                <button
                  key={p._id}
                  disabled={outOfStock}
                  onClick={() => {
                    setSelectedProduct(p);
                    setPrice(p.sellingPrice ?? "");
                    setQuantity(1);
                    setShowProducts(false);
                  }}
                  className={`
                    w-full px-4 py-3 text-left flex justify-between items-center
                    hover:bg-stone-50 transition
                    ${outOfStock ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  <div>
                    <p className="font-medium text-stone-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      Unit: {p.unit}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      outOfStock
                        ? "text-rose-500"
                        : stock <= 5
                        ? "text-amber-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {outOfStock ? "Out of stock" : `${stock} left`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Product Card */}
      {selectedProduct && (
        <div className="flex justify-between items-center
          border border-stone-200 rounded-xl p-4 mb-6 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <Package className="text-rose-600" size={18} />
            </div>
            <div>
              <p className="font-semibold text-stone-900">
                {selectedProduct.name}
              </p>
              <p className="text-xs text-stone-500">
                Unit: {selectedProduct.unit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              className="h-9 w-9 rounded-lg border border-stone-300"
            >
              <Minus size={16} />
            </button>

            <span className="w-8 text-center font-semibold">
              {quantity}
            </span>

            <button
              onClick={increment}
              className="h-9 w-9 rounded-lg border border-stone-300"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Inputs */}
      {/* Party Details */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
      {/* Party Category */}
      <select
        value={partyCategory}
        onChange={e => setPartyCategory(e.target.value as any)}
        className="h-11 px-3 rounded-lg border border-stone-300"
      >
        <option value="Individual">Individual (B2C)</option>
        <option value="Company">Company (B2B)</option>
      </select>

      {/* Party Name */}
      <input
        placeholder="Customer name"
        value={partyName}
        onChange={e => setPartyName(e.target.value)}
        className="h-11 px-4 rounded-lg border border-stone-300"
      />

      {partyCategory === "Company" && (
        <>
          {/* GSTIN */}
          <input
            placeholder="GSTIN (15 characters)"
            value={taxId}
            onChange={e => setTaxId(e.target.value.toUpperCase())}
            className="h-11 px-4 rounded-lg border border-stone-300"
          />

          {/* State */}
          <input
            placeholder="State (e.g. Maharashtra)"
            value={partyState}
            onChange={e => setPartyState(e.target.value)}
            className="h-11 px-4 rounded-lg border border-stone-300"
          />

          {/* GST Rate */}
          <select
            value={gstRate}
            onChange={e => setGstRate(Number(e.target.value))}
            className="h-11 px-3 rounded-lg border border-stone-300"
          >
            {GST_RATES.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Payment Terms */}
          <select
            value={paymentTerms}
            onChange={e => setPaymentTerms(e.target.value)}
            className="h-11 px-3 rounded-lg border border-stone-300"
          >
            <option value="">Payment terms</option>
            {PAYMENT_TERMS.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Notes */}
      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="md:col-span-2 h-20 px-4 py-2 rounded-lg border border-stone-300"
      />
    </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="Selling price per unit (₹)"
          value={price}
          min={0}
          onChange={e => setPrice(e.target.value)}
          className="h-11 px-4 rounded-lg border border-stone-300"
        />

        <div className="md:col-span-2">
          <label className="text-xs text-stone-500 block mb-1">
            Sale Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="h-11 w-full px-4 rounded-lg border border-stone-300"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-stone-500">
          Stock & revenue updated instantly
        </p>

        <button
          onClick={removeStock}
          disabled={loading}
          className="
            px-6 py-3 rounded-xl font-semibold text-white
            bg-rose-600 hover:bg-rose-700
            disabled:opacity-50
          "
        >
          {loading ? "Processing…" : "Add Sale"}
        </button>
      </div>
    </section>
  );
}
