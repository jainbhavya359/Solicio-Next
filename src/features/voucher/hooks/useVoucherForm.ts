import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VoucherFormSchema, VoucherForm, emptyItemRow } from "../schema";
import toast from "react-hot-toast";

interface UseVoucherFormOptions {
  voucherType: "Sale" | "Purchase";
  onSuccess?: (voucherNo: string) => void;
}

export function useVoucherForm({
  voucherType,
  onSuccess,
}: UseVoucherFormOptions): UseFormReturn<VoucherForm> & {
  submitVoucher: () => Promise<void>;
  isSubmitting: boolean;
} {
  const form = useForm<VoucherForm>({
    resolver: zodResolver(VoucherFormSchema),
    defaultValues: {
      partyId:     "",
      partyName:   "",
      partyState:  "",
      date:        new Date().toISOString().slice(0, 10),
      voucherType,
      items:       [emptyItemRow()],
      addons:      [],
    },
  });

  const submitVoucher = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    const data = form.getValues();

    // Strip display-only fields (amount, productName) — backend computes them
    const payload = {
      partyId:     data.partyId,
      date:        data.date,
      voucherType: data.voucherType,
      items: data.items.map(({ productId, qty, uom, rate, discount, gstRate, taxType }) => ({
        productId,
        qty,
        uom,
        rate,
        discount,
        gstRate,
        taxType,
      })),
      addons: data.addons,
    };

    try {
      const res = await fetch("/api/billing", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message ?? "Failed to save voucher.");
        return;
      }

      const { voucherNo } = await res.json();
      toast.success(`Voucher ${voucherNo} saved!`);
      onSuccess?.(voucherNo);
      form.reset({
        ...form.getValues(),
        items:  [emptyItemRow()],
        addons: [],
      });
    } catch {
      toast.error("Network error — voucher not saved.");
    }
  };

  return {
    ...form,
    submitVoucher,
    isSubmitting: form.formState.isSubmitting,
  };
}
