export const VOUCHER_RULES: Record<string, {
  prefix: string;
  debit: boolean;
  credit: boolean;
}> = {
  Purchase: { prefix: "PUR", debit: true, credit: false },
  Sale: { prefix: "SAL", debit: false, credit: true },
  PurchaseReturn: { prefix: "PRR", debit: false, credit: true },
  SaleReturn: { prefix: "SRR", debit: true, credit: false },
};

export const REVERSAL_VOUCHER_MAP: Record<string, string> = {
  Sale: "SaleReturn",
  Purchase: "PurchaseReturn",
};
