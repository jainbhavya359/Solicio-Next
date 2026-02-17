"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Package, ChevronDown, Sparkles, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import AddProductModal from "./AddProduct";
import DocumentModal from "../documents/DocumentModal";
import { UNITS } from "../../utils/store";

export default function Purchase({
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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProducts, setShowProducts] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [showDocModal, setShowDocModal] = useState(false);
  const [lastVoucherNo, setLastVoucherNo] = useState("");

  const [partyCategory, setPartyCategory] =
    useState<"Individual" | "Company">("Individual");

  const [taxId, setTaxId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [partyState, setPartyState] = useState("");
  const [gstRate, setGstRate] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [partyName, setPartyName] = useState("");
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

    if (preSelectedProduct && preSelectedProduct.length !== 0) {
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

    const payload = {
      email,
      transaction: {
        type: "Purchase",
        date,
      },
      product: {
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        quantity,
        rate: Number(price),
      },
      party: {
        type: "Supplier",
        category: partyCategory,
        name: partyName || "Cash",
        taxId: partyCategory === "Company" ? taxId : undefined,
        state: partyCategory === "Company" ? partyState : undefined,
        paymentTerms: partyCategory === "Company" ? paymentTerms : undefined,
      },
      meta: {
        notes,
        gstRate,
      },
    };

    setLoading(true);
    try {
      const res = await axios.post("/api/stock", payload);
      if (res.data?.success) {
        toast.success("Purchase added");
        setQuantity(1);
        setPrice("");
        setPartyName("");
        setTaxId("");
        setPaymentTerms("");
        setNotes("");
        setSelectedProduct(null);
        reloadSetter(!reload);

        // Instead of redirect, open the modal
        setLastVoucherNo(res.data.voucherNo);
        setShowDocModal(true);
      }
    } catch (error) {
      toast.error("Failed to add purchase");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative z-10 font-outfit">
        {/* Header - StockReport Alignment */}
        <div className="px-8 py-10 border-b border-slate-100 bg-slate-50/30 backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-emerald-200">
            <Layers className="w-3 h-3" />
            Inventory Control
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Quick <span className="text-emerald-600">Purchase</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-2 max-w-2xl">
            Streamlined procurement interface for tactical inventory scaling and capital management.
          </p>
        </div>

        <div className="p-8 space-y-10">
          {/* Product Selector - Label Alignment */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
              Select Strategic Asset
            </label>

            <button
              onClick={() => setShowProducts((v) => !v)}
              className={`
                w-full h-14 px-6 rounded-2xl text-left flex items-center justify-between
                border transition-all duration-300 group
                ${showProducts
                  ? "border-emerald-500 ring-4 ring-emerald-500/10 bg-white shadow-lg"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-sm"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${selectedProduct ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                  <Package className="w-5 h-5" />
                </div>
                <span className={`text-lg font-bold ${selectedProduct ? "text-slate-900" : "text-slate-400"}`}>
                  {selectedProduct
                    ? `${selectedProduct.name} (${selectedProduct.unit})`
                    : "Choose operational asset"}
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${showProducts ? "rotate-180 text-emerald-500" : "group-hover:text-emerald-400"}`} />
            </button>

            <AnimatePresence>
              {showProducts && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  className="
                    absolute z-50 mt-4 w-full
                    max-h-80 overflow-y-auto
                    rounded-[2rem] border border-slate-200
                    bg-white shadow-2xl p-3
                  "
                >
                  <div className="space-y-1">
                    {products.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowProducts(false);
                        }}
                        className="
                          w-full px-5 py-5 text-left rounded-2xl
                          hover:bg-slate-50 transition group flex items-center justify-between
                        "
                      >
                        <div>
                          <p className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {p.name}
                          </p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Unit: {p.unit}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <Plus className="w-5 h-5 text-emerald-500" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowAddProduct(true);
                      setShowProducts(false);
                    }}
                    className="
                      w-full mt-3 px-5 py-5 text-left rounded-2xl
                      text-emerald-600 font-bold text-sm uppercase tracking-widest
                      hover:bg-emerald-50 bg-emerald-50/30
                      border border-dashed border-emerald-200
                      flex items-center gap-4 transition-all
                    "
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    Provision New SKU
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Product Controls */}
          <AnimatePresence mode="wait">
            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between rounded-[2rem] border border-emerald-100 bg-emerald-50/20 px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center shadow-md shadow-emerald-900/5">
                      <Package className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {selectedProduct.name}
                      </p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-0.5">
                        Current Scalability: {quantity}x {selectedProduct.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-emerald-100 shadow-sm">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-11 w-11 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors active:bg-slate-100"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-10 text-center text-2xl font-bold text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-11 w-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 transition-transform active:scale-95 hover:bg-emerald-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction Metadata - Section Header Pattern */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.25em] whitespace-nowrap px-1">Tactical Configuration</span>
              <div className="h-px w-full bg-slate-100" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Legal Category</label>
                <div className="relative">
                  <select
                    value={partyCategory}
                    onChange={e => setPartyCategory(e.target.value as any)}
                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none appearance-none"
                  >
                    <option value="Individual">Personal Entity</option>
                    <option value="Company">Corporate Structure</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Counterparty</label>
                <input
                  placeholder="Supplier Entity"
                  value={partyName}
                  onChange={e => setPartyName(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Unit Capital (₹)</label>
                <input
                  type="number"
                  placeholder="Rate/Unit"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none placeholder:text-slate-300"
                />
              </div>

              {partyCategory === "Company" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="md:col-span-3 grid md:grid-cols-4 gap-6"
                >
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">GSTIN</label>
                    <input
                      placeholder="Tax ID"
                      value={taxId}
                      onChange={e => setTaxId(e.target.value.toUpperCase())}
                      className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">State</label>
                    <input
                      placeholder="Code"
                      value={partyState}
                      onChange={e => setPartyState(e.target.value)}
                      className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Fiscal Rate</label>
                    <div className="relative">
                      <select
                        value={gstRate}
                        onChange={e => setGstRate(Number(e.target.value))}
                        className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 outline-none focus:border-emerald-500 appearance-none focus:bg-white transition-all"
                      >
                        {GST_RATES.map(r => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Settlement</label>
                    <div className="relative">
                      <select
                        value={paymentTerms}
                        onChange={e => setPaymentTerms(e.target.value)}
                        className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 outline-none focus:border-emerald-500 appearance-none focus:bg-white transition-all"
                      >
                        <option value="">Standard Terms</option>
                        {PAYMENT_TERMS.map(p => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Operational Context</label>
                <textarea
                  placeholder="Notes for audit trail..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full h-32 px-6 py-5 rounded-[2rem] border border-slate-200 bg-slate-50/50 font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none placeholder:text-slate-300 resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] pl-1">Posting Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - StockReport Alignment */}
        <div className="px-10 py-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Synchronicity Active</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global inventory impact ready</p>
            </div>
          </div>

          <button
            onClick={addStock}
            disabled={loading}
            className="
              relative group overflow-hidden
              px-12 h-16 rounded-2xl
              bg-slate-900 text-white
              font-extrabold text-sm uppercase tracking-[0.3em]
              hover:bg-emerald-600 active:scale-95
              disabled:opacity-50
              transition-all duration-300 shadow-2xl shadow-slate-900/20
              w-full sm:w-auto
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? "Processing Hub..." : "Execute Purchase"}
              <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                <ChevronDown className="w-3 h-3 -rotate-90" />
              </div>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0" />
          </button>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {showAddProduct && (
          <AddProductModal
            open={showAddProduct}
            onClose={() => setShowAddProduct(false)}
            units={UNITS}
            products={products}
            onSave={async (payload: any) => {
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
                toast.success("Operational Hub Updated");
                setShowAddProduct(false);
              } catch {
                toast.error("Hub Sync Failed");
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* DOCUMENT MODAL */}
      <AnimatePresence>
        {showDocModal && (
          <DocumentModal
            open={showDocModal}
            onClose={() => setShowDocModal(false)}
            voucherNo={lastVoucherNo}
            email={email || ""}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
