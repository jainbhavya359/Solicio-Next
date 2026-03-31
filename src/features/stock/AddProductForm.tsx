"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, X, ChevronRight, Layers, Box, Fingerprint, 
  ShieldCheck, Coins, Truck, Settings2 
} from "lucide-react";
import RecipeBuilder from "./RecipeBuilder";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
  units?: string[];
  products?: any[];
  initialData?: any;
}

const SectionHeader = ({ icon: Icon, title, description }: any) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
        <Icon className="w-4 h-4" />
      </div>
      <h4 className="text-lg font-bold text-white tracking-tight">{title}</h4>
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
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}
    >
      <motion.div 
        animate={{ x: active ? 24 : 2 }} 
        className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder, type = "text", disabled = false, icon }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{icon}</div>}
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "any" : undefined}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

const SelectInput = ({ label, value, onChange, options, disabled = false }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed text-slate-500' : ''}`}
      >
        <option value="" className="bg-slate-900 text-slate-500">Select...</option>
        {options.map((o: any) => (
          <option key={o.value || o} value={o.value || o} className="bg-slate-900 text-white">
            {o.label || o}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/50">
        <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </div>
  </div>
);

export default function AddProductFormModal({
  open,
  onClose,
  onSave,
  units = [],
  products = [],
  initialData,
}: AddProductModalProps) {
  // 1. Identity
  const [name, setName] = useState(initialData?.name || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [barcode, setBarcode] = useState(initialData?.barcode || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [unit, setUnit] = useState(initialData?.unit || "");
  const [customUnit, setCustomUnit] = useState("");

  // 2. Compliance
  const [productNature, setProductNature] = useState<"goods" | "service">(initialData?.productNature || "goods");
  const [hsnSac, setHsnSac] = useState(initialData?.hsnSac || "");
  const [taxability, setTaxability] = useState<"taxable" | "exempt" | "nil-rated" | "non-gst">(initialData?.taxability || "taxable");

  // 3. Financial
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || "");
  const [sellingPrice, setSellingPrice] = useState(initialData?.sellingPrice || "");
  const [mrp, setMrp] = useState(initialData?.mrp || "");
  const [isTaxInclusive, setIsTaxInclusive] = useState<boolean>(initialData?.isTaxInclusive ?? true);
  const [gstRate, setGstRate] = useState<number>(initialData?.gstRate ?? 0);

  // 4. Logistics
  const [openingStock, setOpeningStock] = useState(initialData?.quantity || "");
  const [minStock, setMinStock] = useState(initialData?.lowStockConfig?.minQty || "");
  const [isBatchTracked, setIsBatchTracked] = useState<boolean>(initialData?.isBatchTracked || false);
  const [isExpiryTracked, setIsExpiryTracked] = useState<boolean>(initialData?.isExpiryTracked || false);

  // 5. Structure
  const [productType, setProductType] = useState<"simple" | "composite">(initialData?.productType || "simple");
  const [recipe, setRecipe] = useState<any[]>(initialData?.recipe || []);

  const isEditing = !!initialData;

  const GST_RATES = [
    { label: "No GST", value: 0 },
    { label: "GST 5%", value: 5 },
    { label: "GST 12%", value: 12 },
    { label: "GST 18%", value: 18 },
    { label: "GST 28%", value: 28 },
  ];

  const TAXABILITY_OPTIONS = [
    { label: "Taxable", value: "taxable" },
    { label: "Exempt", value: "exempt" },
    { label: "Nil Rated", value: "nil-rated" },
    { label: "Non GST", value: "non-gst" },
  ];

  const NATURE_OPTIONS = [
    { label: "Goods", value: "goods" },
    { label: "Service", value: "service" },
  ];

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
      _id: initialData?._id,
      productType,
      name: name.trim(),
      sku: sku.trim(),
      barcode: barcode.trim(),
      category: category.trim(),
      unit,
      productNature,
      hsnSac: hsnSac.trim(),
      taxability,
      purchasePrice: purchasePrice !== "" ? Number(purchasePrice) : undefined,
      sellingPrice: sellingPrice !== "" ? Number(sellingPrice) : undefined,
      mrp: mrp !== "" ? Number(mrp) : undefined,
      isTaxInclusive,
      gstRate,
      quantity: productNature === "goods" && openingStock !== "" ? Number(openingStock) : undefined,
      lowStockConfig: productNature === "goods" ? {
        minQty: minStock !== "" ? Number(minStock) : 5,
        warningQty: 10
      } : undefined,
      isBatchTracked: productNature === "goods" ? isBatchTracked : false,
      isExpiryTracked: productNature === "goods" ? isExpiryTracked : false,
      recipe: productType === "composite" ? recipe : undefined,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden flex flex-col max-h-[90vh] font-outfit"
          >
            {/* HEADER */}
            <div className="px-8 pt-8 pb-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  <Package className="w-3 h-3" />
                  Product Index
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tightest">
                  {isEditing ? "Edit" : "Provision"} <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">Asset</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-8 space-y-10 overflow-y-auto">

              {/* 1. IDENTITY LAYER */}
              <section>
                <SectionHeader icon={Fingerprint} title="1. Identity Layer" description="Core asset identification and classification." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <TextInput label="Designation Name" value={name} onChange={setName} placeholder="e.g. Premium Hub Cap" />
                  </div>
                  <TextInput label="SKU (Stock Keeping Unit)" value={sku} onChange={setSku} placeholder="Unique identifier code" />
                  <TextInput label="Barcode (UPC/EAN)" value={barcode} onChange={setBarcode} placeholder="Scan or enter barcode" />
                  <TextInput label="Category" value={category} onChange={setCategory} placeholder="Product classification" />
                  
                  <div className="space-y-2">
                    <SelectInput 
                      label="Disclosure Unit" 
                      value={unit} 
                      onChange={setUnit} 
                      options={Array.from(new Set([...safeUnits, "Custom"]))} 
                      disabled={isEditing} 
                    />
                    {unit === "Custom" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                        <TextInput label="Custom Metadata Unit" value={customUnit} onChange={setCustomUnit} onBlur={handleCustomUnit} placeholder="Enter singular unit name" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>

              {/* 2. COMPLIANCE LAYER */}
              <section className="pt-8 border-t border-white/5">
                <SectionHeader icon={ShieldCheck} title="2. Compliance Layer" description="Taxation, nature of supply, and regulatory codes." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectInput label="Product Nature" value={productNature} onChange={setProductNature} options={NATURE_OPTIONS} />
                  <TextInput label="HSN/SAC Code" value={hsnSac} onChange={setHsnSac} placeholder="Harmonized System Nomenclature" />
                  <SelectInput label="Taxability Status" value={taxability} onChange={setTaxability} options={TAXABILITY_OPTIONS} />
                </div>
              </section>

              {/* 3. FINANCIAL LAYER */}
              <section className="pt-8 border-t border-white/5">
                <SectionHeader icon={Coins} title="3. Financial Layer" description="Pricing, taxation, and valuation parameters." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput label="Purchase Price (Base Cost)" value={purchasePrice} onChange={setPurchasePrice} type="number" placeholder="0.00" icon="₹" />
                  <TextInput label="Suggested MRP" value={mrp} onChange={setMrp} type="number" placeholder="0.00" icon="₹" />
                  <TextInput label="Projected Selling Valuation" value={sellingPrice} onChange={setSellingPrice} type="number" placeholder="0.00" icon="₹" />
                  
                  {taxability === "taxable" && (
                    <SelectInput label="Fiscal Rate (GST)" value={gstRate} onChange={(val: string) => setGstRate(Number(val))} options={GST_RATES} />
                  )}
                  
                  <div className="md:col-span-2">
                    <Toggle 
                      active={isTaxInclusive} 
                      onChange={setIsTaxInclusive} 
                      label="Prices are Tax Inclusive" 
                      description="Enable if the selling and purchase prices already include GST." 
                    />
                  </div>
                </div>
              </section>

              {/* 4. LOGISTICS LAYER */}
              {productNature === "goods" && (
                <section className="pt-8 border-t border-white/5">
                  <SectionHeader icon={Truck} title="4. Logistics Layer" description="Inventory management, tracking, and stock controls." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput label="Opening Stock" value={openingStock} onChange={setOpeningStock} type="number" placeholder="0.00" disabled={isEditing} />
                    <TextInput label="Minimum Stock Warning" value={minStock} onChange={setMinStock} type="number" placeholder="0.00" />
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Toggle active={isBatchTracked} onChange={setIsBatchTracked} label="Batch Tracking" description="Track inventory by manufacturing batches." />
                      <Toggle active={isExpiryTracked} onChange={setIsExpiryTracked} label="Expiry Tracking" description="Track expiration dates for perishable items." />
                    </div>
                  </div>
                </section>
              )}

              {/* 5. STRUCTURE ARCHITECTURE */}
              <section className="pt-8 border-t border-white/5">
                <SectionHeader icon={Settings2} title="5. Structure Architecture" description="Configure if this asset is a standalone unit or a composite built from other assets." />
                <div className="space-y-6">
                  <div className="grid grid-cols-2 p-1.5 bg-black/40 rounded-[1.5rem] border border-white/10 relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    {[
                      { key: "simple", label: "Simple Unit", icon: Box },
                      { key: "composite", label: "Composite Rig", icon: Layers },
                    ].map(t => (
                      <button
                        key={t.key}
                        onClick={() => setProductType(t.key as any)}
                        className={`relative z-10 flex items-center justify-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300
                          ${productType === t.key ? "text-slate-950" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        {productType === t.key && (
                          <motion.div
                            layoutId="activeTabFormStruct"
                            className="absolute inset-0 bg-emerald-500 rounded-2xl shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <t.icon className={`relative z-20 w-4 h-4 ${productType === t.key ? "text-slate-950" : ""}`} />
                        <span className="relative z-20">{t.label}</span>
                      </button>
                    ))}
                  </div>

                  {productType === "composite" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-2"
                    >
                      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                        <RecipeBuilder
                          products={availableIngredients}
                          value={recipe}
                          onChange={setRecipe}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </section>

            </div>

            {/* FOOTER */}
            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between gap-6 bg-white/5 backdrop-blur-md">
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>

              <button
                disabled={!canSave}
                onClick={handleSave}
                className="flex-grow md:flex-none md:min-w-[200px] px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:bg-emerald-400 disabled:opacity-20 disabled:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isEditing ? "Conclude Revision" : "Initialize Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
