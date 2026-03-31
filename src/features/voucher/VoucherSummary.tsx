"use client";

/**
 * VoucherSummary — totals panel.
 * Uses useWatch at this component level only. NEVER watch at VoucherScreen level.
 */

import { useWatch, Control } from "react-hook-form";
import { VoucherForm } from "./schema";

interface Props {
  control: Control<VoucherForm>;
}

export function VoucherSummary({ control }: Props) {
  const items  = useWatch({ control, name: "items"  });
  const addons = useWatch({ control, name: "addons" });

  let subtotal    = 0;
  let totalCGST   = 0;
  let totalSGST   = 0;
  let totalIGST   = 0;

  (items ?? []).forEach((item) => {
    const qty   = item.qty      ?? 0;
    const rate  = item.rate     ?? 0;
    const disc  = item.discount ?? 0;
    const gst   = item.gstRate  ?? 0;
    const amt   = qty * rate * (1 - disc / 100);
    const tax   = (amt * gst) / 100;

    subtotal += amt;

    if (item.taxType === "CGST_SGST") {
      totalCGST += tax / 2;
      totalSGST += tax / 2;
    } else if (item.taxType === "IGST") {
      totalIGST += tax;
    }
  });

  const addonTotal  = (addons ?? []).reduce((s, a) => s + (a.value ?? 0), 0);
  const totalTax    = totalCGST + totalSGST + totalIGST;
  const grandTotal  = subtotal + totalTax + addonTotal;
  const roundingOff = Math.round(grandTotal) - grandTotal;
  const finalTotal  = grandTotal + roundingOff;

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div className="mt-4 ml-auto w-64 text-sm">
      <div className="space-y-1 border-t border-white/10 pt-3">
        <Row label="Subtotal"   value={fmt(subtotal)}  />
        {totalCGST > 0 && <Row label="CGST"    value={fmt(totalCGST)} />}
        {totalSGST > 0 && <Row label="SGST"    value={fmt(totalSGST)} />}
        {totalIGST > 0 && <Row label="IGST"    value={fmt(totalIGST)} />}
        {addonTotal !== 0 && <Row label="Addons" value={fmt(addonTotal)} />}
        {Math.abs(roundingOff) > 0.001 && (
          <Row label="Rounding Off" value={fmt(roundingOff)} dim />
        )}
      </div>
      <div className="flex justify-between pt-2 mt-2 border-t border-white/20 font-semibold text-white">
        <span>Grand Total</span>
        <span>₹{fmt(finalTotal)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className={`flex justify-between ${dim ? "text-gray-500" : "text-gray-300"}`}>
      <span>{label}</span>
      <span>₹{value}</span>
    </div>
  );
}
