"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Package, ChevronDown, Sparkles, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import AddProductModal from "./AddProductForm";
import DocumentModal from "../documents/DocumentModal";
import { UNITS } from "../../utils/store";

const formatIndianNumber = (value: string | number) => {
  if (value === null || value === undefined || value === "") return "";
  const strValue = value.toString();
  const parts = strValue.split(".");
  if (parts[0] && parts[0] !== "-") {
    parts[0] = Number(parts[0]).toLocaleString('en-IN');
  }
  return parts.join(".");
};

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

  // Party Auto-complete states
  const [parties, setParties] = useState<any[]>([]);
  const [showParties, setShowParties] = useState(false);
  const partyRef = useRef<HTMLDivElement | null>(null);

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
      if (partyRef.current && !partyRef.current.contains(e.target as Node)) {
        setShowParties(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Fetch Parties ---------------- */
  useEffect(() => {
    if (!email) return;
    axios
      .get("/api/parties", { params: { email } })
      .then((res) => setParties(res.data))
      .catch((err) => console.error("Failed to load parties", err));
  }, [email]);

  const filteredParties = parties.filter((p) =>
    p.name.toLowerCase().includes(partyName.toLowerCase())
  );

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    if (!email) return;

    axios
      .get("/api/products", { params: { email } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.products ?? [];
        setProducts(list);

        // Resolve string preselection
        if (typeof preSelectedProduct === "string" && preSelectedProduct.length > 0) {
          const match = list.find((p: any) => p.name.toLowerCase() === preSelectedProduct.toLowerCase());
          if (match) {
            setSelectedProduct(match);
            setPrice(match.purchasePrice?.toString() ?? match.sellingPrice?.toString() ?? "");
            setGstRate(match.gstRate ?? 0);
          }
        }
        // Resolve object preselection
        else if (preSelectedProduct && typeof preSelectedProduct === "object" && preSelectedProduct.name) {
          setSelectedProduct(preSelectedProduct);
          setPrice(preSelectedProduct.purchasePrice?.toString() ?? preSelectedProduct.sellingPrice?.toString() ?? "");
          // Look up full product from the fetched list to get gstRate,
          // since preSelectedProduct (from StockReport) may not include it.
          const fullMatch = list.find((p: any) =>
            p.name?.toLowerCase() === preSelectedProduct.name?.toLowerCase() &&
            p.unit === preSelectedProduct.unit
          );
          setGstRate(fullMatch?.gstRate ?? preSelectedProduct.gstRate ?? 0);
        }
      })
      .catch(() => toast.error("Failed to load products"));
  }, [email, reload, preSelectedProduct]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d*$/.test(raw)) {
      setPrice(raw);
    }
  };

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
      className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(52,211,153,0.03)]"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.2] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative z-10 font-outfit">
        {/* Header - StockReport Alignment */}
        <div className="px-5 py-6 sm:px-8 sm:py-10 border-b border-white/5 bg-white/5 backdrop-blur-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 sm:mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <Layers className="w-3 h-3" />
            Inventory Control
          </div>
          <div className="hidden sm:block">
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Quick <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">Purchase</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium mt-2 max-w-2xl">
              Streamlined procurement interface for tactical inventory scaling and capital management.
            </p>
          </div>
          {/* Mobile Title */}
          <h1 className="block sm:hidden text-2xl font-bold text-white tracking-tight">
            Quick <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">Purchase</span>
          </h1>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-10">
          {/* Product Selector - Label Alignment */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 sm:mb-3 px-1">
              Select Strategic Asset
            </label>

            <button
              onClick={() => setShowProducts((v) => !v)}
              className={`
                w-full h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-left flex items-center justify-between
                border transition-all duration-300 group outline-none
                ${showProducts
                  ? "border-emerald-500 ring-4 ring-emerald-500/20 bg-white/5 shadow-[0_0_30px_rgba(52,211,153,0.1)]"
                  : "border-white/10 bg-black/40 hover:bg-white/5 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(52,211,153,0.05)]"
                }
              `}
            >
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ${selectedProduct ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`text-base sm:text-lg font-bold truncate ${selectedProduct ? "text-white" : "text-slate-500"}`}>
                  {selectedProduct
                    ? `${selectedProduct.name} (${selectedProduct.unit})`
                    : "Choose operational asset"}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transition-transform duration-300 shrink-0 ${showProducts ? "rotate-180 text-emerald-500" : "group-hover:text-emerald-400"}`} />
            </button>

            <AnimatePresence>
              {showProducts && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  className="
                    absolute z-50 mt-2 sm:mt-4 w-full
                    max-h-80 overflow-y-auto
                    rounded-2xl sm:rounded-[2rem] border border-white/10
                    bg-[#0a0a0a] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-2 sm:p-3
                    backdrop-blur-xl
                  "
                >
                  <div className="space-y-1">
                    {products.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowProducts(false);
                          setQuantity(1);
                          setPrice(p.purchasePrice?.toString() ?? p.sellingPrice?.toString() ?? "");
                          setGstRate(p.gstRate ?? 0);
                        }}
                        className="
                          w-full px-4 sm:px-5 py-4 sm:py-5 text-left rounded-xl sm:rounded-2xl
                          hover:bg-white/5 transition-all group flex items-center justify-between
                        "
                      >
                        <div>
                          <p className="text-sm sm:text-base font-bold text-slate-300 group-hover:text-white transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[10px] sm:text-xs font-black text-emerald-500/70 uppercase tracking-wider mt-1 group-hover:text-emerald-400">
                            Unit: {p.unit}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <Plus className="w-5 h-5 text-emerald-400" />
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
                      w-full mt-2 sm:mt-3 px-4 sm:px-5 py-4 sm:py-5 text-left rounded-xl sm:rounded-2xl
                      text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-widest
                      hover:bg-emerald-500/10 bg-emerald-500/5
                      border border-dashed border-emerald-500/30
                      flex items-center gap-4 transition-all
                    "
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl sm:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-4 sm:px-8 sm:py-6 gap-4 sm:gap-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <Package className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-base sm:text-xl font-bold text-white tracking-tight">
                        {selectedProduct.name}
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-0.5 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">
                        Current Scalability: {quantity}x {selectedProduct.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 bg-black/60 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] self-end sm:self-auto">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-500 transition-colors active:bg-white/10"
                    >
                      <Minus size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <span className="w-8 sm:w-12 text-center text-xl sm:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all active:scale-95 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
                    >
                      <Plus size={18} className="sm:w-5 sm:h-5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction Metadata - Section Header Pattern */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.25em] whitespace-nowrap px-1">Tactical Configuration</span>
              <div className="h-px w-full bg-white/5 border-t border-dashed border-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Legal Category</label>
                <div className="relative">
                  <select
                    value={partyCategory}
                    onChange={e => setPartyCategory(e.target.value as any)}
                    className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white focus:bg-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none appearance-none"
                  >
                    <option value="Individual" className="bg-slate-900">Personal Entity</option>
                    <option value="Company" className="bg-slate-900">Corporate Structure</option>
                  </select>
                  <ChevronDown className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 relative" ref={partyRef}>
                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Counterparty</label>
                <input
                  placeholder="Supplier Entity"
                  value={partyName}
                  onChange={(e) => {
                    setPartyName(e.target.value);
                    setShowParties(true);
                  }}
                  onFocus={() => setShowParties(true)}
                  className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white focus:bg-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none placeholder:text-slate-600"
                />

                {/* 🔽 Auto-complete Dropdown */}
                <AnimatePresence>
                  {showParties && partyName.trim() && filteredParties.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute z-50 w-full mt-2 bg-[#0a0a0a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                        {filteredParties.map((p) => (
                          <div
                            key={p._id}
                            onClick={() => {
                              setPartyName(p.name);
                              if (p.category) setPartyCategory(p.category);
                              if (p.gstin) setTaxId(p.gstin);
                              if (p.state) setPartyState(p.state);
                              if (p.paymentTerms) setPaymentTerms(p.paymentTerms);
                              setShowParties(false);
                            }}
                            className="p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{p.name}</p>
                              {p.gstin && <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mt-1">GSTIN: {p.gstin}</p>}
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-4 h-4 text-emerald-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Unit Capital (₹)</label>
                <input
                  type="text"
                  placeholder="Rate/Unit"
                  value={formatIndianNumber(price)}
                  onChange={handlePriceChange}
                  className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white focus:bg-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Always-visible Fiscal Rate */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Fiscal Rate (GST)</label>
                <div className="relative">
                  <select
                    value={gstRate}
                    onChange={e => setGstRate(Number(e.target.value))}
                    className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white outline-none focus:border-emerald-500 appearance-none focus:bg-white/5 transition-all"
                  >
                    {GST_RATES.map(r => (
                      <option key={r.value} value={r.value} className="bg-slate-900">
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50 pointer-events-none" />
                </div>
              </div>

              {partyCategory === "Company" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">GSTIN</label>
                    <input
                      placeholder="Tax ID"
                      value={taxId}
                      onChange={e => setTaxId(e.target.value.toUpperCase())}
                      className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white outline-none focus:border-emerald-500 focus:bg-white/5 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">State</label>
                    <input
                      placeholder="Code"
                      value={partyState}
                      onChange={e => setPartyState(e.target.value)}
                      className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white outline-none focus:border-emerald-500 focus:bg-white/5 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Settlement</label>
                    <div className="relative">
                      <select
                        value={paymentTerms}
                        onChange={e => setPaymentTerms(e.target.value)}
                        className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white outline-none focus:border-emerald-500 appearance-none focus:bg-white/5 transition-all"
                      >
                        <option value="" className="bg-slate-900">Standard Terms</option>
                        {PAYMENT_TERMS.map(p => (
                          <option key={p.value} value={p.value} className="bg-slate-900">
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50 pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="md:col-span-2 space-y-2 sm:space-y-3">
                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Operational Context</label>
                <textarea
                  placeholder="Notes for audit trail..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full h-24 sm:h-32 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] border border-white/10 bg-black/40 font-medium text-sm sm:text-base text-white focus:bg-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none placeholder:text-slate-600 resize-none"
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Posting Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 font-bold text-sm sm:text-base text-white focus:bg-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none [color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - StockReport Alignment */}
        <div className="px-5 py-6 sm:px-10 sm:py-10 border-t border-white/5 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight">Synchronicity Active</p>
              <p className="text-[9px] sm:text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">Global inventory impact ready</p>
            </div>
          </div>

          <button
            onClick={addStock}
            disabled={loading}
            className="
              relative group overflow-hidden
              px-8 sm:px-12 h-14 sm:h-16 rounded-xl sm:rounded-2xl
              bg-emerald-500 text-slate-950
              font-black text-xs sm:text-sm uppercase tracking-[0.3em]
              hover:bg-emerald-400 active:scale-95
              disabled:opacity-20 disabled:shadow-none
              transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]
              w-full sm:w-auto
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? "Processing..." : "Execute Purchase"}
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <ChevronDown className="w-3 h-3 -rotate-90 stroke-[3]" />
              </div>
            </span>
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
