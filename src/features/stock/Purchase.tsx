"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Minus, Package, ChevronDown, Sparkles, Layers,
  Box, Fingerprint, Coins, ShieldCheck, Truck, Percent,
  Building2, UserCircle2, FileText, FileUp
} from "lucide-react";
import AddProductModal from "./AddProductForm";
import DocumentModal from "../documents/DocumentModal";
import { UNITS } from "../../utils/store";

const formatIndianNumber = (value: string | number) => {
  if (value === null || value === undefined || value === "") return "";
  const strValue = value.toString().replace(/,/g, "");
  const parts = strValue.split(".");
  if (parts[0] && parts[0] !== "-") {
    parts[0] = Number(parts[0]).toLocaleString('en-IN');
  }
  return parts.join(".");
};

const SectionHeader = ({ icon: Icon, title, description }: any) => (
  <div className="mb-6 border-b border-white/5 pb-4">
    <div className="flex items-center gap-3 mb-1">
      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
        <Icon className="w-4 h-4" />
      </div>
      <h4 className="text-xl font-bold text-white tracking-tight">{title}</h4>
    </div>
    {description && <p className="text-xs text-slate-500 font-medium ml-11">{description}</p>}
  </div>
);

const Toggle = ({ active, onChange, label, description }: any) => (
  <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-colors">
    <div>
      <p className="text-sm font-bold text-white">{label}</p>
      {description && <p className="text-[10px] text-slate-500 mt-1">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}
    >
      <motion.div
        animate={{ x: active ? 24 : 2 }}
        className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder, type = "text", disabled = false, icon, maxLength, onFocus, onKeyDown, className }: any) => (
  <div className="space-y-2 relative flex-grow min-w-0">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold z-10">{icon}</div>}
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "any" : undefined}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none ${disabled ? 'opacity-50 cursor-not-allowed text-slate-500 hover:border-white/10' : ''} ${icon ? 'pl-10' : ''} ${className || ""}`}
      />
    </div>
  </div>
);

const SelectInput = ({ label, value, onChange, options, disabled = false }: any) => (
  <div className="space-y-2 flex-grow min-w-0">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed text-slate-500 hover:border-white/10' : ''}`}
      >
        <option value="" className="bg-slate-900 text-slate-500">Select...</option>
        {options.map((o: any) => (
          <option key={o.value ?? o} value={o.value ?? o} className="bg-slate-900 text-white">
            {o.label ?? o}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  </div>
);

export default function Purchase({
  visible,
  preSelectedProduct,
  reloadSetter,
  reload,
}: any) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const partyRef = useRef<HTMLDivElement | null>(null);

  // Modals & General
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [lastVoucherNo, setLastVoucherNo] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [parties, setParties] = useState<any[]>([]);
  const [showParties, setShowParties] = useState(false);

  // === 1. STRATEGIC HEADER (IDENTITY LAYER) ===
  const [entryType, setEntryType] = useState<"Tax Invoice (B2B)" | "Informal (Cash Memo)">("Tax Invoice (B2B)");
  const [counterparty, setCounterparty] = useState<"B2B" | "Retail">("Retail");
  const [legalCategory, setLegalCategory] = useState<"Corporate" | "Personal">("Personal");
  const [supplyType, setSupplyType] = useState<"Intra-state" | "Inter-state" | "Export">("Intra-state");
  const [referenceNo, setReferenceNo] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState("1");
  const [portCode, setPortCode] = useState("");

  const [partyName, setPartyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [postingDate, setPostingDate] = useState(new Date().toISOString().split("T")[0]);

  // === 2. OPERATIONAL BODY (ASSET LAYER) ===
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [isTaxInclusive, setIsTaxInclusive] = useState(true);
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState<"%" | "₹">("%");
  const [manualBatchEnabled, setManualBatchEnabled] = useState(false);
  const [batchNo, setBatchNo] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);

  // === 3. FINANCIAL SETTLEMENT (FINALITY LAYER) ===
  const [freightCharge, setFreightCharge] = useState("");
  const [freightGstRate, setFreightGstRate] = useState(0);
  const [reverseCharge, setReverseCharge] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // Computed Context Flags
  const isInformal = entryType === "Informal (Cash Memo)";
  const isB2B = counterparty === "B2B";
  const isCorporate = legalCategory === "Corporate";
  const isExport = supplyType === "Export";
  const isService = selectedProduct?.productNature === "service";
  const showExchangeRate = currency !== "INR";

  const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD"];

  // Enforce rigid rules on Identity Layer changes
  useEffect(() => {
    if (isInformal) {
      setCounterparty("Retail");
      setLegalCategory("Personal");
      setTaxId("");
      setPaymentMethod("Cash");
    } else if (isB2B) {
      setLegalCategory("Corporate");
      setPaymentMethod("Credit Terms");
    } else {
      setLegalCategory("Personal");
      setTaxId("");
      setPaymentMethod("Cash");
    }
  }, [counterparty, isInformal]);

  useEffect(() => {
    if (isExport) {
      setCurrency("USD");
      setPaymentMethod("Credit Terms");
    } else {
      setCurrency("INR");
      setExchangeRate("1");
      setPortCode("");
    }
  }, [supplyType, isB2B]);

  // Price adjustment based on mode & product change
  useEffect(() => {
    if (selectedProduct) {
      setTaxRate(selectedProduct.gstRate || 0);
      if (isB2B) {
        setPrice(selectedProduct.purchasePrice?.toString() || "");
        setIsTaxInclusive(selectedProduct.isTaxInclusive ?? false);
      } else {
        setPrice(selectedProduct.mrp?.toString() || selectedProduct.sellingPrice?.toString() || "");
        setIsTaxInclusive(selectedProduct.isTaxInclusive ?? true);
      }
    }
  }, [selectedProduct, isB2B]);

  // Outside Click Listeners
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowProducts(false);
      if (partyRef.current && !partyRef.current.contains(e.target as Node)) setShowParties(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // API Fetches
  useEffect(() => {
    if (!email) return;
    axios.get("/api/parties", { params: { email } }).then((res) => setParties(res.data)).catch(() => { });
    axios.get("/api/products", { params: { email } }).then((res) => {
      const list = Array.isArray(res.data) ? res.data : res.data?.products ?? [];
      setProducts(list);

      // Resolve Pre-selection
      if (typeof preSelectedProduct === "string" && preSelectedProduct.length > 0) {
        const match = list.find((p: any) => p.name.toLowerCase() === preSelectedProduct.toLowerCase());
        if (match) setSelectedProduct(match);
      } else if (preSelectedProduct && typeof preSelectedProduct === "object" && preSelectedProduct.name) {
        setSelectedProduct(list.find((p: any) => p.name === preSelectedProduct.name && p.unit === preSelectedProduct.unit) || preSelectedProduct);
      }
    }).catch(() => toast.error("Failed to load operations framework"));
  }, [email, reload, preSelectedProduct]);

  const filteredParties = parties.filter((p) =>
    p.name.toLowerCase().includes(partyName.toLowerCase()) ||
    (p.gstin && p.gstin.toLowerCase().includes(partyName.toLowerCase()))
  );
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    (p.hsnSac && p.hsnSac.toLowerCase().includes(productSearchQuery.toLowerCase()))
  );

  // === CALCULATIONS ===
  const effectiveRate = Number(price.replace(/,/g, "")) || 0;
  const effectiveQty = quantity || 0;
  const rateFx = showExchangeRate ? (Number(exchangeRate) || 1) : 1;
  const productGstRate = isInformal ? 0 : (isExport ? 0 : taxRate);

  // Exclusive Base Rate computation
  let baseUnitRate = effectiveRate;
  if (isTaxInclusive && productGstRate > 0 && !isInformal) {
    baseUnitRate = effectiveRate / (1 + (productGstRate / 100));
  }

  const baseAmount = effectiveQty * baseUnitRate * rateFx;
  const discountNum = Number(discountValue) || 0;
  const discountAmount = discountType === "%" ? baseAmount * (discountNum / 100) : discountNum * rateFx;

  const taxableAmount = Math.max(0, baseAmount - discountAmount);
  const itemTaxAmount = isInformal ? 0 : (taxableAmount * productGstRate) / 100;

  const freightNum = (Number(freightCharge) || 0) * rateFx;
  const freightTaxAmount = (isExport || isInformal) ? 0 : (freightNum * Number(freightGstRate)) / 100;

  const finalTaxableAmount = taxableAmount + freightNum;
  const totalTaxAmount = itemTaxAmount + freightTaxAmount;

  let cgst = 0, sgst = 0, igst = 0;
  if (!isExport) {
    if (supplyType === "Inter-state") {
      igst = totalTaxAmount;
    } else {
      cgst = totalTaxAmount / 2;
      sgst = totalTaxAmount / 2;
    }
  }

  const rawTotal = finalTaxableAmount + totalTaxAmount;
  const finalSettlementAmount = rawTotal;

  const paidNum = Math.min(Number(amountPaid?.toString().replace(/,/g, "")) || 0, finalSettlementAmount);
  const balanceDue = Math.max(0, finalSettlementAmount - paidNum);
  const showDueDate = (paymentMethod === "Pay Later" || paymentMethod === "Credit Terms") || balanceDue > 0;

  // === EXECUTE PURCHASE ===
  const addStock = async () => {
    if (!selectedProduct || effectiveRate <= 0) {
      toast.error("Asset matrix incomplete or zero valuation.");
      return;
    }

    if (isCorporate && !taxId.trim()) {
      toast.error("Corporate legal framework requires valid GSTIN.");
      return;
    }

    if (isExport && !portCode.trim()) {
      toast.error("Export framework requires valid Port Code mapping.");
      return;
    }

    if (showDueDate && !dueDate) {
      toast.error("A pending balance or credit terms require a Due Date.");
      return;
    }

    const payload = {
      email,
      transaction: {
        type: "Purchase",
        date: postingDate,
        dueDate: showDueDate ? dueDate : undefined,
        referenceNo,
        counterparty,
        supplyType,
        currency,
        exchangeRate: rateFx,
      },
      product: {
        name: selectedProduct.name,
        unit: selectedProduct.unit,
        quantity: effectiveQty,
        rate: effectiveRate,
        isTaxInclusive,
      },
      party: {
        type: "Supplier",
        category: legalCategory,
        name: partyName || "Cash Vendor",
        taxId: isCorporate || isExport ? taxId : undefined,
      },
      meta: {
        entryType,
        portCode: isExport ? portCode : undefined,
        discountValue: discountNum,
        discountType,
        batchNo: (selectedProduct?.isBatchTracked || manualBatchEnabled) ? batchNo : undefined,
        expiryDate: (selectedProduct?.isExpiryTracked || manualBatchEnabled) ? expiryDate : undefined,
        freightCharge: freightNum,
        freightGstRate,
        reverseCharge: isB2B ? reverseCharge : false,
        paymentMethod,
        amountPaid: paidNum,
        balanceDue,
        cgst,
        sgst,
        igst,
        totalAmount: finalSettlementAmount,
        notes,
        gstRate: productGstRate,
      },
    };

    setLoading(true);
    try {
      const res = await axios.post("/api/stock", payload);
      if (res.data?.success) {
        toast.success("Procurement framework committed.");
        // Reset Flow
        setQuantity(1);
        setPrice("");
        setPartyName("");
        setTaxId("");
        setReferenceNo("");
        setNotes("");
        setDiscountValue("");
        setFreightCharge("");
        setFreightGstRate(0);
        setAmountPaid("");
        setAttachment(null);
        setSelectedProduct(null);
        setProductSearchQuery("");
        setManualBatchEnabled(false);
        setTaxRate(0);
        reloadSetter(!reload);
        setLastVoucherNo(res.data.voucherNo);
        setShowDocModal(true);
      }
    } catch (error) {
      toast.error("Failed to commit procurement framework.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_40px_rgba(52,211,153,0.03)]"
    >
      <div className="absolute inset-0 z-0 opacity-[0.2] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative z-10 font-outfit max-h-[85vh] overflow-y-auto">
        <div className="px-5 py-6 sm:px-8 sm:py-8 border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 sm:mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                <Layers className="w-3 h-3" />
                Inventory Control
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Purchase <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">Ledger</span>
              </h1>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Net Settlement</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tabular-nums">
                {currency === "INR" ? "₹" : "$"} {formatIndianNumber(finalSettlementAmount.toFixed(2))}
              </span>
              {balanceDue > 0 && (
                <span className="text-[10px] font-black tracking-[0.2em] text-rose-500 uppercase mt-1">
                  Balance: {currency === "INR" ? "₹" : "$"} {formatIndianNumber(balanceDue.toFixed(2))}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-12">

          {/* === 1. STRATEGIC HEADER (IDENTITY LAYER) === */}
          <section>
            <SectionHeader icon={Fingerprint} title="1. Strategic Header" description="Define counterparty profile, legal framework, and tax locale." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <SelectInput
                  label="Entry Type"
                  value={entryType}
                  onChange={setEntryType}
                  options={["Tax Invoice (B2B)", "Informal (Cash Memo)"]}
                />
              </div>
              <SelectInput
                label="Counterparty Nature"
                value={counterparty}
                onChange={setCounterparty}
                options={["B2B", "Retail"]}
                disabled={isInformal}
              />
              <SelectInput
                label="Legal Category"
                value={legalCategory}
                onChange={setLegalCategory}
                options={["Corporate", "Personal"]}
                disabled={isB2B || isInformal}
              />
              <SelectInput
                label="Place of Supply"
                value={supplyType}
                onChange={setSupplyType}
                options={[
                  { label: "Intra-state (CGST + SGST)", value: "Intra-state" },
                  { label: "Inter-state (IGST)", value: "Inter-state" },
                  { label: "Export (Zero-Rated)", value: "Export" },
                ]}
              />
              <SelectInput
                label="Currency Framework"
                value={currency}
                onChange={setCurrency}
                options={CURRENCIES}
              />

              <div className="lg:col-span-2 relative" ref={partyRef}>
                <TextInput
                  label="Counterparty Subject"
                  value={partyName}
                  onChange={(val: string) => {
                    setPartyName(val);
                    setShowParties(true);
                  }}
                  onFocus={() => setShowParties(true)}
                  placeholder="Eg. Solicio Technologies"
                  icon={isB2B ? <Building2 className="w-4 h-4" /> : <UserCircle2 className="w-4 h-4" />}
                />
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
                              if (p.category) setLegalCategory(p.category === "Company" ? "Corporate" : "Personal");
                              if (p.gstin) setTaxId(p.gstin);
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

              {!isInformal && (isCorporate || isExport) && (
                <TextInput
                  label={isExport ? "Destination Tax ID" : "Local GSTIN"}
                  value={taxId}
                  onChange={(v: string) => setTaxId(v.toUpperCase())}
                  placeholder={isExport ? "Overseas ID" : "15-Digit GSTIN"}
                  maxLength={isExport ? 30 : 15}
                />
              )}

              <TextInput
                label="External Reference #"
                value={referenceNo}
                onChange={setReferenceNo}
                placeholder="Supplier Invoice No."
                icon={<FileText className="w-4 h-4" />}
              />

              {showExchangeRate && (
                <>
                  <TextInput 
                    label="Exchange Rate" 
                    value={exchangeRate} 
                    onChange={(v: string) => {
                      const cleanValue = v.replace(/,/g, "");
                      if (!/^\d*\.?\d*$/.test(cleanValue)) return;
                      if (v === "") setExchangeRate("");
                      else if (cleanValue.endsWith(".")) setExchangeRate(formatIndianNumber(cleanValue) + ".");
                      else setExchangeRate(formatIndianNumber(cleanValue));
                    }} 
                    type="text" 
                  />
                  {isExport && <TextInput label="Port Code" value={portCode} onChange={setPortCode} placeholder="e.g. INNSA1" />}
                </>
              )}
            </div>
          </section>

          {/* === 2. OPERATIONAL BODY (ASSET LAYER) === */}
          <section>
            <SectionHeader icon={Box} title="2. Operational Body" description="Asset selection, logistical attributes, and unit valuation." />

            <div className="grid grid-cols-1 gap-6">

              <div className="relative z-40" ref={dropdownRef}>
                <TextInput
                  label="Asset selector"
                  value={selectedProduct ? `${selectedProduct.name} (${selectedProduct.unit})` : productSearchQuery}
                  onChange={(v: string) => {
                    setProductSearchQuery(v);
                    if (selectedProduct) setSelectedProduct(null);
                    setShowProducts(true);
                  }}
                  onFocus={() => setShowProducts(true)}
                  placeholder="Search and select assets..."
                  icon={<Package className="w-4 h-4" />}
                />
                <AnimatePresence>
                  {showProducts && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute z-50 w-full mt-2 bg-[#0a0a0a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                        {filteredProducts.map((p) => (
                          <div
                            key={p._id}
                            onClick={() => {
                              setSelectedProduct(p);
                              setProductSearchQuery("");
                              setShowProducts(false);
                            }}
                            className="p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{p.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">
                                  Unit: {p.unit}
                                </span>
                                {p.productNature === "service" && (
                                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black text-amber-400 bg-amber-400/10 uppercase border border-amber-400/20">Service Nature</span>
                                )}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-4 h-4 text-emerald-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-t border-white/5 bg-black/40">
                        <button
                          onClick={() => { setShowAddProduct(true); setShowProducts(false); setProductSearchQuery(""); }}
                          className="w-full py-2.5 rounded-xl text-emerald-400 font-bold text-xs uppercase tracking-widest hover:bg-emerald-500/10 bg-emerald-500/5 border border-dashed border-emerald-500/30 flex items-center justify-center gap-2 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Provision New Matrix
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {selectedProduct && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <div className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                      <div className="md:col-span-2 lg:col-span-2 p-1 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <Toggle active={isTaxInclusive} onChange={setIsTaxInclusive} label="Tax Inclusive Pricing" description="Unit rate provided already includes respective GST components within its value." />
                      </div>
                      {!isInformal && (
                        <div className="md:col-span-2 lg:col-span-2">
                          <SelectInput
                            label="Commodity Tax Band (GST %)"
                            value={taxRate}
                            onChange={(v: string) => setTaxRate(Number(v))}
                            options={[
                              { label: "0% Regimen", value: 0 },
                              { label: "5% Regimen", value: 5 },
                              { label: "12% Regimen", value: 12 },
                              { label: "18% Regimen", value: 18 },
                              { label: "28% Regimen", value: 28 }
                            ]}
                          />
                        </div>
                      )}

                      {!isService && (
                        <div className="flex flex-col gap-2 relative">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Volume Scale ({selectedProduct?.unit})
                          </label>
                          <div className="flex items-center justify-between h-12 bg-black/60 rounded-2xl border border-white/10 px-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 transition-colors">
                              <Minus size={16} />
                            </button>
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tabular-nums">{quantity}</span>
                            <button onClick={() => setQuantity((q) => q + 1)} className="h-8 w-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all active:scale-95">
                              <Plus size={16} className="stroke-[3]" />
                            </button>
                          </div>
                        </div>
                      )}

                      <TextInput 
                        label="Unit Value" 
                        value={price} 
                        onChange={(v: string) => {
                          const cleanValue = v.replace(/,/g, "");
                          if (!/^\d*\.?\d*$/.test(cleanValue)) return;
                          if (v === "") setPrice("");
                          else if (cleanValue.endsWith(".")) setPrice(formatIndianNumber(cleanValue) + ".");
                          else setPrice(formatIndianNumber(cleanValue));
                        }} 
                        type="text" 
                        placeholder="0.00" 
                        icon={currency === "INR" ? "₹" : "$"} 
                      />

                      <div className="space-y-2 relative flex flex-col justify-end">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Yield Discount</label>
                        <div className="flex h-12">
                          <select
                            value={discountType}
                            onChange={e => setDiscountType(e.target.value as any)}
                            className="bg-black/60 border border-white/10 border-r-0 rounded-l-2xl px-4 font-bold text-white outline-none cursor-pointer hover:bg-white/5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 z-10 appearance-none text-center w-[70px]"
                          >
                            <option value="%">%</option>
                            <option value="₹">Fixed</option>
                          </select>
                          <input
                            type="text"
                            value={discountValue}
                            onChange={(e) => {
                              const v = e.target.value;
                              const cleanValue = v.replace(/,/g, "");
                              if (!/^\d*\.?\d*$/.test(cleanValue)) return;
                              if (v === "") setDiscountValue("");
                              else if (cleanValue.endsWith(".")) setDiscountValue(formatIndianNumber(cleanValue) + ".");
                              else setDiscountValue(formatIndianNumber(cleanValue));
                            }}
                            placeholder="0.00"
                            className="w-full bg-black/40 border border-white/10 rounded-r-2xl px-4 font-bold text-white placeholder:text-slate-600 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* HSN Read Only display */}
                      {selectedProduct?.hsnSac && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">HSN/SAC Code</label>
                          <div className="h-12 w-full rounded-2xl border border-white/5 bg-white/5 px-4 text-sm font-bold text-slate-400 flex items-center cursor-not-allowed">
                            {selectedProduct.hsnSac}
                          </div>
                        </div>
                      )}

                      {/* Contingent Tracking fields based on Product flags */}
                      <div className="md:col-span-2 lg:col-span-4">
                        <Toggle
                          active={manualBatchEnabled || selectedProduct?.isBatchTracked}
                          onChange={(v: boolean) => {
                            if (!selectedProduct?.isBatchTracked) {
                              setManualBatchEnabled(v);
                            }
                          }}
                          label="Enable Batch/Serial Tracking"
                          description={selectedProduct?.isBatchTracked ? "Hard-enforced by asset matrix." : "Optionally declare logistical tracing variables."}
                        />
                      </div>

                      {(manualBatchEnabled || selectedProduct?.isBatchTracked) && !isService && (
                        <>
                          <TextInput label="Batch Sequence/Serial #" value={batchNo} onChange={setBatchNo} placeholder="Lot-XYZ" />
                          <TextInput label="Expiry Threshold Date" value={expiryDate} onChange={setExpiryDate} type="date" />
                        </>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* === 3. FINANCIAL SETTLEMENT (FINALITY LAYER) === */}
          <section>
            <SectionHeader icon={Coins} title="3. Financial Settlement" description="Tax summary, settlement mapping, and execution bounds." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SelectInput
                label="Payment Matrix"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={["Cash", "Bank Transfer", "UPI", "Credit Card", "Pay Later", "Credit Terms"]}
              />
              <TextInput label="Posting Date" value={postingDate} onChange={setPostingDate} type="date" />
              {showDueDate && (
                <TextInput label="Target Due Date" value={dueDate} onChange={setDueDate} type="date" />
              )}

              <TextInput
                label={isService ? "Convenience Fee" : "Logistics / Freight Amount"}
                value={freightCharge}
                onChange={(v: string) => {
                  const cleanValue = v.replace(/,/g, "");
                  if (!/^\d*\.?\d*$/.test(cleanValue)) return;
                  if (v === "") setFreightCharge("");
                  else if (cleanValue.endsWith(".")) setFreightCharge(formatIndianNumber(cleanValue) + ".");
                  else setFreightCharge(formatIndianNumber(cleanValue));
                }}
                type="text"
                placeholder="0.00"
                icon={currency === "INR" ? "₹" : "$"}
              />

              {Number(freightCharge) > 0 && !isExport && !isInformal && (
                <SelectInput
                  label="Freight GST Bracket"
                  value={freightGstRate}
                  onChange={(v: string) => setFreightGstRate(Number(v))}
                  options={[
                    { label: "0% GST", value: 0 },
                    { label: "5% GST", value: 5 },
                    { label: "12% GST", value: 12 },
                    { label: "18% GST", value: 18 }
                  ]}
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-1 border-r-0 lg:border-r border-white/5 pr-0 lg:pr-6 space-y-6">
                <TextInput
                  label="Amount Paid"
                  value={amountPaid}
                  onChange={(v: string) => {
                    const cleanValue = v.replace(/,/g, "");
                    if (!/^\d*\.?\d*$/.test(cleanValue)) return;
                    const num = Number(cleanValue) || 0;
                    if (num > finalSettlementAmount) {
                      setAmountPaid(formatIndianNumber(finalSettlementAmount));
                    } else if (v === "") {
                      setAmountPaid("");
                    } else if (cleanValue.endsWith(".")) {
                      setAmountPaid(formatIndianNumber(cleanValue) + ".");
                    } else {
                      setAmountPaid(formatIndianNumber(cleanValue));
                    }
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key.startsWith("Arrow")) {
                      e.preventDefault();
                      setAmountPaid(formatIndianNumber(finalSettlementAmount));
                    }
                  }}
                  type="text"
                  placeholder="0.00"
                  icon={currency === "INR" ? "₹" : "$"}
                />

                {isB2B && (
                  <div className="w-full">
                    <Toggle active={reverseCharge} onChange={setReverseCharge} label="Reverse Charge (RCM)" description="Liability transfers to recipient." />
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Document Attachments</label>
                <div className="relative h-20 w-full rounded-2xl border border-dashed border-white/20 bg-black/40 hover:bg-white/5 hover:border-emerald-500/50 transition-all flex items-center justify-center cursor-pointer overflow-hidden group">
                  <input type="file" onChange={(e) => setAttachment(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*,.pdf" />
                  <div className="flex items-center gap-3 text-slate-500 group-hover:text-emerald-400 transition-colors">
                    <FileUp className="w-6 h-6" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{attachment ? attachment.name : "Upload Audit Source (PDF/Image)"}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">Max Size: 5MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Architectural Memo</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Record transactional directives..."
                  className="w-full h-32 px-6 py-5 rounded-[2rem] border border-white/10 bg-black/40 font-medium text-sm text-white focus:bg-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none placeholder:text-slate-600 resize-none"
                />
              </div>

              <div className="p-6 rounded-[2.5rem] bg-black/60 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col justify-center">
                <div className="space-y-3 font-medium text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Taxable Foundation</span>
                    <span className="font-bold text-white">{formatIndianNumber(finalTaxableAmount.toFixed(2))}</span>
                  </div>

                  {isInformal ? (
                    <div className="flex justify-between text-slate-500 font-bold">
                      <span>Tax Bracket (Informal)</span>
                      <span>0.00</span>
                    </div>
                  ) : isExport ? (
                    <div className="flex justify-between text-amber-500/80 font-bold">
                      <span>Export Compliance (Zero-Rated)</span>
                      <span>0.00</span>
                    </div>
                  ) : (
                    <>
                      {supplyType === "Inter-state" ? (
                        <div className="flex justify-between text-emerald-500/80">
                          <span>Integrated Tax (IGST)</span>
                          <span>{formatIndianNumber(igst.toFixed(2))}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between text-emerald-500/80">
                            <span>Central Tax (CGST)</span>
                            <span>{formatIndianNumber(cgst.toFixed(2))}</span>
                          </div>
                          <div className="flex justify-between text-emerald-500/80">
                            <span>State Tax (SGST)</span>
                            <span>{formatIndianNumber(sgst.toFixed(2))}</span>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <div className="my-4 h-px border-t border-dashed border-white/10" />

                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-black text-white text-base">Final Execution Net</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-t from-emerald-600 to-emerald-400 tabular-nums">
                      {currency === "INR" ? "₹" : "$"} {formatIndianNumber(finalSettlementAmount.toFixed(2))}
                    </span>
                  </div>
                  {balanceDue > 0 && (
                    <div className="flex justify-between items-center py-2 px-3 bg-rose-500/10 rounded-xl border border-rose-500/20 mt-3">
                      <span className="font-bold text-rose-400 text-xs tracking-widest uppercase">Balance Pending</span>
                      <span className="text-lg font-black text-rose-500 tabular-nums">
                        {currency === "INR" ? "₹" : "$"} {formatIndianNumber(balanceDue.toFixed(2))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* === EXECUTION FOOTER === */}
        <div className="px-5 py-6 sm:px-10 sm:py-8 border-t border-white/5 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md sticky bottom-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">Settlement Matrix Armed</p>
              <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">Awaiting execution command</p>
            </div>
          </div>

          <button
            onClick={addStock}
            disabled={loading}
            className="w-full sm:w-auto relative group overflow-hidden px-12 h-16 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-[0.3em] hover:bg-emerald-400 active:scale-95 disabled:opacity-20 disabled:shadow-none transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] flex items-center justify-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-3">
              {loading ? "Validating..." : "Execute Purchase"}
              <div className="w-6 h-6 rounded bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <ChevronDown className="w-4 h-4 -rotate-90 stroke-[3]" />
              </div>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddProduct && (
          <AddProductModal
            open={showAddProduct}
            onClose={() => setShowAddProduct(false)}
            units={UNITS}
            products={products}
            onSave={async (payload: any) => {
              try {
                if (payload._id) {
                  await axios.put("/api/products", { email, ...payload });
                  toast.success("Product Updated");
                } else {
                  await axios.post(
                    payload.productType === "simple" ? "/api/products" : "/api/composite-product",
                    { email, ...payload }
                  );
                  toast.success("Product Created");
                }
                setShowAddProduct(false);
                reloadSetter(!reload);
              } catch (error) {
                toast.error("Operation Failed");
              }
            }}
          />
        )}
        {showDocModal && <DocumentModal open={showDocModal} onClose={() => setShowDocModal(false)} voucherNo={lastVoucherNo} email={email || ""} />}
      </AnimatePresence>
    </motion.div>
  );
}
