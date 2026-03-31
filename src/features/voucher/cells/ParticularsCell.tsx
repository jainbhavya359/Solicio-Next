"use client";

/**
 * ParticularsCell — Product search combobox.
 *
 * GST trigger point: the ONLY place deriveGST() is called for a single row.
 * On product select:  setValue(rate), setValue(gstRate), setValue(taxType), move focus
 */

import React, { useRef, useState, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { VoucherForm } from "../schema";
import { deriveGST } from "../hooks/useGSTEngine";

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

interface Props {
  rowIndex:    number;
  fieldId:     string;
  value:       string;             // current productId
  companyState: string;
  partyState:   string;
  products:    ProductOption[];
  setValue:    UseFormSetValue<VoucherForm>;
  onSelect:    (product: ProductOption) => void; // parent handles focus after select
  registerRef: (el: HTMLInputElement | null) => void;
  error?:      string;
}

export const ParticularsCell = React.memo(function ParticularsCell({
  rowIndex,
  value,
  companyState,
  partyState,
  products,
  setValue,
  onSelect,
  registerRef,
  error,
}: Props) {
  const [query,  setQuery]  = useState("");
  const [open,   setOpen]   = useState(false);
  const inputRef            = useRef<HTMLInputElement | null>(null);

  // Find the display name for the selected product
  const selectedProduct = products.find((p) => p._id === value);
  const displayValue    = selectedProduct?.name ?? query;

  const filtered = query.length > 0
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : products.slice(0, 10); // show first 10 when empty

  function handleSelect(product: ProductOption) {
    // 1. Set the productId + productName in form state
    setValue(`items.${rowIndex}.productId`,   product._id,   { shouldValidate: true });
    setValue(`items.${rowIndex}.productName`, product.name);
    setValue(`items.${rowIndex}.uom`,         product.unit);

    // 2. Derive GST (Trigger #1 from architecture doc)
    const { gstRate, taxType } = deriveGST(product, companyState, partyState);
    setValue(`items.${rowIndex}.gstRate`, gstRate);
    setValue(`items.${rowIndex}.taxType`, taxType);

    // 3. Auto-fill rate based on voucher direction
    const rate = product.sellingPrice; // Purchase screens will override via parent
    setValue(`items.${rowIndex}.rate`, rate);

    // 4. Close dropdown and clear query
    setQuery("");
    setOpen(false);

    // 5. Notify parent to move focus to Qty cell
    onSelect(product);
  }

  return (
    <div className="relative w-full">
      <input
        ref={(el) => {
          inputRef.current = el;
          registerRef(el);
        }}
        type="text"
        value={open ? query : displayValue}
        placeholder="Search product..."
        className={`w-full bg-transparent text-sm text-white px-2 py-1 outline-none
          border-b border-transparent focus:border-emerald-500 transition-colors
          ${error ? "border-red-500" : ""}`}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
      />
      {error && (
        <span className="absolute -bottom-4 left-0 text-xs text-red-400">{error}</span>
      )}
      {open && filtered.length > 0 && (
        <ul className="absolute top-full left-0 z-50 w-64 mt-1 rounded-lg border border-white/10
          bg-gray-900 shadow-xl max-h-52 overflow-y-auto">
          {filtered.map((p) => (
            <li
              key={p._id}
              className="flex justify-between px-3 py-2 text-sm hover:bg-white/10 cursor-pointer"
              onMouseDown={() => handleSelect(p)}
            >
              <span className="text-white">{p.name}</span>
              <span className="text-gray-400 text-xs">
                {p.quantity} {p.unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
