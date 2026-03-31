"use client";

import { useEffect } from "react";
import {
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { VoucherForm } from "./schema";
import { VoucherRow } from "./VoucherRow";
import { useGridNavigation } from "./hooks/useGridNavigation";
import { deriveGST } from "./hooks/useGSTEngine";
import { Plus } from "lucide-react";

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
  form:         UseFormReturn<VoucherForm>;   // full form object
  products:     ProductOption[];
  companyState: string;
  voucherType:  "Sale" | "Purchase";
}

export function VoucherGrid({ form, products, companyState, voucherType }: Props) {
  const { control, setValue, getValues, formState: { errors } } = form;


  const fieldArray = useFieldArray({ control, name: "items" });
  const nav        = useGridNavigation(fieldArray);

  // Watch partyState to trigger GST recalc for all rows (Trigger #2)
  const partyState = useWatch({ control, name: "partyState" });

  useEffect(() => {
    if (!partyState) return;
    const items = getValues("items");
    items.forEach((item, i) => {
      const product = products.find((p) => p._id === item.productId);
      if (!product) return;
      const { gstRate, taxType } = deriveGST(product, companyState, partyState);
      setValue(`items.${i}.gstRate`, gstRate);
      setValue(`items.${i}.taxType`, taxType);
    });
  }, [partyState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
            <th className="text-left px-2 py-2 w-48">Particulars</th>
            <th className="text-right px-2 py-2 w-20">Qty</th>
            <th className="text-center px-2 py-2 w-16">UOM</th>
            <th className="text-right px-2 py-2 w-24">Rate (₹)</th>
            <th className="text-right px-2 py-2 w-16">Disc %</th>
            <th className="text-right px-2 py-2 w-28">Amount (₹)</th>
            <th className="w-8" />
          </tr>
        </thead>

        <tbody>
          {fieldArray.fields.map((field, index) => (
            <VoucherRow
              key={field.id}
              fieldId={field.id}
              rowIndex={index}
              control={control}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              products={products}
              companyState={companyState}
              voucherType={voucherType}
              nav={nav}
              focusPendingRef={nav.focusPendingRef}
              onRemove={() => nav.removeRow(index)}
            />
          ))}
        </tbody>
      </table>

      {/* Add row button */}
      <button
        type="button"
        onClick={nav.appendRow}
        className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300
          transition-colors px-3 py-1.5 rounded border border-dashed border-emerald-500/30
          hover:border-emerald-500/60"
      >
        <Plus size={12} />
        Add item
      </button>

      {/* Array-level error (min 1 item) */}
      {errors.items?.root?.message && (
        <p className="mt-2 text-xs text-red-400">{errors.items.root.message}</p>
      )}
    </div>
  );
}
