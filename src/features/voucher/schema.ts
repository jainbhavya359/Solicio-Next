import { z } from "zod";

// ─── Item row (inventory line) ────────────────────────────────────────────────
export const ItemRowSchema = z.object({
  productId:   z.string().min(1, "Product is required"),
  productName: z.string(),
  qty:         z.number({ message: "Enter a quantity" })
                 .positive("Qty must be > 0"),
  uom:         z.string().min(1, "Unit is required"),
  rate:        z.number({ message: "Enter a rate" })
                 .nonnegative("Rate cannot be negative"),
  discount:    z.number().min(0).max(100),
  gstRate:     z.number().min(0).max(28),
  taxType:     z.enum(["CGST_SGST", "IGST", "NONE"]),
});

// ─── Addon row (non-inventory ledger: freight, rounding, etc.) ────────────────
export const AddonRowSchema = z.object({
  label: z.string().min(1),
  value: z.number(),          // can be negative (discount / rounding off)
});

// ─── Top-level voucher form ───────────────────────────────────────────────────
export const VoucherFormSchema = z.object({
  partyId:     z.string().min(1, "Party is required"),
  partyName:   z.string(),
  partyState:  z.string(),
  date:        z.string().min(1, "Date is required"),
  voucherType: z.enum(["Sale", "Purchase"]),
  items:       z.array(ItemRowSchema).min(1, "Add at least one item"),
  addons:      z.array(AddonRowSchema),
});

export type ItemRow       = z.infer<typeof ItemRowSchema>;
export type AddonRow      = z.infer<typeof AddonRowSchema>;
export type VoucherForm   = z.infer<typeof VoucherFormSchema>;

// ─── Empty row seed (used by useFieldArray.append) ───────────────────────────
export const emptyItemRow = (): ItemRow => ({
  productId:   "",
  productName: "",
  qty:         0,
  uom:         "",
  rate:        0,
  discount:    0,
  gstRate:     0,
  taxType:     "NONE",
});
