/**
 * useGSTEngine — pure function (no hooks, no side effects).
 * Called imperatively from ParticularsCell.onSelect and
 * VoucherGrid's useEffect on partyId change.
 *
 * GST Trigger Rules (from architecture lock):
 *   1. Product selected → call this function for that row
 *   2. Party changed   → call this function for ALL rows
 *   3. Rate edited     → do NOT call this function
 */

import { computeGST } from "@/src/utils/gst";

interface Product {
  gstRate: number;
  taxability?: "taxable" | "exempt" | "nil-rated" | "non-gst";
}

interface GSTResult {
  gstRate: number;
  taxType: "CGST_SGST" | "IGST" | "NONE";
}

export function deriveGST(
  product: Product,
  companyState: string,
  partyState: string
): GSTResult {
  // Exempt / nil / non-GST products
  if (
    !product ||
    product.taxability === "exempt" ||
    product.taxability === "nil-rated" ||
    product.taxability === "non-gst" ||
    product.gstRate === 0
  ) {
    return { gstRate: 0, taxType: "NONE" };
  }

  const result = computeGST({
    amount: 100,          // dummy amount — we only need the type
    rate: product.gstRate,
    companyState,
    partyState,
  });

  const taxType =
    result.type === "CGST_SGST" ? "CGST_SGST" :
    result.type === "IGST"      ? "IGST"       :
    "NONE";

  return { gstRate: product.gstRate, taxType };
}
