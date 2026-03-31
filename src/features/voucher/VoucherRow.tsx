"use client";

/**
 * VoucherRow — memoised single item row.
 *
 * Focus consumption: on mount, checks focusPendingRef for "__LAST__" or its own fieldId.
 * If matched, grabs focus and clears the ref.
 */

import React, { useEffect, useCallback, MutableRefObject } from "react";
import { UseFormSetValue, UseFormGetValues, FieldErrors, Control, useWatch } from "react-hook-form";
import { VoucherForm } from "./schema";
import { ParticularsCell } from "./cells/ParticularsCell";
import { GridNavigation, FocusPending } from "./hooks/useGridNavigation";

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
  fieldId:       string;  // stable UUID from useFieldArray
  rowIndex:      number;
  control:       Control<VoucherForm>;
  setValue:      UseFormSetValue<VoucherForm>;
  getValues:     UseFormGetValues<VoucherForm>;
  errors:        FieldErrors<VoucherForm>;
  products:      ProductOption[];
  companyState:  string;
  voucherType:   "Sale" | "Purchase";
  nav:           GridNavigation;
  focusPendingRef: MutableRefObject<FocusPending | null>;
  onRemove:      () => void;
}

export const VoucherRow = React.memo(function VoucherRow({
  fieldId,
  rowIndex,
  control,
  setValue,
  getValues,
  errors,
  products,
  companyState,
  voucherType,
  nav,
  focusPendingRef,
  onRemove,
}: Props) {

  // Watch only this row's fields — no top-level watch
  const qty      = useWatch({ control, name: `items.${rowIndex}.qty`      });
  const rate     = useWatch({ control, name: `items.${rowIndex}.rate`     });
  const discount = useWatch({ control, name: `items.${rowIndex}.discount` });
  const gstRate  = useWatch({ control, name: `items.${rowIndex}.gstRate`  });

  // Derived display values — never in form state
  const amount  = (qty ?? 0) * (rate ?? 0) * (1 - (discount ?? 0) / 100);
  const taxAmt  = (amount * (gstRate ?? 0)) / 100;

  const partyState = getValues("partyState");

  // ── Focus consumption on mount (architecture pattern) ───────────────────
  useEffect(() => {
    const pending = focusPendingRef.current;
    if (!pending) return;

    const isThisRow =
      pending.rowId === fieldId ||
      pending.rowId === "__LAST__";

    if (isThisRow) {
      nav.gridRef.current.get(fieldId)?.[pending.col]?.focus();
      focusPendingRef.current = null;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => nav.unregisterRow(fieldId);
  }, [fieldId, nav]);

  // ── Cell ref registration ────────────────────────────────────────────────
  const registerCell = useCallback(
    (col: number) => (el: HTMLInputElement | null) => {
      nav.registerCell(fieldId, col, el);
    },
    [fieldId, nav]
  );

  // ── Keyboard handler factory ─────────────────────────────────────────────
  function onKey(col: number) {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        nav.navigate(fieldId, col, "next");
      }
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        nav.navigate(fieldId, col, "prev");
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        const v = (e.target as HTMLInputElement).value;
        if (v === "" && col === 0) onRemove();
      }
    };
  }

  const itemErrors = (errors.items as any)?.[rowIndex];

  return (
    <tr className="group border-b border-white/5 hover:bg-white/[0.03] transition-colors">
      {/* Particulars */}
      <td className="px-2 py-1 w-48">
        <ParticularsCell
          rowIndex={rowIndex}
          fieldId={fieldId}
          value={getValues(`items.${rowIndex}.productId`)}
          companyState={companyState}
          partyState={partyState}
          products={products}
          setValue={setValue}
          onSelect={() => nav.navigate(fieldId, 0, "next")}
          registerRef={registerCell(0)}
          error={itemErrors?.productId?.message}
        />
      </td>

      {/* Qty */}
      <td className="px-2 py-1 w-20">
        <input
          type="number"
          min={0}
          step="any"
          defaultValue={qty || ""}
          placeholder="0"
          ref={registerCell(1)}
          onKeyDown={onKey(1)}
          onChange={(e) => setValue(`items.${rowIndex}.qty`, parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm text-white text-right px-1 py-1 outline-none
            border-b border-transparent focus:border-emerald-500 transition-colors"
        />
        {itemErrors?.qty && (
          <span className="text-xs text-red-400">{itemErrors.qty.message}</span>
        )}
      </td>

      {/* UOM */}
      <td className="px-2 py-1 w-16 text-gray-400 text-sm text-center">
        {getValues(`items.${rowIndex}.uom`) || "—"}
      </td>

      {/* Rate */}
      <td className="px-2 py-1 w-24">
        <input
          type="number"
          min={0}
          step="any"
          defaultValue={rate || ""}
          placeholder="0.00"
          ref={registerCell(3)}
          onKeyDown={onKey(3)}
          onChange={(e) => setValue(`items.${rowIndex}.rate`, parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm text-white text-right px-1 py-1 outline-none
            border-b border-transparent focus:border-emerald-500 transition-colors"
        />
        {itemErrors?.rate && (
          <span className="text-xs text-red-400">{itemErrors.rate.message}</span>
        )}
      </td>

      {/* Discount % */}
      <td className="px-2 py-1 w-16">
        <input
          type="number"
          min={0}
          max={100}
          step="any"
          defaultValue={discount || ""}
          placeholder="0"
          ref={registerCell(4)}
          onKeyDown={onKey(4)}
          onChange={(e) => setValue(`items.${rowIndex}.discount`, parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm text-white text-right px-1 py-1 outline-none
            border-b border-transparent focus:border-emerald-500 transition-colors"
        />
      </td>

      {/* Amount — read-only, derived */}
      <td className="px-2 py-1 w-28 text-right">
        <span
          ref={(el) => nav.registerCell(fieldId, 5, el as any)}
          tabIndex={-1}
          className="text-sm text-white font-medium"
        >
          ₹{amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>
        {gstRate > 0 && (
          <span className="block text-xs text-gray-500">
            +{gstRate}% (₹{taxAmt.toFixed(0)})
          </span>
        )}
      </td>

      {/* Delete row button — visible on hover */}
      <td className="px-1 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 text-xs p-1"
          title="Remove row"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}, (prev, next) =>
  // Custom memo: only re-render if core props change
  prev.fieldId    === next.fieldId &&
  prev.rowIndex   === next.rowIndex &&
  prev.products   === next.products &&
  prev.errors     === next.errors
);
