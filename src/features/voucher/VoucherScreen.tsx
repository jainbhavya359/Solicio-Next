"use client";

/**
 * VoucherScreen — top-level orchestrator for Sale and Purchase voucher entry.
 *
 * Responsibilities:
 *   - Party and date selection (VoucherHeader fields)
 *   - Fetching products once on mount
 *   - wiring useVoucherForm to VoucherGrid + VoucherSummary
 *   - Global keyboard shortcuts: Ctrl+A to save
 *
 * Does NOT:
 *   - Call watch() at this level
 *   - Store any derived monetary values in state
 */

import { useEffect, useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import { useVoucherForm } from "./hooks/useVoucherForm";
import { VoucherGrid }      from "./VoucherGrid";
import { VoucherSummary }   from "./VoucherSummary";
import { Loader2, Save, Printer } from "lucide-react";
import toast from "react-hot-toast";

interface ProductOption {
  _id: string;
  name: string;
  unit: string;
  sellingPrice: number;
  purchasePrice: number;
  gstRate: number;
  quantity: number;
  taxability?: "taxable" | "exempt" | "nil-rated" | "non-gst";
}

interface PartyOption {
  _id: string;
  name: string;
  state: string;
}

interface Props {
  voucherType:  "Sale" | "Purchase";
  companyState: string;
}

export function VoucherScreen({ voucherType, companyState }: Props) {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [parties,  setParties]  = useState<PartyOption[]>([]);
  const [loading,  setLoading]  = useState(true);

  const form = useVoucherForm({
      voucherType,
      onSuccess: (no) => toast.success(`${voucherType} ${no} saved!`),
    });
  const { control, setValue, submitVoucher, isSubmitting, formState: { errors } } = form;

  // ── Fetch masters on mount ────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [pRes, ptRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/parties"),
        ]);
        if (pRes.ok)  setProducts(await pRes.json());
        if (ptRes.ok) setParties(await ptRes.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Global Ctrl+A shortcut to save ────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      submitVoucher();
    }
  }, [submitVoucher]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={18} />
        Loading masters...
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-white/8 rounded-2xl p-6 space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {voucherType === "Sale" ? "Sale Invoice" : "Purchase Invoice"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {voucherType === "Sale"
              ? "Add items and save to generate a GST invoice."
              : "Record purchase from supplier with GST input credit."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border
              border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
          >
            <Printer size={13} />
            Print
          </button>
          <button
            type="button"
            onClick={submitVoucher}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium
              bg-emerald-500 hover:bg-emerald-400 text-black transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save (Ctrl+A)
          </button>
        </div>
      </div>

      {/* Party + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Party selector */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">
            {voucherType === "Sale" ? "Customer" : "Supplier"} *
          </label>
          <Controller
            name="partyId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  const party = parties.find((p) => p._id === e.target.value);
                  if (party) {
                    setValue("partyName",  party.name);
                    setValue("partyState", party.state);
                  }
                }}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2
                  text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">— Select party —</option>
                {parties.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            )}
          />
          {errors.partyId && (
            <p className="text-xs text-red-400 mt-1">{errors.partyId.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Date *</label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2
                  text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            )}
          />
        </div>
      </div>

      {/* Grid */}
      <VoucherGrid
        form={form}
        products={products}
        companyState={companyState}
        voucherType={voucherType}
      />

      {/* Summary */}
      <VoucherSummary control={control} />
    </div>
  );
}
